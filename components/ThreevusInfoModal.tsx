import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { TreevuCoinIcon } from './Icons';
import ModalWrapper from './ModalWrapper';
import TreevuLogoText from './TreevuLogoText';

interface TreevusInfoModalProps {
    onClose: () => void;
}

const ThreevusInfoModal: React.FC<TreevusInfoModalProps> = ({ onClose }) => {
    const { user } = useAuth();
    if (!user) return null;

    const rewardActions = [
        { action: "Registrar un Hallazgo Formal", reward: "+8 a +12", description: "Cada boleta o factura con tu DNI." },
        { action: "Reconocer a un Compañero", reward: "+5", description: "Por cada trofeo que otorgas a tu equipo." },
        { action: "Subir de Nivel", reward: "+100", description: "Al alcanzar nuevas metas de gastos y formalidad." },
        { action: "Leer un Pergamino", reward: "+20", description: "Por cada artículo de la sección 'Aprende'." },
        { action: "Registrar un Hallazgo Informal", reward: "+1", description: "Para mantener tu mapa, aunque no sume a tu devolución." },
    ];
    
    const title = (
        <span className="flex items-center gap-1.5">
            Tu Cosecha de <TreevuLogoText isTreevus />
            <TreevuCoinIcon className="w-6 h-6 text-primary" level={user.level}/>
        </span>
    );

    return (
        <ModalWrapper title={title} onClose={onClose}>
            <div className="-mt-5">
                <p className="text-sm text-on-surface-secondary mb-4">
                    Tus monedas <TreevuLogoText isTreevus /> son los tesoros que cosechas en tu aventura financiera. Su apariencia evoluciona contigo, reflejando tu nivel de maestría.
                </p>
                <div className="space-y-3">
                    {rewardActions.map(item => (
                        <div key={item.action} className="bg-background p-3 rounded-xl flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-on-surface">{item.action}</p>
                                <p className="text-xs text-on-surface-secondary">{item.description}</p>
                            </div>
                            <span className="font-bold text-primary whitespace-nowrap flex items-center">
                                {item.reward} <TreevuCoinIcon className="w-4 h-4 ml-1" level={user.level} />
                            </span>
                        </div>
                    ))}
                </div>
                <div className="mt-6 pt-5 border-t border-active-surface/50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 text-sm font-bold text-primary-dark bg-primary rounded-xl hover:opacity-90 transition-opacity"
                    >
                        ¡Entendido!
                    </button>
                </div>
            </div>
        </ModalWrapper>
    );
};

export default ThreevusInfoModal;