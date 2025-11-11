
import React from 'react';
import { BinocularsIcon, TreasureChestIcon, CheckIcon } from '@/components/ui/Icons';
import Logo from '@/components/ui/Logo';
import TreevuLogoText from '@/components/ui/TreevuLogoText.tsx';

interface AccessPortalProps {
    onSelectType: (type: 'person' | 'employer') => void;
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
                        La plataforma de bienestar financiero que une el crecimiento personal con la estrategia empresarial.
                    </p>
                </div>

                <div className="mt-12 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Card for Person */}
                    <div className="bg-surface rounded-3xl border border-active-surface/50 p-6 sm:p-8 w-full transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/10 group flex flex-col">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                                <BinocularsIcon className="w-8 h-8 text-primary"/>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-primary">PARA TI, COLABORADOR</h3>
                                <h2 className="text-2xl font-bold text-on-surface">Tu Aventura Financiera</h2>
                            </div>
                        </div>

                        <ul className="mt-6 space-y-3 text-on-surface-secondary flex-grow">
                             <li className="flex items-start gap-3">
                                <CheckIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                <span>Convierte gastos en <strong>recompensas reales.</strong></span>
                            </li>
                             <li className="flex items-start gap-3">
                                <CheckIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                <span>Conquista tus <strong>metas de ahorro</strong> y finanzas.</span>
                            </li>
                             <li className="flex items-start gap-3">
                                <CheckIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                <span>Gana <strong>beneficios exclusivos</strong> de tu empresa.</span>
                            </li>
                        </ul>

                        <button
                            onClick={() => onSelectType('person')}
                            className="mt-8 w-full bg-primary text-primary-dark font-bold py-3 px-6 rounded-xl text-lg transition-all duration-300 group-hover:opacity-90"
                        >
                            Iniciar mi Aventura
                        </button>
                    </div>

                    {/* Card for Employer */}
                    <div className="bg-surface rounded-3xl border border-active-surface/50 p-6 sm:p-8 w-full transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-accent/10 group flex flex-col">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center">
                                <TreasureChestIcon className="w-8 h-8 text-accent"/>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-accent">PARA TU EMPRESA</h3>
                                <h2 className="text-2xl font-bold text-on-surface">Tu Dashboard Estratégico</h2>
                            </div>
                        </div>
                        
                        <ul className="mt-6 space-y-3 text-on-surface-secondary flex-grow">
                             <li className="flex items-start gap-3">
                                <CheckIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                <span>Mide el <strong>bienestar financiero</strong> de tu equipo (FWI).</span>
                            </li>
                             <li className="flex items-start gap-3">
                                <CheckIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                <span>Identifica el <strong>riesgo de fuga de talento</strong> por estrés financiero.</span>
                            </li>
                             <li className="flex items-start gap-3">
                                <CheckIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                <span>Toma decisiones estratégicas con <strong>datos 100% anónimos.</strong></span>
                            </li>
                        </ul>

                        <button
                            onClick={() => onSelectType('employer')}
                            className="mt-8 w-full bg-accent text-accent-dark font-bold py-3 px-6 rounded-xl text-lg transition-all duration-300 group-hover:opacity-90"
                        >
                           Acceder al Dashboard
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};
