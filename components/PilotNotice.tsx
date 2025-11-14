import React from 'react';
import Logo from './Logo';
import TreevuLogoText from './TreevuLogoText';

interface PilotNoticeProps {
    onClose: () => void;
}

const PilotNotice: React.FC<PilotNoticeProps> = ({ onClose }) => {
    const title = (
        <>
            ¡Bienvenido a tu Expedición!
        </>
    );

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-surface rounded-3xl shadow-2xl w-full max-w-sm flex flex-col animate-grow-and-fade-in"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="pilot-notice-title"
                style={{ animationDuration: '0.3s' }}
            >
                 <div className="p-5 sm:p-6">
                    <div className="text-center">
                        <Logo className="w-14 h-14 mx-auto text-primary" />
                         <h2 id="pilot-notice-title" className="text-2xl font-bold text-on-surface mt-4">{title}</h2>
                        <div className="mt-4 space-y-3">
                             <p className="text-on-surface-secondary">
                                Descubre cómo cada pequeño hábito cultiva un gran tesoro en el mundo de <TreevuLogoText />.
                            </p>
                            <ul className="list-disc list-inside text-left text-sm text-on-surface-secondary bg-background p-3 rounded-xl space-y-2">
                                <li><strong>Elige tu Aventura:</strong> Iniciarás seleccionando un perfil de explorador con datos de ejemplo para que puedas probar todas las herramientas desde el primer momento.</li>
                                <li><strong>Explora sin Miedo:</strong> Siente la libertad de registrar hallazgos, crear metas y canjear tesoros. ¡Todo es parte de la simulación!</li>
                                <li><strong>Tu Expedición se Guarda:</strong> Todo lo que hagas se guardará en este navegador para que continúes tu aventura cuando quieras.</li>
                            </ul>
                        </div>
                        <div className="mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full px-6 py-2.5 text-sm font-bold text-primary-dark bg-gradient-to-br from-primary to-primary-light rounded-xl hover:opacity-90 shadow-lg shadow-primary/20 transition-all transform hover:scale-105"
                            >
                                Entendido, ¡vamos a explorar!
                            </button>
                        </div>
                    </div>
                 </div>
            </div>
        </div>
    );
};

export default PilotNotice;