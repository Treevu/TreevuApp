

import React from 'react';
import { BinocularsIcon, TreasureChestIcon, CheckIcon, BuildingStorefrontIcon } from './Icons';
import Logo from './Logo';
import TreevuLogoText from './TreevuLogoText';

interface AccessPortalProps {
    onSelectType: (type: 'person' | 'employer' | 'merchant') => void;
}

export const AccessPortal: React.FC<AccessPortalProps> = ({ onSelectType }) => {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center p-4 sm:p-6 text-on-surface">
            <main className="flex-grow flex flex-col items-center justify-center w-full">
                <div className="text-center max-w-2xl mx-auto">
                    <Logo className="w-20 h-20 sm:w-24 sm:h-24 text-primary mx-auto mb-4 animate-logo-pulse" />
                    <h1 className="text-5xl sm:text-6xl font-black text-on-surface treevu-text">
                        <TreevuLogoText />
                    </h1>
                    <p className="mt-4 text-lg sm:text-xl text-on-surface-secondary">
                        El ecosistema que transforma el bienestar financiero en crecimiento para todos.
                    </p>
                </div>

                <div className="mt-12 w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Card for Person */}
                    <div className="bg-surface rounded-3xl border border-active-surface/50 p-6 sm:p-8 w-full transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/10 group flex flex-col">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                                <BinocularsIcon className="w-8 h-8 text-primary"/>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-on-surface-secondary flex items-baseline gap-1.5">
                                    <TreevuLogoText className="text-xl"/>
                                    <span className="text-primary">for people</span>
                                </h3>
                                <h2 className="text-2xl font-bold text-on-surface mt-1">El Gimnasio de tu Bienestar Financiero</h2>
                            </div>
                        </div>

                        <ul className="mt-6 space-y-3 text-on-surface-secondary flex-grow">
                             <li className="flex items-start gap-3">
                                <CheckIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                <span>Fortalece tus hábitos y <strong>convierte gastos en recompensas.</strong></span>
                            </li>
                             <li className="flex items-start gap-3">
                                <CheckIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                <span>Conquista tus <strong>metas de ahorro</strong> con un plan de entrenamiento claro.</span>
                            </li>
                             <li className="flex items-start gap-3">
                                <CheckIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                <span>Accede a <strong>beneficios exclusivos</strong> que potencian tu crecimiento.</span>
                            </li>
                        </ul>

                        <button
                            onClick={() => onSelectType('person')}
                            className="mt-8 w-full bg-primary text-primary-dark font-bold py-3 px-6 rounded-xl text-lg transition-all duration-300 group-hover:opacity-90 whitespace-nowrap"
                        >
                            Iniciar mi Entrenamiento
                        </button>
                    </div>

                    {/* Card for Employer */}
                    <div className="bg-surface rounded-3xl border border-active-surface/50 p-6 sm:p-8 w-full transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-accent/10 group flex flex-col">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center">
                                <TreasureChestIcon className="w-8 h-8 text-accent"/>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-on-surface-secondary flex items-baseline gap-1.5">
                                    <TreevuLogoText className="text-xl"/>
                                    <span className="text-accent">for business</span>
                                </h3>
                                <h2 className="text-2xl font-bold text-on-surface mt-1">El Motor de tu Estrategia de Talento</h2>
                            </div>
                        </div>
                        
                        <ul className="mt-6 space-y-3 text-on-surface-secondary flex-grow">
                             <li className="flex items-start gap-3">
                                <CheckIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                <span><strong>Reduce el riesgo de fuga</strong> y aumenta la retención del talento clave.</span>
                            </li>
                             <li className="flex items-start gap-3">
                                <CheckIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                <span>Toma decisiones con <strong>datos 100% anónimos</strong> para potenciar el engagement.</span>
                            </li>
                             <li className="flex items-start gap-3">
                                <CheckIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                <span>Mide el <strong>ROI real de tu cultura</strong> de bienestar y beneficios.</span>
                            </li>
                        </ul>

                        <button
                            onClick={() => onSelectType('employer')}
                            className="mt-8 w-full bg-accent text-accent-dark font-bold py-3 px-6 rounded-xl text-lg transition-all duration-300 group-hover:opacity-90 whitespace-nowrap"
                        >
                           Acceder al Dashboard
                        </button>
                    </div>

                    {/* Card for Merchant */}
                    <div className="bg-surface rounded-3xl border border-active-surface/50 p-6 sm:p-8 w-full transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10 group flex flex-col">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center">
                                <BuildingStorefrontIcon className="w-8 h-8 text-blue-500"/>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-on-surface-secondary flex items-baseline gap-1.5">
                                    <TreevuLogoText className="text-xl"/>
                                    <span className="text-blue-500">for merchants</span>
                                </h3>
                                <h2 className="text-2xl font-bold text-on-surface mt-1">Tu Canal de Crecimiento Acelerado</h2>
                            </div>
                        </div>
                        
                        <ul className="mt-6 space-y-3 text-on-surface-secondary flex-grow">
                             <li className="flex items-start gap-3">
                                <CheckIcon className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                <span>Atrae a <strong>miles de clientes de alto valor</strong> de las mejores empresas.</span>
                            </li>
                             <li className="flex items-start gap-3">
                                <CheckIcon className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                <span>Publica ofertas y obtén <strong>analíticas de consumo en tiempo real.</strong></span>
                            </li>
                             <li className="flex items-start gap-3">
                                <CheckIcon className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                <span>Fideliza a un público con <strong>mayor poder adquisitivo y recurrencia.</strong></span>
                            </li>
                        </ul>

                        <button
                            onClick={() => onSelectType('merchant')}
                            className="mt-8 w-full bg-blue-500 text-white font-bold py-3 px-6 rounded-xl text-lg transition-all duration-300 group-hover:opacity-90 whitespace-nowrap"
                        >
                           Acceder a mi Portal
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};