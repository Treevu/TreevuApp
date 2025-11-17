import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useOffers } from '../../contexts/OffersContext';
import { useModal } from '../../contexts/ModalContext';
import { MOCK_MERCHANTS, MerchantUser, Offer, generateMerchantAnalytics } from '../../data/merchantData';
import { ChartPieIcon, BuildingStorefrontIcon, SparklesIcon, UserCircleIcon } from '../Icons';
import SubNavBar from '../SubNavBar';
import MerchantDashboard from './MerchantDashboard';
import OfferManager from './OfferManager';
import Logo from '../Logo';
import OnboardingTour from '../OnboardingTour';
import TreevuLogoText from '../TreevuLogoText';
import UpgradePlanCTA from '../UpgradePlanCTA';
import MerchantProfileView from './MerchantProfileView';

interface MerchantPortalProps {
    user: MerchantUser;
    onSignOut: () => void;
}

type MerchantTab = 'dashboard' | 'offers' | 'profile';

const MerchantPortal: React.FC<MerchantPortalProps> = ({ user, onSignOut }) => {
    const { offers, addOffer, updateOffer, deleteOffer } = useOffers();
    const { openModal, closeModal } = useModal();
    const [activeTab, setActiveTab] = useState<MerchantTab>('dashboard');
    const [isScrolled, setIsScrolled] = useState(false);
    
    const merchantOffers = useMemo(() => offers.filter(o => o.merchantId === user.id), [offers, user.id]);
    const analytics = useMemo(() => generateMerchantAnalytics(merchantOffers), [merchantOffers]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // --- Tour Logic ---
    const [isTourActive, setIsTourActive] = useState(false);
    const [tourStep, setTourStep] = useState(0);
    const kpiGridRef = useRef<HTMLDivElement>(null);
    const offersTabRef = useRef<HTMLButtonElement>(null);
    const createOfferBtnRef = useRef<HTMLButtonElement>(null);
    // FIX: Changed ref type to `any` to support both button and div elements.
    const assistantBtnRef = useRef<any>(null);

    useEffect(() => {
        const tourCompleted = localStorage.getItem('treevu-merchant-tour-completed') === 'true';
        if (tourCompleted) return;
        setTimeout(() => setIsTourActive(true), 1000);
    }, []);

    const tourSteps = useMemo(() => [
        { targetRef: kpiGridRef, text: 'Este es tu Dashboard. Monitorea en tiempo real el rendimiento de tus ofertas, desde canjes hasta el valor generado.', position: 'bottom' as const, tab: 'dashboard' },
        { targetRef: offersTabRef, text: 'En "Mis Ofertas", puedes ver, editar y crear todas las promociones que ofreces a la comunidad treevü.', position: 'bottom' as const, tab: 'offers' },
        { targetRef: createOfferBtnRef, text: 'Usa este botón para lanzar nuevas ofertas y atraer a más clientes de alto valor.', position: 'bottom' as const, tab: 'offers' },
        { targetRef: assistantBtnRef, text: 'Tu Asistente IA te ayuda a analizar datos y a redactar nuevas ofertas. ¡Pruébalo para optimizar tu estrategia!', position: 'bottom' as const, tab: 'offers' },
        { targetRef: null, text: '¡Todo listo! Ya conoces tu centro de mando. Es hora de conectar con los mejores clientes y hacer crecer tu negocio.', position: 'bottom' as const, tab: 'dashboard' }
    ], [kpiGridRef, offersTabRef, createOfferBtnRef, assistantBtnRef]);
    
    const handleEndTour = useCallback(() => {
        setIsTourActive(false);
        setTourStep(0);
        localStorage.setItem('treevu-merchant-tour-completed', 'true');
        setActiveTab('dashboard');
    }, []);

    const handleNextStep = useCallback(() => {
        const nextStepIndex = tourStep + 1;
        if (nextStepIndex < tourSteps.length) {
            const nextStep = tourSteps[nextStepIndex];
            if (nextStep.tab !== activeTab) {
                setActiveTab(nextStep.tab as MerchantTab);
                setTimeout(() => setTourStep(nextStepIndex), 350);
            } else {
                setTourStep(nextStepIndex);
            }
        } else {
            handleEndTour();
        }
    }, [tourStep, activeTab, handleEndTour, tourSteps]);

    const handlePrevStep = useCallback(() => {
        const prevStepIndex = tourStep - 1;
        if (prevStepIndex >= 0) {
            const prevStep = tourSteps[prevStepIndex];
            if (prevStep.tab !== activeTab) {
                setActiveTab(prevStep.tab as MerchantTab);
                setTimeout(() => setTourStep(prevStepIndex), 350);
            } else {
                setTourStep(prevStepIndex);
            }
        }
    }, [tourStep, activeTab, tourSteps]);
    // --- End of Tour Logic ---

    const handleSaveOffer = useCallback((offerData: Omit<Offer, 'id' | 'views' | 'redemptions'>, editingId?: string) => {
        if (editingId) {
            updateOffer(editingId, offerData);
        } else {
            addOffer({ ...offerData, merchantId: user.id });
        }
        closeModal();
    }, [addOffer, updateOffer, user.id, closeModal]);
    
    const tabs = [
        { id: 'dashboard' as const, label: 'Dashboard', Icon: ChartPieIcon },
        { id: 'offers' as const, label: 'Mis Ofertas', Icon: BuildingStorefrontIcon, ref: offersTabRef },
        { id: 'profile' as const, label: 'Mi Perfil', Icon: UserCircleIcon },
    ];
    
    // For demo purposes, we assume all mock users are on the base "Aliado" plan.
    const isProPlan = false; 

    return (
        <div className="min-h-screen text-on-surface">
            <header className={`sticky top-0 z-10 header-base ${isScrolled ? 'header-scrolled' : ''}`}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Logo className="w-8 h-8 text-primary" />
                            <div>
                                <h1 className="text-xl font-bold leading-tight -mb-1">
                                    <TreevuLogoText />
                                </h1>
                                <p className="text-blue-500 text-xs font-bold leading-none italic">
                                    for merchants
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 border-l border-active-surface/50 pl-4">
                            <Logo src={user.logoUrl} className="w-10 h-10 rounded-lg" />
                            <div>
                                <h2 className="text-xl font-bold text-on-surface treevu-text">{user.name}</h2>
                                <p className="text-sm text-on-surface-secondary">{user.category}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {isProPlan ? (
                            <button
                                ref={assistantBtnRef}
                                onClick={() => openModal('merchantAIAssistant', { analytics })}
                                className="flex items-center text-sm font-bold bg-primary text-primary-dark px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"
                                aria-label="Abrir asistente de IA"
                            >
                                <SparklesIcon className="w-5 h-5 mr-1.5" />
                                Asistente IA
                            </button>
                        ) : (
                            <div ref={assistantBtnRef}>
                                <UpgradePlanCTA
                                    Icon={SparklesIcon}
                                    title="Asistente IA de Marketing"
                                    description="Desbloquea insights y creación de ofertas con IA para maximizar tu alcance."
                                    variant="transparent"
                                    origin="merchant"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </header>
            <main className="max-w-6xl mx-auto p-4 sm:p-6">
                <SubNavBar tabs={tabs} activeTab={activeTab} onTabClick={(t) => setActiveTab(t)} />
                <div className="mt-6">
                    {activeTab === 'dashboard' && <MerchantDashboard user={user} analytics={analytics} kpiGridRef={kpiGridRef} />}
                    {activeTab === 'offers' && (
                        <OfferManager 
                            offers={merchantOffers}
                            onDelete={deleteOffer}
                            onEdit={(offer) => openModal('offerForm', { onSave: handleSaveOffer, offerToEdit: offer })}
                            onCreate={() => openModal('offerForm', { onSave: handleSaveOffer })}
                            createOfferBtnRef={createOfferBtnRef}
                        />
                    )}
                    {activeTab === 'profile' && <MerchantProfileView user={user} onSignOut={onSignOut} />}
                </div>
            </main>
             {isTourActive && tourSteps[tourStep] && (
                <OnboardingTour 
                    step={tourSteps[tourStep]}
                    currentStepIndex={tourStep}
                    totalSteps={tourSteps.length}
                    onNext={handleNextStep}
                    onPrev={handlePrevStep}
                    onSkip={handleEndTour}
                />
            )}
        </div>
    );
};

export default MerchantPortal;