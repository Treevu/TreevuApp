

import React, { Suspense } from 'react';

// Flujo para Personas
const AppRouter = React.lazy(() => import('./components/AppRouter'));
import { AuthProvider } from './contexts/AuthContext';
import { ModalProvider, ModalRenderer } from './contexts/ModalContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Nuevos proveedores de contexto optimizados
import { AlertProvider } from './contexts/AlertContext';
import { AppProvider } from './contexts/AppContext';

import Spinner from './components/Spinner';
import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
    return (
        <AuthProvider>
            <ThemeProvider>
                <ModalProvider>
                    <NotificationProvider>
                        <AlertProvider>
                            <AppProvider>
                                <ErrorBoundary>
                                    <Suspense fallback={<div className="w-full h-full flex items-center justify-center"><Spinner/></div>}>
                                        <AppRouter />
                                    </Suspense>
                                    <ModalRenderer />
                                </ErrorBoundary>
                            </AppProvider>
                        </AlertProvider>
                    </NotificationProvider>
                </ModalProvider>
            </ThemeProvider>
        </AuthProvider>
    );
};

export default App;