import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ArchetypeSelection from '@/components/auth/ArchetypeSelection';
import MainApp from '@/features/dashboard/MainApp';
import ProfileSetup from '@/components/auth/ProfileSetup';

interface AppRouterProps {
    onBackToPortal: () => void;
}

const AppRouter: React.FC<AppRouterProps> = ({ onBackToPortal }) => {
    const { user } = useAuth();

    if (!user) {
        return <ArchetypeSelection onBack={onBackToPortal} />;
    }

    if (!user.isProfileComplete) {
        return <ProfileSetup onBack={onBackToPortal} />;
    }

    return <MainApp />;
};

export default AppRouter;