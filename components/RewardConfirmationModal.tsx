import React, { useState } from 'react';
// FIX: Updated import from deprecated 'types.ts' to 'types/user.ts'.
import { type Reward } from '../types/user';
import { TreevuCoinIcon, CheckBadgeIcon } from './Icons';
import ModalWrapper from './ModalWrapper';
import { useAuth } from '../contexts/AuthContext';

interface RewardConfirmationModalProps {
    reward: Reward;
    userTreevus: number;
    onClose: () => void;
    onConfirm: (reward: Reward) => void;
}

const RewardConfirmationModal: React.FC<RewardConfirmationModalProps> = ({ reward, userTreevus, onClose, onConfirm }) => {
    const { user } = useAuth();
    const [step, setStep] = useState<'confirm' | 'success'>('confirm');
    
    const handleConfirm = () => {
        if (navigator.vibrate) navigator.vibrate(50);
        onConfirm(reward);
        setStep('success');
    };

    const newBalance = userTreevus - reward.costInTreevus;

    const getSuccessMessage = () => {
        switch (reward.category) {
            case 'Bienestar': return "Hemos notificado a RRHH. Pronto recibirás un correo con los detalles. ¡Disfrútalo!";
            case 'Educación':
            case 'Ocio': return "Recibirás un correo con tu voucher. También lo encontrarás en 'Mis Beneficios' en tu perfil.";
            case 'Impacto Social': return "¡Gracias por tu generosidad! Hemos procesado tu donación. Has convertido tu esfuerzo en una sonrisa.";
            default: return "Tu beneficio ha sido procesado. Recibirás más detalles por correo electrónico.";
        }
    };
    
    if (!user) return null;

    if (step === 'success') {
        return (
            <ModalWrapper title="¡Canje Exitoso!" onClose={onClose}>
                <div className="text-center -mt-5">
                    <CheckBadgeIcon className="w-20 h-20 text-primary mx-auto animate-grow-and-fade-in" />
                    <p className="mt-4 text-sm text-on-surface-secondary">
                        {getSuccessMessage()}
                    </p>
                    <button
                        onClick={onClose}
                        className="mt-6 w-full px-6 py-2.5 text-sm font-bold text-primary-dark bg-primary rounded-xl hover:opacity-90"
                    >
                        ¡Entendido!
                    </button>
                </div>
            </ModalWrapper>
        );
    }

    return (
        <ModalWrapper title="Confirmar Canje" onClose={onClose}>
            <div className="text-center -mt-5">
                <span className="text-6xl">{reward.icon}</span>
                <p className="mt-4 text-lg font-semibold text-on-surface">
                    Estás a punto de canjear: <br />
                    <span className="font-bold text-primary">{reward.title}</span>
                </p>
                
                <div className="mt-6 text-sm bg-background rounded-xl p-3 space-y-2 text-left">
                    <div className="flex justify-between">
                        <span className="text-on-surface-secondary">Tu Saldo Actual:</span>
                        <span className="font-semibold text-on-surface flex items-center">{userTreevus.toLocaleString('es-PE')} <TreevuCoinIcon className="w-4 h-4 ml-1 text-primary" level={user.level} /></span>
                    </div>
                    <div className="flex justify-between text-danger">
                        <span className="text-on-surface-secondary">Costo del Beneficio:</span>
                        <span className="font-semibold flex items-center">-{reward.costInTreevus.toLocaleString('es-PE')} <TreevuCoinIcon className="w-4 h-4 ml-1" level={user.level} /></span>
                    </div>
                    <div className="border-t border-active-surface/50 my-1"></div>
                    <div className="flex justify-between">
                        <span className="text-on-surface-secondary">Nuevo Saldo:</span>
                        <span className="font-bold text-primary flex items-center">{newBalance.toLocaleString('es-PE')} <TreevuCoinIcon className="w-4 h-4 ml-1" level={user.level} /></span>
                    </div>
                </div>
            </div>
            <div className="mt-6 pt-5 border-t border-active-surface/50 flex justify-end space-x-3">
                <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-bold text-on-surface bg-active-surface rounded-xl hover:bg-active-surface/70"
                >
                    Cancelar
                </button>
                <button
                    onClick={handleConfirm}
                    className="px-6 py-2 text-sm font-bold text-primary-dark bg-primary rounded-xl hover:opacity-90 flex items-center"
                >
                    Confirmar Canje
                </button>
            </div>
        </ModalWrapper>
    );
};

export default RewardConfirmationModal;