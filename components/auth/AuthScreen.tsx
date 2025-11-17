import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import PilotNotice from '../PilotNotice';
import ArchetypeSelection from '../ArchetypeSelection';
import { AccessPortal } from '../AccessPortal';
import BusinessWelcome from '../employer/BusinessWelcome';
import EmployerDashboard from '../employer/EmployerDashboard';
import { type CurrentUserType } from '../../types/employer';
import MerchantLogin from '../merchant/MerchantLogin';
import MerchantPortal from '../merchant/MerchantPortal';
import { MerchantUser } from '../../data/merchantData';

const AuthScreen: React.FC = () => {
    const [view, setView] = useState<'portal' | 'pilotNotice' | 'archetypes' | 'employerLogin' | 'merchantLogin'>('portal');
    const [employerUser, setEmployerUser] = useState<CurrentUserType | null>(null);
    const [merchantUser, setMerchantUser] = useState<MerchantUser | null>(null);
    const { user } = useAuth();

    const handleEmployerLoginSuccess = (user: CurrentUserType) => {
        setEmployerUser(user);
    };
    
    const handleEmployerSignOut = () => {
        setEmployerUser(null);
        setView('portal');
    };

    const handleMerchantLoginSuccess = (user: MerchantUser) => {
        setMerchantUser(user);
    };

    const handleMerchantSignOut = () => {
        setMerchantUser(null);
        setView('portal');
    }
    
    if (user) {
        return null; 
    }
    
    if (employerUser) {
        return <EmployerDashboard user={employerUser} onSignOut={handleEmployerSignOut} />;
    }

    if (merchantUser) {
        return <MerchantPortal user={merchantUser} onSignOut={handleMerchantSignOut} />;
    }

    const renderContent = () => {
        switch (view) {
            case 'pilotNotice':
                return <PilotNotice onClose={() => setView('archetypes')} />;
            case 'archetypes':
                return <ArchetypeSelection onBack={() => setView('portal')} />;
            case 'employerLogin':
                return <BusinessWelcome onLoginSuccess={handleEmployerLoginSuccess} onBack={() => setView('portal')} />;
            case 'merchantLogin':
                return <MerchantLogin onLoginSuccess={handleMerchantLoginSuccess} onBack={() => setView('portal')} />;
            case 'portal':
            default:
                return (
                    <AccessPortal
                        onPeopleDemo={() => setView('pilotNotice')}
                        onBusinessDemo={() => setView('employerLogin')}
                        onMerchantsDemo={() => setView('merchantLogin')}
                    />
                );
        }
    };

    return (
        <div className="dark w-full h-full flex flex-col items-center justify-center">
            {renderContent()}
        </div>
    );
};

export default AuthScreen;