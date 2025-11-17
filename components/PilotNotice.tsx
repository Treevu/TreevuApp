import React from 'react';
import Logo from './Logo';
import TreevuLogoText from './TreevuLogoText';

interface PilotNoticeProps {
    onClose: () => void;
}

const PilotNotice: React.FC<PilotNoticeProps> = ({ onClose }) => {
    const title = "Tu Aventura de Prueba Comienza";

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-end sm:items-center z-50 p-4 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-background rounded-3xl shadow-2xl w-full max-w-sm flex flex-col animate-grow-and-fade-in"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="pilot-notice-title"
                style={{ animationDuration: '0.3s' }}
            >
                 <div className="p-6 sm:p-8">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                           <Logo className="w-16 h-16 text-primary" />
                        </div>
                         <h2 id="pilot-notice-title" className="text-3xl font-bold text-on-surface mt-4">{title}</h2>
                        <div className="mt-4 text-left">
                            <p className="text-on-surface-secondary text-sm text-center">
                                Descubre cómo cada pequeño hábito cultiva un gran tesoro en el mundo de <TreevuLogoText />.
                            </p>
                            <ul className="text-left text-sm text-on-surface-secondary bg-surface p-4 rounded-xl space-y-3 mt-4">
                                <li className="flex items-start">
                                    <span className="text-primary mr-2 font-bold text-lg">›</span>
                                    <div>Iniciarás con un <strong className="text-on-surface">perfil de explorador</strong> y datos de ejemplo para probar todo.</div>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary mr-2 font-bold text-lg">›</span>
                                    <div>Registra hallazgos, crea metas y canjea tesoros. <strong className="text-on-surface">Explora sin miedo</strong>, ¡es una simulación!</div>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary mr-2 font-bold text-lg">›</span>
                                    <div><strong className="text-on-surface">Tu progreso se guarda</strong> en este navegador para que continúes tu aventura.</div>
                                </li>
                            </ul>
                        </div>
                        <div className="mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full px-6 py-3 text-base font-bold text-primary-dark bg-gradient-to-br from-primary to-accent rounded-xl hover:opacity-90 shadow-lg shadow-primary/30 transition-all transform hover:scale-105"
                            >
                                ¡Comenzar mi Expedición!
                            </button>
                        </div>
                    </div>
                 </div>
            </div>
        </div>
    );
};

export default PilotNotice;