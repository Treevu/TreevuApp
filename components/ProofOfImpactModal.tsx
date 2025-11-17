
import React from 'react';
import ModalWrapper from './ModalWrapper';
import { ChartBarIcon, SparklesIcon } from './Icons';
import { useModal } from '../contexts/ModalContext';

export interface ProofOfImpactModalProps {
    onClose: () => void;
}

const ProofOfImpactModal: React.FC<ProofOfImpactModalProps> = ({ onClose }) => {
    const { openModal } = useModal();

    const handleSeePlans = () => {
        onClose(); // Close this modal first
        openModal('saasPlanMatrix', { origin: 'merchant' }); // Then open the plans matrix
    };
    
    return (
        <ModalWrapper title="Reporte de Oportunidad B2B" onClose={onClose}>
            <div className="text-center -mt-5">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ChartBarIcon className="w-9 h-9 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-on-surface">Demuestra tu Valor a Empresas</h2>
                <p className="text-sm text-on-surface-secondary mt-2">
                   Usa este reporte para mostrar a tus clientes corporativos (actuales o potenciales) cómo tus ofertas impactan positivamente en el bienestar de sus equipos.
                </p>

                <div className="mt-4 text-left text-sm text-on-surface-secondary bg-background p-4 rounded-xl space-y-3">
                    <p>
                        Con el plan <strong className="text-on-surface">Partner Pro</strong>, desbloqueas reportes personalizados que cuantifican los canjes en categorías clave como Alimentación, Bienestar y Ocio.
                    </p>
                     <p>
                        Es una herramienta poderosa para <strong className="text-on-surface">negociar alianzas, fidelizar clientes B2B y posicionar tu marca como un aliado del bienestar.</strong>
                    </p>
                </div>

                <div className="mt-6">
                    <button
                        onClick={handleSeePlans}
                        className="w-full bg-primary text-primary-dark font-bold py-2.5 px-6 rounded-xl text-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 flex items-center justify-center gap-2"
                    >
                        <SparklesIcon className="w-5 h-5" />
                        Generar Reporte (Función Pro)
                    </button>
                </div>
            </div>
        </ModalWrapper>
    );
};

export default ProofOfImpactModal;