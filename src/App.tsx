import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';

// PrimeReact
import { PrimeReactProvider } from 'primereact/api';

// Rutas
import AppRoutes from '@/routes/AppRoutes';

// Contexts (mantenemos solo ThemeProvider)
import { ThemeProvider } from '@/contexts/ThemeContext.tsx';

// Components
import PilotNotice from '@/features/notifications/PilotNotice';
import EthicalPromise from '@/features/notifications/EthicalPromise';
import ErrorBoundary from '@/components/layout/ErrorBoundary';
import { ZustandModalRenderer } from '@/components/modals/ZustandModalRenderer';

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
        <PrimeReactProvider>
            <ThemeProvider>
                <BrowserRouter>
                    <ErrorBoundary>
                        <AppRoutes/>
                        <ZustandModalRenderer />
                    </ErrorBoundary>
                    {showPilotNotice && <PilotNotice onClose={handleDismissPilotNotice} />}
                </BrowserRouter>
            </ThemeProvider>
        </PrimeReactProvider>
    );
};

export default App;