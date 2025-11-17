import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeftIcon, BuildingStorefrontIcon, MagnifyingGlassIcon } from '../Icons';
import AuthLayout from '../auth/AuthLayout';
import TreevuLogoText from '../TreevuLogoText';
import { MOCK_MERCHANTS, MerchantUser } from '../../data/merchantData';
import PortalWelcomeNotice from '../PortalWelcomeNotice';

interface MerchantLoginProps {
    onLoginSuccess: (user: MerchantUser) => void;
    onBack: () => void;
}

const MerchantLogin: React.FC<MerchantLoginProps> = ({ onLoginSuccess, onBack }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showWelcome, setShowWelcome] = useState(false);

    useEffect(() => {
        const hasSeen = localStorage.getItem('treevu-merchants-welcome-seen') === 'true';
        if (!hasSeen) {
            setShowWelcome(true);
        }
    }, []);

    const handleCloseWelcome = () => {
        setShowWelcome(false);
        localStorage.setItem('treevu-merchants-welcome-seen', 'true');
    };

    const filteredMerchants = useMemo(() => {
        if (!searchQuery.trim()) {
            return MOCK_MERCHANTS;
        }
        const lowercasedQuery = searchQuery.toLowerCase();
        return MOCK_MERCHANTS.filter(merchant =>
            merchant.name.toLowerCase().includes(lowercasedQuery)
        );
    }, [searchQuery]);

    const title = (
        <>
            <TreevuLogoText />
            <span className="block text-xl font-semibold text-blue-500 -mt-2 tracking-wide italic">for merchants</span>
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
                    icon={<BuildingStorefrontIcon className="w-16 h-16 text-primary" />}
                    title="Bienvenido a tu Centro de Crecimiento"
                    cta="Ir a mi Portal de Crecimiento"
                    platform="merchant"
                >
                    <p className="text-on-surface-secondary text-sm text-center">
                        Prepárate para conectar con clientes de alto valor. Esta es una demo con datos de ejemplo para que explores todo el potencial.
                    </p>
                    <ul className="text-left text-sm text-on-surface-secondary bg-surface p-4 rounded-xl space-y-3 mt-4">
                        <li className="flex items-start">
                            <span className="text-primary mr-2 font-bold text-lg">›</span>
                            <div>Conecta con una red exclusiva de <strong className="text-on-surface">clientes de alto valor</strong> de las mejores empresas.</div>
                        </li>
                        <li className="flex items-start">
                            <span className="text-primary mr-2 font-bold text-lg">›</span>
                            <div>Transforma insights de la comunidad en <strong className="text-on-surface">ofertas inteligentes</strong> y efectivas.</div>
                        </li>
                        <li className="flex items-start">
                            <span className="text-primary mr-2 font-bold text-lg">›</span>
                            <div>Mide el <strong className="text-on-surface">pulso de tu crecimiento</strong> con analítica en tiempo real.</div>
                        </li>
                    </ul>
                </PortalWelcomeNotice>
            )}
            <AuthLayout footer={backButton}>
                <div className="text-center">
                    <h1 className="text-4xl font-black text-on-surface treevu-text mb-2">{title}</h1>
                    <p className="text-on-surface-secondary">El canal de marketing que te conecta con miles de clientes de alto valor de la red corporativa treevü.</p>
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
                            placeholder="Busca tu comercio..."
                            className="block w-full rounded-xl border-transparent bg-background py-3 pl-11 pr-4 text-on-surface placeholder:text-on-surface-secondary focus:border-primary focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary"
                        />
                    </div>
                    
                    <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar -mr-2 pr-2">
                        {filteredMerchants.length > 0 ? (
                            filteredMerchants.map((merchant) => (
                                <button
                                    key={merchant.id}
                                    onClick={() => onLoginSuccess(merchant)}
                                    className="w-full p-4 bg-surface/50 backdrop-blur-sm rounded-2xl border border-active-surface/50 text-left flex items-center gap-4 transition-all duration-300 hover:shadow-lg hover:border-primary/50 hover:scale-[1.02]"
                                >
                                    <div className="w-10 h-10 bg-active-surface rounded-lg flex items-center justify-center flex-shrink-0">
                                        <BuildingStorefrontIcon className={`w-6 h-6 ${merchant.themeColor}`} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-on-surface">{merchant.name}</h3>
                                        <p className="text-xs text-on-surface-secondary">{merchant.category}</p>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-on-surface-secondary">No se encontraron comercios.</p>
                            </div>
                        )}
                    </div>
                </div>
            </AuthLayout>
        </>
    );
};

export default MerchantLogin;
