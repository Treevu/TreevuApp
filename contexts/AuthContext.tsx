import React, { createContext, useState, useContext, ReactNode, useMemo, useEffect, useCallback } from 'react';
import { levelData } from '../services/gamificationService';
import { archetypeData, ArchetypeKey } from '../data/archetypes';

import { TreevuLevel } from '../types/common';
import { Department, Modality, Tenure, AgeRange } from '../types/employer';
import { User, Reward, RedeemedReward, BadgeType } from '../types/user';

interface AuthContextType {
    user: User | null;
    signInAsArchetype: (archetypeKey: ArchetypeKey) => void;
    signOut: () => void;
    updateUserProgress: (progress: Partial<User['progress']>) => void;
    updateUser: (details: Partial<User>) => void;
    completeProfileSetup: (details: {
        name: string;
        documentId: string;
        department: Department;
        tenure: Tenure;
        modality: Modality;
        ageRange: AgeRange;
    }) => void;
    addTreevus: (amount: number) => void;
    redeemTreevusForReward: (reward: Reward) => void;
    updateUserStreak: (streak: { count: number; lastDate: string }) => void;
    prestigeUp: () => void;
    completeLesson: (lessonId: string) => void;
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

    // Effect for automatic level-up
    useEffect(() => {
        if (!user || !user.progress) return;

        let newLevel = user.level;
        let didLevelUp = false;

        while (true) {
            const currentLevelData = levelData[newLevel];
            if (!currentLevelData || !currentLevelData.nextLevel) {
                break;
            }

            const nextLevelData = levelData[currentLevelData.nextLevel];
            const goals = nextLevelData.goals;
            
            const expensesGoalMet = !goals.expensesCount || user.progress.expensesCount >= goals.expensesCount;
            const formalityGoalMet = !goals.formalityIndex || user.progress.formalityIndex >= goals.formalityIndex;

            if (expensesGoalMet && formalityGoalMet) {
                newLevel = currentLevelData.nextLevel;
                didLevelUp = true;
            } else {
                break;
            }
        }
        
        if (didLevelUp) {
            setUser(currentUser => currentUser ? { ...currentUser, level: newLevel } : null);
        }

    }, [user?.progress.expensesCount, user?.progress.formalityIndex]);


    const updateUserProgress = useCallback((progress: Partial<User['progress']>) => {
        setUser(currentUser => {
            if (!currentUser) return null;
            const currentProgress = currentUser.progress || { expensesCount: 0, formalityIndex: 0 };
            const updatedProgress = { ...currentProgress, ...progress };
            return { ...currentUser, progress: updatedProgress };
        });
    }, []);

    const updateUser = useCallback((details: Partial<User>) => {
        setUser(currentUser => {
            if (!currentUser) return null;
            return { ...currentUser, ...details };
        });
    }, []);
    
    const addTreevus = useCallback((amount: number) => {
        setUser(currentUser => {
            if (!currentUser) return null;
            const newTotal = Math.max(0, (currentUser.treevus || 0) + amount);
            return { ...currentUser, treevus: newTotal };
        });
    }, []);

    const completeLesson = useCallback((lessonId: string) => {
        setUser(currentUser => {
            if (!currentUser || currentUser.completedLessons?.includes(lessonId)) {
                return currentUser;
            }
            const updatedLessons = [...(currentUser.completedLessons || []), lessonId];
            return { ...currentUser, completedLessons: updatedLessons };
        });
    }, []);

    const completeProfileSetup = useCallback((details: { name: string; documentId: string; department: Department; tenure: Tenure; modality: Modality; ageRange: AgeRange; }) => {
        setUser(currentUser => {
            if (!currentUser) return null;
            return { 
                ...currentUser, 
                ...details,
                isProfileComplete: true 
            };
        });
        addTreevus(50);
    }, [addTreevus]);
    
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
            };
            
            return updatedUser;
        });
    }, []);

    const updateUserStreak = useCallback((streak: { count: number; lastDate: string }) => {
        setUser(currentUser => {
            if (!currentUser) return null;
            return { ...currentUser, streak };
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
            };
        });
    }, []);

    const signInAsArchetype = useCallback((archetypeKey: ArchetypeKey) => {
        const data = archetypeData[archetypeKey];
        if (!data) {
            console.error(`Archetype "${archetypeKey}" not found.`);
            return;
        }

        // Clear previous session data before setting new data
        localStorage.removeItem('treevu-expenses');
        localStorage.removeItem('treevu-goals');
        localStorage.removeItem('treevu-budget');
        localStorage.removeItem('treevu-annualIncome');
        localStorage.removeItem('treevu-notifications');
        localStorage.removeItem('treevu-tribes');
        
        // Set new data in localStorage for other contexts to pick up on mount
        localStorage.setItem('treevu-expenses', JSON.stringify(data.expenses));
        localStorage.setItem('treevu-goals', JSON.stringify(data.goals));
        localStorage.setItem('treevu-budget', data.budget.toString());
        localStorage.setItem('treevu-annualIncome', data.annualIncome.toString());
        localStorage.setItem('treevu-notifications', JSON.stringify(data.notifications));
        
        // Finally, set the user state to trigger the app navigation
        setUser(data.user);
    }, []);


    const signOut = useCallback(() => {
        setUser(null);
        // Clean up all data to ensure a fresh start on next login
        localStorage.removeItem('treevu-user');
        localStorage.removeItem('treevu-expenses');
        localStorage.removeItem('treevu-goals');
        localStorage.removeItem('treevu-budget');
        localStorage.removeItem('treevu-annualIncome');
        localStorage.removeItem('treevu-notifications');
        localStorage.removeItem('treevu-tribes');
    }, []);

    const value = useMemo(() => ({
        user,
        signInAsArchetype,
        signOut,
        updateUserProgress,
        updateUser,
        completeProfileSetup,
        addTreevus,
        redeemTreevusForReward,
        updateUserStreak,
        prestigeUp,
        completeLesson,
    }), [user, signInAsArchetype, signOut, updateUserProgress, updateUser, completeProfileSetup, addTreevus, redeemTreevusForReward, updateUserStreak, prestigeUp, completeLesson]);

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