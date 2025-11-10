
import React from 'react';
import { type CurrentUserType } from './EmployerDashboard';
import { ArrowLeftIcon, UsersIcon } from '../Icons';
import AuthLayout from '../auth/AuthLayout';
import TreevuLogoText from '../TreevuLogoText';

interface BusinessWelcomeProps {
    onLoginSuccess: (user: CurrentUserType) => void;
    onBack: () => void;
}

const MOCK_USERS: { [key: string]: CurrentUserType } = {
    'admin': { name: 'Admin General', role: 'admin' },
    'tech_manager': { name: 'Líder de Tecnología', role: 'area_manager', department: 'Tecnología e Innovación' },
    'sales_manager': { name: 'Líder de Ventas', role: 'area_manager', department: 'Ventas y Marketing' },
};

const BusinessWelcome: React.FC<BusinessWelcomeProps> = ({ onLoginSuccess, onBack }) => {

    const handleLogin = (roleKey: keyof typeof MOCK_USERS) => {
        onLoginSuccess(MOCK_USERS[roleKey]);
    };

    const title = (
        <>
            <TreevuLogoText />
            <span className="block text-xl font-semibold text-primary -mt-2 tracking-wide italic">for business</span>
        </>
    );

    const backButton = (
        <button
            onClick={onBack}
            className="text-on-surface-secondary font-semibold text-sm flex items-center mx-auto"
        >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Volver atrás
        </button>
    );
    
    return (
        <AuthLayout footer={backButton}>
            <div className="text-center">
                <h1 className="text-4xl font-black text-on-surface treevu-text mb-2">{title}</h1>
                <p className="text-on-surface-secondary">La plataforma para convertir los datos de tu equipo en estrategia.</p>
            </div>
            
            <div className="mt-8 w-full space-y-4">
                <p className="text-center font-semibold text-on-surface-secondary">Selecciona un rol para ingresar:</p>
                
                <button
                    onClick={() => handleLogin('admin')}
                    className="w-full p-4 bg-surface rounded-xl border border-active-surface/50 text-left flex items-center gap-4 transform hover:scale-105 hover:bg-active-surface transition-all duration-300"
                >
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <UsersIcon className="w-6 h-6 text-primary"/>
                    </div>
                    <div>
                        <h3 className="font-bold text-on-surface">Admin General</h3>
                        <p className="text-xs text-on-surface-secondary">Visibilidad de toda la empresa.</p>
                    </div>
                </button>

                 <button
                    onClick={() => handleLogin('tech_manager')}
                    className="w-full p-4 bg-surface rounded-xl border border-active-surface/50 text-left flex items-center gap-4 transform hover:scale-105 hover:bg-active-surface transition-all duration-300"
                >
                     <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <UsersIcon className="w-6 h-6 text-primary"/>
                    </div>
                    <div>
                        <h3 className="font-bold text-on-surface">Jefe de Tecnología</h3>
                        <p className="text-xs text-on-surface-secondary">Visibilidad del área de T.I.</p>
                    </div>
                </button>

                 <button
                    onClick={() => handleLogin('sales_manager')}
                    className="w-full p-4 bg-surface rounded-xl border border-active-surface/50 text-left flex items-center gap-4 transform hover:scale-105 hover:bg-active-surface transition-all duration-300"
                >
                     <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <UsersIcon className="w-6 h-6 text-primary"/>
                    </div>
                    <div>
                        <h3 className="font-bold text-on-surface">Jefe de Ventas</h3>
                        <p className="text-xs text-on-surface-secondary">Visibilidad del área comercial.</p>
                    </div>
                </button>
            </div>
        </AuthLayout>
    );
};

export default BusinessWelcome;
