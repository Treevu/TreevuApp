import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';

// Rutas
import AppRoutes from '@/routes/AppRoutes';

// Contexts
import { ModalProvider, ModalRenderer } from '@/contexts/ModalContext';
import { ThemeProvider } from '@/contexts/ThemeContext.tsx';

// Components
import PilotNotice from '@/features/notifications/PilotNotice';
import EthicalPromise from '@/features/notifications/EthicalPromise';
import ErrorBoundary from '@/components/layout/ErrorBoundary';

// Types
import { type CurrentUserType } from '@/features/employer/EmployerDashboard';

const App: React.FC = () => {
    const [authenticatedUser, setAuthenticatedUser] = useState<CurrentUserType | null>(null);
    const [showPilotNotice, setShowPilotNotice] = useState(false);
    const [showEthicalPromise, setShowEthicalPromise] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('treevu-ethical-promise-seen') !== 'true') {
            setShowEthicalPromise(true);
        } else if (sessionStorage.getItem('treevu-pilot-notice-seen') !== 'true') {
            setShowPilotNotice(true);
        }
    }, []);
    
    const handleAcceptPromise = () => {
        localStorage.setItem('treevu-ethical-promise-seen', 'true');
        setShowEthicalPromise(false);
        if (sessionStorage.getItem('treevu-pilot-notice-seen') !== 'true') {
            setShowPilotNotice(true);
        }
    };

    const handleDismissPilotNotice = () => {
        sessionStorage.setItem('treevu-pilot-notice-seen', 'true');
        setShowPilotNotice(false);
    };
    
    if (showEthicalPromise) {
        return <EthicalPromise onAccept={handleAcceptPromise} />;
    }

    return (
        <ThemeProvider>
            <BrowserRouter>
                <ModalProvider>
                    <ErrorBoundary>
                        <AppRoutes/>
                        <ModalRenderer />
                    </ErrorBoundary>
                    {showPilotNotice && <PilotNotice onClose={handleDismissPilotNotice} />}
                </ModalProvider>
            </BrowserRouter>
        </ThemeProvider>
    );
};

export default App;