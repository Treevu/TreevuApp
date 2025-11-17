import React, { createContext, useState, useContext, ReactNode, useMemo, useEffect, useCallback } from 'react';
import { levelData } from '../services/gamificationService';
import { trackEvent } from '../services/analyticsService';
import { TreevuLevel } from '../types/common';
import { User, Reward, RedeemedReward, BadgeType } from '../types/user';
import { generateUniqueId } from '../utils';
import { verifyCompanyAlliance } from '../services/companyService';
import { CompanyAlliance, Department, Modality, Tenure, AgeRange } from '../types/employer';
import { ArchetypeKey, archetypeData } from '../data/archetypes';


interface AuthContextType {
    user: User | null;
    signIn: (email: string, pass: string) => Promise<void>;
    signUp: (name: string, email: string, pass: string) => Promise<void>;
    signOut: () => void;
    updateUser: (details: Partial<User>) => void;
    updateUserProgress: (progressUpdate: Partial<User['progress']>) => void;
    addTreevus: (amount: number) => void;
    redeemTreevusForReward: (reward: Reward) => void;
    updateUserStreak: (streak: { count: number; lastDate: string }) => void;
    prestigeUp: () => void;
    completeLesson: (lessonId: string) => void;
    recordUserActivity: () => void;
    linkCompany: (codeOrEmail: string) => Promise<CompanyAlliance>;
    skipCompanyLink: () => void;
    acceptEthicalPromise: () => void;
    completeOnboarding: () => void;
    signInAsArchetype: (archetypeKey: ArchetypeKey) => void;
    completeProfileSetup: (profileData: {
        name: string;
        documentId: string;
        department: Department;
        tenure: Tenure;
        modality: Modality;
        ageRange: AgeRange;
    }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        try {
            const savedUser = localStorage.getItem('treevu-user');
            if (savedUser) {
                const userObject = JSON.parse(savedUser) as User;
                // Ensure the progress object is always valid and complete to prevent crashes.
                userObject.progress = {
                    expensesCount: userObject.progress?.expensesCount || 0,
                    formalityIndex: userObject.progress?.formalityIndex || 0,
                };
                userObject.completedLessons = userObject.completedLessons || [];
                setUser(userObject);
            }
        } catch (e) {
            console.error("Failed to parse user from localStorage", e);
            localStorage.removeItem('treevu-user');
        }
        setIsInitialLoad(false);
    }, []);

    useEffect(() => {
        if (isInitialLoad) return;
        try {
            if (user) {
                localStorage.setItem('treevu-user', JSON.stringify(user));
            } else {
                localStorage.removeItem('treevu-user');
            }
        } catch (e) {
            console.error("Failed to save user to localStorage", e);
        }
    }, [user, isInitialLoad]);


    const recordUserActivity = useCallback(() => {
        setUser(currentUser => {
            if (!currentUser) return null;
            return { ...currentUser, lastActivityDate: new Date().toISOString() };
        });
    }, []);

    const updateUser = useCallback((details: Partial<User>) => {
        setUser(currentUser => {
            if (!currentUser) return null;
            return { ...currentUser, ...details, lastActivityDate: new Date().toISOString() };
        });
    }, []);

    const updateUserProgress = useCallback((progressUpdate: Partial<User['progress']>) => {
        setUser(currentUser => {
            if (!currentUser) return null;
            const updatedProgress = {
                ...currentUser.progress,
                ...progressUpdate
            };
            return { ...currentUser, progress: updatedProgress, lastActivityDate: new Date().toISOString() };
        });
    }, []);
    
    const addTreevus = useCallback((amount: number) => {
        setUser(currentUser => {
            if (!currentUser) return null;
            const newTotal = Math.max(0, (currentUser.treevus || 0) + amount);
            return { ...currentUser, treevus: newTotal, lastActivityDate: new Date().toISOString() };
        });
    }, []);

    const completeLesson = useCallback((lessonId: string) => {
        setUser(currentUser => {
            if (!currentUser || currentUser.completedLessons?.includes(lessonId)) {
                return currentUser;
            }
            const updatedLessons = [...(currentUser.completedLessons || []), lessonId];
            return { ...currentUser, completedLessons: updatedLessons, lastActivityDate: new Date().toISOString() };
        });
    }, []);
    
    const redeemTreevusForReward = useCallback((reward: Reward) => {
        setUser(currentUser => {
            if (!currentUser || currentUser.treevus < reward.costInTreevus) return currentUser;

            const newRedeemedReward: RedeemedReward = {
                rewardId: reward.id,
                title: reward.title,
                icon: reward.icon,
                date: new Date().toISOString(),
                costInTreevus: reward.costInTreevus,
                description: reward.description,
            };

            const updatedUser: User = {
                ...currentUser,
                treevus: currentUser.treevus - reward.costInTreevus,
                redeemedRewards: [...(currentUser.redeemedRewards || []), newRedeemedReward],
                lastActivityDate: new Date().toISOString(),
            };
            
            return updatedUser;
        });
    }, []);

    const updateUserStreak = useCallback((streak: { count: number; lastDate: string }) => {
        setUser(currentUser => {
            if (!currentUser) return null;
            return { ...currentUser, streak, lastActivityDate: new Date().toISOString() };
        });
    }, []);
    
    const prestigeUp = useCallback(() => {
        setUser(currentUser => {
            if (!currentUser || currentUser.level !== TreevuLevel.Bosque) return currentUser;
            return {
                ...currentUser,
                level: TreevuLevel.Brote,
                progress: { expensesCount: 0, formalityIndex: 0 },
                prestigeLevel: (currentUser.prestigeLevel || 0) + 1,
                lastActivityDate: new Date().toISOString(),
            };
        });
    }, []);

    const signUp = useCallback(async (name: string, email: string, pass: string) => {
        await new Promise(res => setTimeout(res, 1000));
        
        const newUser: User = {
            id: generateUniqueId(),
            name,
            email,
            picture: `https://ui-avatars.com/api/?name=${name.split(' ').join('+')}&background=random&color=fff&size=128&bold=true`,
            level: TreevuLevel.Brote,
            progress: { expensesCount: 0, formalityIndex: 0 },
            treevus: 0,
            isProfileComplete: false, 
            kudosSent: 0,
            kudosReceived: 0,
            registrationDate: new Date().toISOString(),
            lastActivityDate: new Date().toISOString(),
            rewardsClaimedCount: 0,
            engagementScore: 0,
            fwiTrend: 'stable',
            isCompanyLinkComplete: false,
            hasCorporateCard: undefined,
            hasAcceptedEthicalPromise: false,
            hasCompletedOnboarding: false,
        };
        
        setUser(newUser);
        trackEvent('session_start', { type: 'signup' }, newUser);
    }, []);

    const signIn = useCallback(async (email: string, pass: string) => {
        await new Promise(res => setTimeout(res, 1000));
        if (user) {
             trackEvent('session_start', { type: 'login' }, user);
             return; 
        }
        // This is a fallback if someone tries to log in without choosing an archetype
        const defaultUser: User = {
            id: generateUniqueId(),
            name: 'Usuario de Prueba',
            email: email,
            picture: `https://ui-avatars.com/api/?name=UP&background=random&color=fff&size=128&bold=true`,
            level: TreevuLevel.Arbusto,
            progress: { expensesCount: 55, formalityIndex: 71 },
            treevus: 2800,
            isProfileComplete: true,
            hasCorporateCard: true,
            department: 'Tecnología e Innovación',
            streak: { count: 3, lastDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
            kudosSent: 15,
            kudosReceived: 25,
            tribeId: 'andromeda-3',
            featuredBadge: 'pioneer',
            prestigeLevel: 0,
            registrationDate: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
            lastActivityDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            rewardsClaimedCount: 1,
            engagementScore: 72,
            fwiTrend: 'stable',
            isCompanyLinkComplete: true,
            hasAcceptedEthicalPromise: true,
            hasCompletedOnboarding: true,
        };
        setUser(defaultUser);
        trackEvent('session_start', { type: 'login' }, defaultUser);
    }, [user]);

    const signOut = useCallback(() => {
        setUser(null);
        localStorage.clear();
        window.location.reload();
    }, []);

    const linkCompany = useCallback(async (codeOrEmail: string): Promise<CompanyAlliance> => {
        const company = await verifyCompanyAlliance(codeOrEmail);
        updateUser({
            companyId: company.id,
            companyName: company.name,
            branding: company.branding,
            isCompanyLinkComplete: true,
        });
        return company;
    }, [updateUser]);

    const skipCompanyLink = useCallback(() => {
        updateUser({ isCompanyLinkComplete: true });
    }, [updateUser]);

    const acceptEthicalPromise = useCallback(() => {
        updateUser({ hasAcceptedEthicalPromise: true });
    }, [updateUser]);

    const completeOnboarding = useCallback(() => {
        updateUser({ hasCompletedOnboarding: true });
        addTreevus(50);
    }, [updateUser, addTreevus]);

    const signInAsArchetype = useCallback((archetypeKey: ArchetypeKey) => {
        const data = archetypeData[archetypeKey];
        
        // Clear previous session and set up the new one
        localStorage.clear();
        localStorage.setItem('treevu-user', JSON.stringify(data.user));
        localStorage.setItem('treevu-expenses', JSON.stringify(data.expenses));
        localStorage.setItem('treevu-goals', JSON.stringify(data.goals));
        localStorage.setItem('treevu-budget', data.budget.toString());
        localStorage.setItem('treevu-annualIncome', data.annualIncome.toString());
        localStorage.setItem('treevu-notifications', JSON.stringify(data.notifications));

        trackEvent('session_start', { type: 'archetype', archetype: archetypeKey }, data.user);

        // Set user state to immediately grant access, then reload to ensure all contexts are in sync
        setUser(data.user);
        window.location.reload();
    }, []);

    const completeProfileSetup = useCallback((profileData: {
        name: string;
        documentId: string;
        department: Department;
        tenure: Tenure;
        modality: Modality;
        ageRange: AgeRange;
    }) => {
        updateUser({
            ...profileData,
            isProfileComplete: true,
        });
        addTreevus(50);
    }, [updateUser, addTreevus]);


    const value = useMemo(() => ({
        user,
        signIn,
        signUp,
        signOut,
        updateUser,
        updateUserProgress,
        addTreevus,
        redeemTreevusForReward,
        updateUserStreak,
        prestigeUp,
        completeLesson,
        recordUserActivity,
        linkCompany,
        skipCompanyLink,
        acceptEthicalPromise,
        completeOnboarding,
        signInAsArchetype,
        completeProfileSetup,
    }), [user, signIn, signUp, signOut, updateUser, updateUserProgress, addTreevus, redeemTreevusForReward, updateUserStreak, prestigeUp, completeLesson, recordUserActivity, linkCompany, skipCompanyLink, acceptEthicalPromise, completeOnboarding, signInAsArchetype, completeProfileSetup]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};