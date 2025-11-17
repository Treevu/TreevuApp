import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Lazy imports
const AccessPortal = React.lazy(() => import('@/components/auth/AccessPortal'));
const MainApp = React.lazy(() => import('@/features/dashboard/MainApp'));
const EmployerDashboard = React.lazy(() => import('@/features/employer/EmployerDashboard'));
const BusinessWelcome = React.lazy(() => import('@/features/employer/BusinessWelcome'));
const PersonDashboard = React.lazy(()=>import('@/templates/PersonDashboard'));

// Components
import Spinner from '@/components/ui/Spinner';

interface AppRoutesProps {}

const AppRoutes: React.FC<AppRoutesProps> = ({  }) => {
    const handleSignOut = () => {
    };

    return (
        <Suspense fallback={
            <div className="w-full h-screen flex items-center justify-center">
                <Spinner />
            </div>
        }>
            <Routes>
                {/* Ruta principal - Portal de acceso */}
                <Route path="/" element={<AccessPortal />} />
                
                {/* Rutas para personas */}
                <Route path="/person/*" element={<PersonDashboard />} />
                
                {/* Rutas para empleadores */}
                <Route 
                    path="/employer" 
                    element={
                        <div className="min-h-screen bg-background text-on-surface">
                            <EmployerDashboard />
                        </div>
                    } 
                />
                <Route 
                    path="/Business" 
                    element={
                        <div className="min-h-screen bg-background text-on-surface">
                            <BusinessWelcome 
                                onLoginSuccess={()=>{}} 
                                onBack={() => {}} 
                            />
                        </div>
                    } 
                />
                {/* Redirigir rutas no encontradas */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;