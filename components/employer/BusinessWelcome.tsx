



import React, { useEffect, useState, useMemo } from 'react';
import { type CurrentUserType, Plan } from '../../types/employer';
import { ArrowLeftIcon, UsersIcon, DocumentArrowDownIcon, TreasureChestIcon, MagnifyingGlassIcon } from '../Icons';
import AuthLayout from '../auth/AuthLayout';
import TreevuLogoText from '../TreevuLogoText';
import { useModal } from '../../contexts/ModalContext';
import { MOCK_EMPLOYEES, calculateKpisForSegment } from '../../services/employerDataService';
import PortalWelcomeNotice from '../PortalWelcomeNotice';

interface BusinessWelcomeProps {
    onLoginSuccess: (user: CurrentUserType) => void;
    onBack: () => void;
}

const MOCK_USERS: { [key: string]: CurrentUserType } = {
    'admin': { name: 'Admin General', role: 'admin', plan: 'Enterprise' },
    'tech_manager': { name: 'Líder de Tecnología', role: 'area_manager', department: 'Tecnología e Innovación', plan: 'Growth' },
    'sales_manager': { name: 'Líder de Ventas', role: 'area_manager', department: 'Ventas y Marketing', plan: 'Growth' },
};

const BusinessWelcome: React.FC<BusinessWelcomeProps> = ({ onLoginSuccess, onBack }) => {
    const { openModal } = useModal();
    const [showWelcome, setShowWelcome] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const userRoles = useMemo(() => Object.entries(MOCK_USERS).map(([key, user]) => ({ key, ...user })), []);
    
    const filteredRoles = useMemo(() => {
        if (!searchQuery.trim()) {
            return userRoles;
        }
        const lowercasedQuery = searchQuery.toLowerCase();
        return userRoles.filter(role => 
            role.name.toLowerCase().includes(lowercasedQuery) || 
            // FIX: Use 'in' operator for type-safe property access on a union type.
            ('department' in role && role.department && role.department.toLowerCase().includes(lowercasedQuery))
        );
    }, [searchQuery, userRoles]);
    
    useEffect(() => {
        document.documentElement.classList.add('theme-business');
        
        const hasSeen = localStorage.getItem('treevu-business-welcome-seen') === 'true';
        if (!hasSeen) {
            setShowWelcome(true);
        }

        return () => {
            document.documentElement.classList.remove('theme-business');
        };
    }, []);

    const handleCloseWelcome = () => {
        setShowWelcome(false);
        localStorage.setItem('treevu-business-welcome-seen', 'true');
    };

    const handleLogin = (roleKey: keyof typeof MOCK_USERS) => {
        onLoginSuccess(MOCK_USERS[roleKey]);
    };

    // --- IMPLEMENTACIÓN: Reporte B2B de Muestra ---
    const handleDownloadSample = () => {
        const mockDashboardData = calculateKpisForSegment(MOCK_EMPLOYEES);
        const mockUser: CurrentUserType = { name: 'Gerente General (Muestra)', role: 'admin', plan: 'Enterprise' };
        openModal('strategicReport', { dashboardData: mockDashboardData, user: mockUser });
    };
    // --- FIN IMPLEMENTACIÓN ---

    const title = (
        <>
            <TreevuLogoText />
            <span className="block text-xl font-semibold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent -mt-2 tracking-wide italic">for business</span>
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
        <>
        {showWelcome && (
            <PortalWelcomeNotice
                onClose={handleCloseWelcome}
                icon={<TreasureChestIcon className="w-16 h-16 text-primary" />}
                title="Bienvenido al Centro de Mando Estratégico"
                cta="Acceder al Centro de Mando"
                platform="business"
            >
                <p className="text-on-surface-secondary text-sm text-center">
                    Estás a punto de acceder a tu centro de mando. Explora con libertad, todos los datos son de ejemplo.
                </p>
                <ul className="text-left text-sm text-on-surface-secondary bg-surface p-4 rounded-xl space-y-3 mt-4">
                    <li className="flex items-start">
                        <span className="text-primary mr-2 font-bold text-lg">›</span>
                        <div>Usa la <strong className="text-on-surface">inteligencia predictiva</strong> para anticipar y reducir la fuga de talento.</div>
                    </li>
                    <li className="flex items-start">
                        <span className="text-primary mr-2 font-bold text-lg">›</span>
                        <div>Convierte cada dato en una <strong className="text-on-surface">decisión estratégica</strong> que potencia tu cultura.</div>
                    </li>
                    <li className="flex items-start">
                        <span className="text-primary mr-2 font-bold text-lg">›</span>
                        <div>Mide el <strong className="text-on-surface">ROI real</strong> de tus iniciativas de bienestar y engagement.</div>
                    </li>
                </ul>
            </PortalWelcomeNotice>
        )}
        <AuthLayout footer={backButton}>
            <div className="text-center">
                <h1 className="text-4xl font-black text-on-surface treevu-text mb-2">{title}</h1>
                <p className="text-on-surface-secondary">La plataforma de People Analytics que convierte el bienestar de tu equipo en tu mayor ventaja competitiva.</p>
            </div>
            
            <div className="mt-8 w-full space-y-4">
                <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <MagnifyingGlassIcon className="h-5 w-5 text-on-surface-secondary" />
                    </div>
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar rol o área..."
                        className="block w-full rounded-xl border-transparent bg-background py-3 pl-11 pr-4 text-on-surface placeholder:text-on-surface-secondary focus:border-primary focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary"
                    />
                </div>
                
                <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar -mr-2 pr-2">
                    {filteredRoles.length > 0 ? (
                        filteredRoles.map((role) => (
                            <button
                                key={role.key}
                                onClick={() => handleLogin(role.key as keyof typeof MOCK_USERS)}
                                className="w-full p-4 bg-surface/50 backdrop-blur-sm rounded-2xl border border-active-surface/50 text-left flex items-center gap-4 transition-all duration-300 hover:shadow-lg hover:border-primary/50 hover:scale-[1.02]"
                            >
                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <UsersIcon className="w-6 h-6 text-primary"/>
                                </div>
                                <div>
                                    <h3 className="font-bold text-on-surface">{role.name}</h3>
                                    <p className="text-xs text-on-surface-secondary">
                                        {role.role === 'admin' ? 'Visibilidad de toda la empresa' : `Visibilidad del área: ${'department' in role ? role.department : ''}`}
                                    </p>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-on-surface-secondary">No se encontraron roles.</p>
                        </div>
                    )}
                </div>

                 <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-active-surface"></div>
                    <span className="flex-shrink mx-4 text-xs text-on-surface-secondary">O</span>
                    <div className="flex-grow border-t border-active-surface"></div>
                </div>

                <button
                    onClick={handleDownloadSample}
                    className="w-full p-3 bg-active-surface rounded-xl text-center flex items-center justify-center gap-2 transform hover:scale-105 hover:bg-background transition-all duration-300"
                >
                    <DocumentArrowDownIcon className="w-5 h-5 text-primary"/>
                    <span className="font-bold text-on-surface text-sm">Descargar Reporte de Muestra</span>
                </button>
            </div>
        </AuthLayout>
        </>
    );
};

export default BusinessWelcome;
