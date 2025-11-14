import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import MainApp from './MainApp';
import AuthScreen from './auth/AuthScreen';
import LinkCompanyScreen from './auth/LinkCompanyScreen';
import EthicalPromise from './EthicalPromise';
import OnboardingWizard from './OnboardingWizard';
import ProfileSetup from './ProfileSetup';
import CorporateCardScreen from './auth/CorporateCardScreen';

const AppRouter: React.FC = () => {
    const { user, signOut } = useAuth();

    if (!user) {
        return <AuthScreen />;
    }
    
    if (!user.isCompanyLinkComplete) {
        return <LinkCompanyScreen />;
    }

    if (user.companyId && typeof user.hasCorporateCard === 'undefined') {
        return <CorporateCardScreen />;
    }
    
    if (!user.hasAcceptedEthicalPromise) {
        return <EthicalPromise />;
    }

    if (!user.isProfileComplete) {
        return <ProfileSetup onBack={signOut} />;
    }

    if (!user.hasCompletedOnboarding) {
        return <OnboardingWizard />;
    }

    return <MainApp />;
};

export default AppRouter;