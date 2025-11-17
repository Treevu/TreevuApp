

import React, { useState, useMemo } from 'react';
import ModalWrapper from './ModalWrapper';
import { CheckIcon, ChevronDownIcon } from './Icons';
import TreevuLogoText from './TreevuLogoText';
import { useModal } from '../contexts/ModalContext';
import { useAuth } from '../contexts/AuthContext';

interface SaasPlanMatrixModalProps {
    onClose: () => void;
    origin?: 'people' | 'business' | 'merchant';
}

// INTERFACES Y COMPONENTES REUTILIZABLES
interface PlanDetails {
    name: string;
    subtitle: string;
    price?: string;
    unit?: string;
    features: string[];
    isFeatured?: boolean;
    cta: string;
    ctaAction: () => void;
    titleClassName?: string;
    priceClassName?: string;
}

const CollapsiblePlanCard: React.FC<{ plan: PlanDetails, isExpanded: boolean, onToggle: () => void }> = ({ plan, isExpanded, onToggle }) => (
    <div className={`bg-background rounded-2xl border transition-all duration-300 ${isExpanded ? 'ring-2 ring-primary border-primary' : 'border-active-surface/50 hover:border-active-surface'}`}>
        <button
            onClick={onToggle}
            className="w-full p-4 text-left flex justify-between items-center"
            aria-expanded={isExpanded}
        >
            <div className="flex-1">
                <h3 className={`text-lg font-bold text-on-surface ${plan.titleClassName || ''}`}>{plan.name}</h3>
                <p className="text-sm text-on-surface-secondary">{plan.subtitle}</p>
                {plan.price && (
                    <div className="flex items-baseline gap-2 mt-1">
                        <p className={`text-xl font-black text-primary tracking-tighter ${plan.priceClassName || ''}`}>{plan.price}</p>
                        {plan.unit && <p className="text-sm font-semibold text-on-surface-secondary">{plan.unit}</p>}
                    </div>
                )}
            </div>
            <ChevronDownIcon className={`w-6 h-6 text-on-surface-secondary transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
        </button>

        <div
            className="grid transition-[grid-template-rows] duration-500 ease-in-out"
            style={{ gridTemplateRows: isExpanded ? '1fr' : '0fr' }}
        >
            <div className="overflow-hidden">
                <div className="px-4 pb-4 pt-2 border-t border-active-surface/50">
                    <ul className="space-y-2 text-sm text-on-surface-secondary text-left my-4">
                        {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                                <CheckIcon className="w-5 h-5 text-primary mr-2 flex-shrink-0" />
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                    <button onClick={plan.ctaAction} className={`w-full mt-2 font-bold py-2.5 rounded-lg ${plan.isFeatured ? 'bg-primary text-primary-dark' : 'bg-active-surface text-on-surface'}`}>
                        {plan.cta}
                    </button>
                </div>
            </div>
        </div>
    </div>
);


const SaasPlanMatrixModal: React.FC<SaasPlanMatrixModalProps> = ({ onClose, origin = 'people' }) => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState(origin);
    const [openPlan, setOpenPlan] = useState<string | null>(null);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
    const { openModal } = useModal();
    const isCorporateUser = !!user?.companyId;
    
     React.useEffect(() => {
        setOpenPlan(null); // Reset open plan when tab changes
    }, [activeTab]);

    const mailtoLink = useMemo(() => {
        const recipient = 'contacto@treevu.app';
        let subject = '';
        let body = `Hola equipo de treevü,\n\nEstoy interesado/a y me gustaría recibir más información.`;

        switch (activeTab) {
            case 'people':
                subject = 'Suscripción al Plan Explorer';
                break;
            case 'merchant':
                subject = 'Solicitud de Afiliación - treevü for Merchants';
                break;
            case 'business':
            default:
                subject = 'Solicitud de Demo - treevü for Business';
                break;
        }
        return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }, [activeTab]);
    
    // --- RENDER FUNCTIONS POR PESTAÑA ---
    
    const renderPeople = () => {
        const peoplePlans: PlanDetails[] = [
            {
                name: 'Starter',
                subtitle: 'Tu Aventura Financiera Personal',
                price: 'Gratis',
                features: ['Registro de gastos manual y con IA', 'Creación de metas de ahorro', 'Gamificación y recompensas básicas'],
                cta: 'Continuar Gratis',
                ctaAction: onClose,
            },
            {
                name: 'Explorer',
                subtitle: isCorporateUser ? 'Plan corporativo para colaboradores' : 'Acceso total y tienda global',
                price: isCorporateUser ? 'Incluido' : '$89.99 USD',
                unit: isCorporateUser ? 'con tu empresa' : 'por año',
                features: [
                    'All in Starter', 
                    'Beneficios y retos corporativos', 
                    'Asistente IA Avanzado', 
                    'Análisis de Devolución de Impuestos',
                    'Acceso a la Tienda Global de Recompensas',
                    'Contratación únicamente anual',
                ],
                isFeatured: true,
                cta: isCorporateUser ? 'Continuar' : 'Suscribirme',
                ctaAction: isCorporateUser ? onClose : () => {
                    onClose();
                    openModal('leadCapture', { type: 'people' });
                },
            },
        ];

        return (
            <div className="space-y-4">
                {peoplePlans.map(plan => (
                    <CollapsiblePlanCard 
                        key={plan.name} 
                        plan={plan}
                        isExpanded={openPlan === plan.name}
                        onToggle={() => setOpenPlan(openPlan === plan.name ? null : plan.name)}
                    />
                ))}
            </div>
        );
    };

    const renderBusiness = () => {
        const launchPrice = billingCycle === 'monthly' ? '$7 USD' : `$${(7 * 12 * 0.8).toFixed(0)} USD`;
        const launchUnit = billingCycle === 'monthly' ? 'por usuario/mes' : 'por usuario/año';
        const growthPrice = billingCycle === 'monthly' ? '$15 USD' : `$${(15 * 12 * 0.8).toFixed(0)} USD`;
        const growthUnit = billingCycle === 'monthly' ? 'por usuario/mes' : 'por usuario/año';

        const businessPlans: PlanDetails[] = [
            {
                name: 'Launch',
                subtitle: 'Para Pilotos y Startups',
                price: launchPrice,
                unit: launchUnit,
                features: [
                    'App de Bienestar Financiero',
                    'Dashboard con KPIs Globales',
                    'Índice de Bienestar (FWI) General',
                    'Módulo de Kudos'
                ],
                cta: 'Contactar a Ventas',
                ctaAction: () => window.open(mailtoLink, '_blank'),
            },
            {
                name: 'Growth',
                subtitle: 'Para Equipos en Expansión',
                price: growthPrice,
                unit: growthUnit,
                isFeatured: true,
                features: [
                    'All in Launch',
                    'FWI Segmentado y Benchmarks',
                    'Riesgo de Fuga Predictivo',
                    'Filtros Estratégicos',
                    'Módulo de Engagement',
                    'Asistente IA Básico',
                ],
                cta: 'Contactar a Ventas',
                ctaAction: () => window.open(mailtoLink, '_blank'),
            },
            {
                name: 'Enterprise',
                subtitle: 'Para Grandes Organizaciones',
                price: 'Personalizado',
                priceClassName: 'text-accent',
                features: [
                    'All in Growth',
                    'Asistente IA Avanzado (Simulaciones)',
                    'Integración HRIS y SSO',
                    'Soporte Dedicado (CSM)',
                    'Recompensas personalizadas',
                ],
                cta: 'Contactar a Ventas',
                ctaAction: () => window.open(mailtoLink, '_blank'),
            },
        ];
        return (
            <div className="space-y-4">
                {businessPlans.map(plan => (
                     <CollapsiblePlanCard 
                        key={plan.name} 
                        plan={plan}
                        isExpanded={openPlan === plan.name}
                        onToggle={() => setOpenPlan(openPlan === plan.name ? null : plan.name)}
                    />
                ))}
            </div>
        );
    };
    
    const renderMerchants = () => {
        const merchantPlans: PlanDetails[] = [
            {
                name: 'Connect',
                subtitle: 'Únete a la Red',
                price: 'Revenue Share',
                features: [
                    'Publicación en Marketplace',
                    'Dashboard de Rendimiento Básico',
                    'Modelo de Pago por Conversión (CPA)',
                ],
                cta: 'Contactar para Afiliación',
                ctaAction: () => window.open(mailtoLink, '_blank'),
            },
            {
                name: 'Amplify',
                subtitle: 'Maximiza tu Alcance',
                price: 'Suscripción + Share',
                isFeatured: true,
                features: [
                    'All in Connect',
                    'Visibilidad Destacada',
                    'Analítica Avanzada de Clientes',
                    'Reporte de Impacto B2B',
                    'Asistente IA de Marketing',
                ],
                cta: 'Contactar para Afiliación',
                ctaAction: () => window.open(mailtoLink, '_blank'),
            },
        ];
        return (
             <div className="space-y-4">
                {merchantPlans.map(plan => (
                     <CollapsiblePlanCard 
                        key={plan.name} 
                        plan={plan}
                        isExpanded={openPlan === plan.name}
                        onToggle={() => setOpenPlan(openPlan === plan.name ? null : plan.name)}
                    />
                ))}
            </div>
        );
    };


    const renderContent = () => {
        switch (activeTab) {
            case 'people': return renderPeople();
            case 'business': return renderBusiness();
            case 'merchant': return renderMerchants();
            default: return renderBusiness();
        }
    };
    
    const tabs = [
        { id: 'people' as const, label: 'Personas' },
        { id: 'business' as const, label: 'Empresas' },
        { id: 'merchant' as const, label: 'Comercios' },
    ];

    return (
        <ModalWrapper title={<>Elige tu Expedición</>} onClose={onClose}>
            <div className="space-y-4 -mt-4">
                <div className="flex bg-background p-1 rounded-lg">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 text-center text-sm font-bold py-2 rounded-md transition-colors ${activeTab === tab.id ? 'bg-surface shadow text-on-surface' : 'text-on-surface-secondary'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                
                {(activeTab === 'business' || (activeTab === 'people' && !isCorporateUser)) && (
                    <div className="flex justify-center items-center gap-4 mt-4 animate-fade-in">
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`font-semibold px-4 py-1 rounded-full text-sm transition-colors ${billingCycle === 'monthly' ? 'bg-primary text-primary-dark' : 'text-on-surface-secondary'}`}
                        >
                            Mensual
                        </button>
                        <button
                            onClick={() => setBillingCycle('annual')}
                            className={`relative font-semibold px-4 py-1 rounded-full text-sm transition-colors ${billingCycle === 'annual' ? 'bg-primary text-primary-dark' : 'text-on-surface-secondary'}`}
                        >
                            Anual
                            <span className="absolute -top-2 -right-3 text-xs font-bold bg-warning text-white px-1.5 py-0.5 rounded-full rotate-12 shadow-lg">
                                -25%
                            </span>
                        </button>
                    </div>
                )}
                
                <div className="pt-2">
                    {renderContent()}
                </div>

                <div className="mt-6 pt-5 border-t border-active-surface/50 flex justify-end">
                    <button onClick={onClose} className="bg-active-surface text-on-surface font-bold py-2 px-4 rounded-xl hover:opacity-90">
                        Cerrar
                    </button>
                </div>
            </div>
        </ModalWrapper>
    );
};

export default SaasPlanMatrixModal;