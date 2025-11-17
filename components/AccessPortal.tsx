

import React, { useState } from 'react';
import { BroteIcon, StrategicCommandIcon, GrowthChannelIcon, ArrowRightIcon, CheckIcon, ArrowLeftIcon } from './Icons';
import Logo from './Logo';
import TreevuLogoText from './TreevuLogoText';
import { useModal } from '../contexts/ModalContext';

interface AccessPortalProps {
    onPeopleDemo: () => void;
    onBusinessDemo: () => void;
    onMerchantsDemo: () => void;
}

interface PlanDetails {
    name: string;
    description: string;
    price: string;
    annualPrice?: string;
    unit?: string;
    annualUnit?: string;
    features?: string[];
    isFeatured?: boolean;
}

interface PortalCardProps {
    onClick: () => void;
    platform: 'people' | 'business' | 'merchant';
    Icon: React.FC<{className?: string}>;
    title: string;
    description: string;
    cta: string;
    plans: PlanDetails[];
}

const PortalCard: React.FC<PortalCardProps> = ({ onClick, platform, Icon, title, description, cta, plans }) => {
    const { openModal } = useModal();
    
    const platformStyles = {
        people: {
            shadow: 'shadow-emerald-500/20',
            glow: 'group-hover:drop-shadow-[0_0_20px_rgba(74,222,128,0.4)]',
            subtitleColor: 'text-primary',
        },
        business: {
            shadow: 'shadow-orange-500/20',
            glow: 'group-hover:drop-shadow-[0_0_20px_rgba(245,158,11,0.4)]',
            subtitleColor: 'text-primary',
        },
        merchant: {
            shadow: 'shadow-sky-500/20',
            glow: 'group-hover:drop-shadow-[0_0_20px_rgba(59,130,246,0.4)]',
            subtitleColor: 'text-primary',
        }
    };

    const styles = platformStyles[platform];

    return (
        <div className="status-card-container transition-transform duration-300 ease-in-out hover:-translate-y-2 aspect-[3/4.5]">
            <div className={`h-full bg-surface rounded-3xl border border-active-surface/50 p-6 flex flex-col justify-between group ${styles.shadow} hover:shadow-2xl`}>
                {/* Top Content */}
                <div>
                    <div className={`w-14 h-14 bg-active-surface/50 rounded-xl flex items-center justify-center transition-all duration-300 ${styles.glow}`}>
                        <Icon className={`w-8 h-8 ${styles.subtitleColor}`}/>
                    </div>
                    
                    <div className="mt-6">
                         <h3 className={`text-lg font-bold ${styles.subtitleColor} flex items-baseline gap-1.5`}>
                            <span className="font-black">treevü</span>
                            <span className="font-semibold italic"> for {platform === 'merchant' ? 'merchants' : platform}</span>
                        </h3>
                        <h2 className="text-3xl font-black text-on-surface mt-2 leading-tight">{title}</h2>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm text-on-surface-secondary">
                            {description}
                        </p>
                    </div>
                </div>

                {/* Bottom Buttons */}
                <div className="space-y-3">
                     <a href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); openModal('saasPlanMatrix', { origin: platform }); }} className="font-semibold text-on-surface-secondary hover:text-on-surface transition-colors flex items-center gap-2 group/link">
                       Ver Planes
                       <ArrowRightIcon className="w-4 h-4 transition-transform transform group-hover/link:translate-x-1"/>
                    </a>
                    <a href="#" onClick={(e) => { e.preventDefault(); onClick(); }} className={`font-semibold transition-colors flex items-center gap-2 group/link ${styles.subtitleColor} hover:brightness-125`}>
                        Ver Demo
                       <ArrowRightIcon className="w-4 h-4 transition-transform transform group-hover/link:translate-x-1"/>
                    </a>
                </div>
            </div>
        </div>
    );
};


export const AccessPortal: React.FC<AccessPortalProps> = ({ onPeopleDemo, onBusinessDemo, onMerchantsDemo }) => {
    const plansData = {
        people: [
            { name: 'Starter', description: 'Tu aventura financiera personal. Registra gastos, crea metas y gana treevüs.', price: 'Gratis', features: ['Registro de gastos manual y con IA', 'Creación de metas de ahorro', 'Gamificación y recompensas básicas'] },
            { name: 'Explorer', description: 'Desbloqueado con tu empresa. Accede a beneficios corporativos, IA avanzada y más.', price: '$89.99 USD', unit: 'por año', isFeatured: true, features: ['All in Starter', 'Beneficios y retos corporativos', 'Asistente IA Avanzado', 'Análisis de Devolución de Impuestos', 'Contratación únicamente anual'] }
        ],
        business: [
            { name: 'Launch', description: 'Ideal para startups y pilotos. Métricas de adopción y FWI global.', price: '$7 USD', annualPrice: `$${(7 * 12 * 0.8).toFixed(0)} USD`, unit: 'por usuario/mes', annualUnit: 'por usuario/año', features: ['Dashboard con KPIs Globales', 'Métricas de Adopción', 'Índice de Bienestar (FWI) General'] },
            { name: 'Growth', description: 'Para empresas en crecimiento. Desbloquea el análisis de talento y engagement.', price: '$15 USD', annualPrice: `$${(15 * 12 * 0.8).toFixed(0)} USD`, unit: 'por usuario/mes', annualUnit: 'por usuario/año', isFeatured: true, features: ['Todo en Launch', 'Filtros Estratégicos', 'Análisis de Fuga de Talento', 'Módulo de Engagement'] },
            { name: 'Enterprise', description: 'La solución completa. IA estratégica, benchmarks y soporte dedicado.', price: 'Personalizado', annualPrice: 'Personalizado', features: ['Todo en Growth', 'Asistente IA Avanzado', 'Simulador de Impacto', 'Integraciones HRIS y SSO'] },
        ],
        merchant: [
            { name: 'Connect', description: 'Únete a nuestra red. Publica ofertas y paga solo por los resultados.', price: 'Revenue Share', features: ['Publicación en el Marketplace', 'Dashboard de Rendimiento Básico', 'Pago por Conversión'] },
            { name: 'Amplify', description: 'Maximiza tu alcance. Acceso a data, mayor visibilidad y campañas co-marketing.', price: 'Suscripción', isFeatured: true, features: ['All in Connect', 'Mayor Visibilidad', 'Analítica Avanzada de Clientes', 'Asistente IA de Marketing'] }
        ]
    };
    
    return (
        <div className="min-h-screen bg-background flex flex-col items-center p-4 sm:p-6 text-on-surface">
            <main className="flex-grow flex flex-col items-center justify-center w-full">
                <div className="text-center max-w-2xl mx-auto">
                    <Logo className="w-20 h-20 sm:w-24 sm:h-24 text-primary mx-auto mb-4 animate-logo-pulse" />
                    <h1 className="text-5xl sm:text-6xl font-black text-on-surface treevu-text">
                        <TreevuLogoText />
                    </h1>
                    <p className="text-2xl font-bold text-accent -mt-2 tracking-wide italic">
                        for all
                    </p>
                    <p className="mt-4 text-lg sm:text-xl text-on-surface-secondary">
                        El ecosistema que transforma el bienestar financiero en crecimiento para todos.
                    </p>
                </div>

                <div className="mt-16 w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Card for Person */}
                    <PortalCard
                        onClick={onPeopleDemo}
                        platform="people"
                        Icon={BroteIcon}
                        title="Tu Expedición Financiera"
                        description="Embárcate en una aventura gamificada para dominar tus finanzas, conquistar metas y cosechar recompensas."
                        cta="Ver Demo"
                        plans={plansData.people}
                    />

                    {/* Card for Employer */}
                    <div className="theme-business">
                        <PortalCard
                            onClick={onBusinessDemo}
                            platform="business"
                            Icon={StrategicCommandIcon}
                            title="Centro de Mando Estratégico"
                            description="Convierte data anónima de tu equipo en inteligencia predictiva para reducir la fuga de talento y medir el ROI de tu cultura."
                            cta="Ver Demo"
                            plans={plansData.business}
                        />
                    </div>
                    
                    {/* Card for Merchant */}
                    <div className="theme-merchant">
                         <PortalCard
                            onClick={onMerchantsDemo}
                            platform="merchant"
                            Icon={GrowthChannelIcon}
                            title="Canal de Crecimiento Acelerado"
                            description="Conecta con miles de clientes de alto valor de nuestra red corporativa y potencia tus ventas."
                            cta="Ver Demo"
                            plans={plansData.merchant}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};