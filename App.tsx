
import React, { useState, useEffect, Suspense } from 'react';

// Flujo del Empleador
const EmployerDashboard = React.lazy(() => import('./components/employer/EmployerDashboard'));
const BusinessWelcome = React.lazy(() => import('./components/employer/BusinessWelcome'));
import { type CurrentUserType } from './components/employer/EmployerDashboard';

// Flujo para Personas
const AppRouter = React.lazy(() => import('./components/AppRouter'));
import { AuthProvider } from './contexts/AuthContext';
import { ModalProvider, ModalRenderer } from './contexts/ModalContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Nuevos proveedores de contexto optimizados
import { AlertProvider } from './contexts/AlertContext';
// FIX: Correctly import AppProvider. The file was previously empty, causing a module error.
import { AppProvider } from './contexts/AppContext';


// Nuevo Portal de Acceso
// FIX: Changed to a named import as 'AccessPortal' does not have a default export.
import { AccessPortal } from './components/AccessPortal';
import PilotNotice from './components/PilotNotice';
import EthicalPromise from './components/EthicalPromise';
import Spinner from './components/Spinner';
import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
    // Estado para determinar qué aplicación mostrar: 'person', 'employer', o null para el portal.
    const [appMode, setAppMode] = useState<'person' | 'employer' | null>(null);
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
        // After accepting promise, show pilot notice if not seen
        if (sessionStorage.getItem('treevu-pilot-notice-seen') !== 'true') {
            setShowPilotNotice(true);
        }
    };

    const handleDismissPilotNotice = () => {
        sessionStorage.setItem('treevu-pilot-notice-seen', 'true');
        setShowPilotNotice(false);
    };

    const handleSignOut = () => {
        setAuthenticatedUser(null);
        // Regresamos al portal de selección de empresa/persona.
        setAppMode(null);
    };
    
    const handleBackToPortal = () => {
        setAppMode(null);
    }
    
    if (showEthicalPromise) {
        return <EthicalPromise onAccept={handleAcceptPromise} />;
    }

    let content;
    // --- Renderizado del Flujo para Personas ---
    if (appMode === 'person') {
        content = (
            <AuthProvider>
                {/* FIX: The ModalProvider was throwing a 'missing children' error. This was due to an issue with how the component's props were typed. The fix has been applied in `contexts/ModalContext.tsx` by changing its definition to correctly handle children props. */}
                <ModalProvider>
                    <NotificationProvider>
                        <AlertProvider>
                            <AppProvider>
                                <ErrorBoundary>
                                    <Suspense fallback={<div className="w-full h-full flex items-center justify-center"><Spinner/></div>}>
                                        <AppRouter onBackToPortal={handleBackToPortal} />
                                    </Suspense>
                                    <ModalRenderer />
                                </ErrorBoundary>
                            </AppProvider>
                        </AlertProvider>
                    </NotificationProvider>
                </ModalProvider>
            </AuthProvider>
        );
    }
    // --- Renderizado del Flujo del Empleador ---
    else if (appMode === 'employer') {
        content = (
            // FIX: The ModalProvider was throwing a 'missing children' error. This was due to an issue with how the component's props were typed. The fix has been applied in `contexts/ModalContext.tsx` by changing its definition to correctly handle children props. */}
            <ModalProvider>
                <div>
                    <div className="min-h-screen bg-background text-on-surface">
                        <ErrorBoundary>
                            <Suspense fallback={<div className="w-full h-screen flex items-center justify-center"><Spinner/></div>}>
                                { !authenticatedUser ? (
                                    <BusinessWelcome onLoginSuccess={setAuthenticatedUser} onBack={handleBackToPortal} />
                                ) : (
                                    <EmployerDashboard user={authenticatedUser} onSignOut={handleSignOut} />
                                )}
                            </Suspense>
                        </ErrorBoundary>
                    </div>
                    <ModalRenderer />
                </div>
            </ModalProvider>
        );
    }
    // --- Renderizado del Portal de Acceso Inicial ---
    else {
        content = (
            // FIX: The ModalProvider was throwing a 'missing children' error. This was due to an issue with how the component's props were typed. The fix has been applied in `contexts/ModalContext.tsx` by changing its definition to correctly handle children props. */}
            <ModalProvider>
                <div>
                    <AccessPortal onSelectType={setAppMode} />
                    <ModalRenderer />
                </div>
            </ModalProvider>
        );
    }

    return (
        <ThemeProvider>
            {content}
            {showPilotNotice && <PilotNotice onClose={handleDismissPilotNotice} />}
        </ThemeProvider>
    );
};

export default App;