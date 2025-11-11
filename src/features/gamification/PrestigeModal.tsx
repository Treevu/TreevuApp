import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ModalWrapper from '@/components/ui/ModalWrapper.tsx';
import { TrophyIcon, ArrowPathIcon } from '@/components/ui/Icons';

interface PrestigeModalProps {
    onClose: () => void;
}

const PrestigeModal: React.FC<PrestigeModalProps> = ({ onClose }) => {
    const { prestigeUp } = useAuth();

    const handleConfirm = () => {
        prestigeUp();
        onClose();
    };

    return (
        <ModalWrapper title="Convertirse en Leyenda" onClose={onClose}>
            <div className="text-center -mt-5">
                <TrophyIcon className="w-20 h-20 text-yellow-400 mx-auto animate-bounce" />
                <p className="mt-4 font-semibold text-on-surface">
                    Has dominado la Senda Financiera. ¡Es hora de forjar tu leyenda!
                </p>
                <div className="mt-4 text-sm text-on-surface-secondary bg-background p-3 rounded-lg text-left space-y-2">
                    <p>Al confirmar, sucederá lo siguiente:</p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Tu nivel se reiniciará a <span className="font-bold">🌱 Brote Novato</span>.</li>
                        <li>Tu progreso de nivel se reiniciará para comenzar una nueva senda.</li>
                        <li>Obtendrás un <span className="font-bold text-yellow-400">ícono de Prestigio</span> 🏆 junto a tu nombre para siempre.</li>
                    </ul>
                    <p className="pt-2">Esta es tu oportunidad de demostrar tu maestría y empezar un nuevo ciclo. ¿Aceptas el desafío?</p>
                </div>
            </div>
            <div className="mt-6 pt-5 border-t border-active-surface/50 flex justify-end space-x-3">
                <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-bold text-on-surface bg-active-surface rounded-xl hover:bg-active-surface/70"
                >
                    Aún no
                </button>
                <button
                    onClick={handleConfirm}
                    className="px-6 py-2 text-sm font-bold text-white bg-yellow-500 rounded-xl hover:opacity-90 flex items-center"
                >
                    <ArrowPathIcon className="w-5 h-5 mr-1.5"/>
                    Forjar Leyenda
                </button>
            </div>
        </ModalWrapper>
    );
};

export default PrestigeModal;