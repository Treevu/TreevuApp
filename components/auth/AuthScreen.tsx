import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import PilotNotice from '../PilotNotice';
import ArchetypeSelection from '../ArchetypeSelection';
import { AccessPortal } from '../AccessPortal';
import BusinessWelcome from '../employer/BusinessWelcome';
import EmployerDashboard from '../employer/EmployerDashboard';
import { type CurrentUserType } from '../../types/employer';

const AuthScreen: React.FC = () => {
    const [view, setView] = useState<'portal' | 'pilotNotice' | 'archetypes' | 'employerLogin'>('portal');
    const [employerUser, setEmployerUser] = useState<CurrentUserType | null>(null);
    const { user } = useAuth(); // We still need the user from context to know when to stop showing this screen

    const handleLoginSuccess = (user: CurrentUserType) => {
        setEmployerUser(user);
    };
    
    const handleEmployerSignOut = () => {
        setEmployerUser(null);
        setView('portal');
    };

    const handleSelectUserType = (type: 'person' | 'employer') => {
        if (type === 'person') {
            setView('pilotNotice');
        } else {
            setView('employerLogin');
        }
    };
    
    // If a normal user is logged in via archetypes, the AppRouter will take over.
    // This component only handles the pre-login flow and the employer dashboard session.
    if (user) {
        return null; 
    }
    
    if (employerUser) {
        return <EmployerDashboard user={employerUser} onSignOut={handleEmployerSignOut} />;
    }

    const renderContent = () => {
        switch (view) {
            case 'pilotNotice':
                return <PilotNotice onClose={() => setView('archetypes')} />;
            case 'archetypes':
                return <ArchetypeSelection onBack={() => setView('portal')} />;
            case 'employerLogin':
                return <BusinessWelcome onLoginSuccess={handleLoginSuccess} onBack={() => setView('portal')} />;
            case 'portal':
            default:
                return <AccessPortal onSelectType={handleSelectUserType} />;
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            {renderContent()}
        </div>
    );
};

export default AuthScreen;