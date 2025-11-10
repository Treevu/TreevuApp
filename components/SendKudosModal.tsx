import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTribes } from '../contexts/TribesContext';
import { useNotifications } from '../contexts/NotificationContext';
import { NotificationType } from '../types/notification';
import { type Tribe, type TribeMember } from '../types/tribe';
import ModalWrapper from './ModalWrapper';
import { TreevuCoinIcon, TrophyIcon, CheckBadgeIcon, PaperAirplaneIcon, BosqueIcon } from './Icons';

interface SendKudosModalProps {
    onClose: () => void;
    recipient: TribeMember | Tribe;
}

const isTribe = (recipient: TribeMember | Tribe): recipient is Tribe => {
    return 'collectiveKudos' in recipient;
}

const SendKudosModal: React.FC<SendKudosModalProps> = ({ onClose, recipient }) => {
    const { user, addTreevus } = useAuth();
    const { sendKudos } = useTribes();
    const { addNotification } = useNotifications();
    const [amount, setAmount] = useState(0);
    const [message, setMessage] = useState('');
    const [step, setStep] = useState<'form' | 'success'>('form');

    const quickAmounts = [25, 50, 100];
    const userBalance = user?.treevus || 0;
    const isAmountInvalid = amount <= 0 || amount > userBalance;

    const handleSend = () => {
        if (isTribe(recipient) && isAmountInvalid) return;
        if (navigator.vibrate) navigator.vibrate(50);

        if (isTribe(recipient)) {
            // Aportar al bosque SÍ gasta Treevüs
            addTreevus(-amount);
            sendKudos(recipient.id, amount, 'tribe');
            addNotification({
                type: NotificationType.Kudos,
                title: '¡Aporte Realizado!',
                message: `Aportaste ${amount} treevüs al bosque de ${recipient.name}.`
            });
        } else {
            // Enviar Kudo a un usuario NO gasta Treevüs, sino que otorga 1 Kudo y da una recompensa.
            sendKudos(recipient.id, 1, 'user');
            addTreevus(5); // Recompensa por reconocer a un compañero
            addNotification({
                type: NotificationType.Kudos,
                title: '¡Reconocimiento Enviado!',
                message: `Enviaste un Kudo a ${recipient.name} y ganaste 5 treevüs. ¡Gran trabajo en equipo!`
            });
        }
        
        setStep('success');
    };

    const recipientName = recipient.name === 'Tú' ? 'ti mismo' : recipient.name;
    let title;
    let successMessage;

    if (isTribe(recipient)) {
        title = step === 'success' ? '¡Aporte Realizado!' : <span className="flex items-center justify-center gap-2">Aportar a {recipientName} <BosqueIcon className="w-6 h-6 text-primary"/></span>;
        successMessage = `¡Bien hecho! Has aportado ${amount} treevüs para hacer crecer el bosque de ${recipientName}.`;
    } else {
        title = step === 'success' ? '¡Reconocimiento Enviado!' : <span className="flex items-center justify-center gap-2">Reconocer a {recipientName}</span>;
        successMessage = `¡Bien hecho! Has otorgado un trofeo de reconocimiento a ${recipientName} por su esfuerzo.`;
    }
    
    if (step === 'success') {
        return (
            <ModalWrapper title={title} onClose={onClose}>
                <div className="text-center -mt-5">
                    <CheckBadgeIcon className="w-20 h-20 text-primary mx-auto animate-grow-and-fade-in"/>
                    <p className="mt-4 text-on-surface-secondary">
                        <span dangerouslySetInnerHTML={{ __html: successMessage }} />
                    </p>
                    <button
                        onClick={onClose}
                        className="mt-6 w-full px-6 py-2.5 text-sm font-bold text-primary-dark bg-primary rounded-xl hover:opacity-90"
                    >
                        Cerrar
                    </button>
                </div>
            </ModalWrapper>
        );
    }
    
    return (
        <ModalWrapper title={title} onClose={onClose}>
            <div className="space-y-4 -mt-5">
                 {isTribe(recipient) ? (
                    <>
                        <div className="text-center p-3 bg-background rounded-xl">
                            <p className="text-sm text-on-surface-secondary">Tu saldo de treevüs</p>
                            <p className="text-2xl font-bold text-primary flex items-center justify-center gap-1.5">
                                {userBalance.toLocaleString()} <TreevuCoinIcon className="w-6 h-6" level={user!.level}/>
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-on-surface-secondary mb-2">Monto a aportar</label>
                            <div className="flex items-center gap-2 mb-2">
                                {quickAmounts.map(qAmount => (
                                    <button
                                        key={qAmount}
                                        onClick={() => setAmount(qAmount)}
                                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${amount === qAmount ? 'bg-primary text-primary-dark' : 'bg-active-surface text-on-surface'}`}
                                    >
                                        {qAmount}
                                    </button>
                                ))}
                            </div>
                            <input
                                type="number"
                                value={amount > 0 ? amount : ''}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                placeholder="Monto personalizado"
                                className="block w-full bg-background border border-active-surface rounded-xl p-2.5 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                            {amount > userBalance && (
                                <p className="text-xs text-danger mt-1">No tienes suficientes treevüs.</p>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <div className="text-center p-4 bg-background rounded-xl">
                            <TrophyIcon className="w-12 h-12 text-yellow-400 mx-auto"/>
                            <p className="text-sm text-on-surface-secondary mt-2">
                                Otorgar un Kudo es un galardón para celebrar el trabajo de un compañero. ¡Ganas <strong className="text-primary">5 treevüs</strong> por hacerlo!
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-on-surface-secondary mb-1">Mensaje (opcional)</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Ej: ¡Gran trabajo en el proyecto!"
                                rows={2}
                                className="block w-full bg-background border border-active-surface rounded-xl p-2.5 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary min-h-[60px]"
                            />
                        </div>
                    </>
                )}


                <div className="pt-4 border-t border-active-surface/50 flex justify-end">
                    <button
                        onClick={handleSend}
                        disabled={isTribe(recipient) && isAmountInvalid}
                        className="w-full px-6 py-2.5 text-sm font-bold text-primary-dark bg-primary rounded-xl hover:opacity-90 flex items-center justify-center gap-2 transition-opacity disabled:opacity-50"
                    >
                        <PaperAirplaneIcon className="w-5 h-5"/>
                        {isTribe(recipient) ? 'Aportar al Bosque' : 'Enviar Reconocimiento'}
                    </button>
                </div>
            </div>
        </ModalWrapper>
    );
};

export default SendKudosModal;