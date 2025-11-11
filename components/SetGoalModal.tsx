import React, { useState } from 'react';
import { CheckIcon } from './Icons';
import { useGoals } from '../contexts/GoalsContext';
import { generateUniqueId } from '../utils';
import { Goal } from '../types/goal';
import ModalWrapper from './ModalWrapper';

interface SetGoalModalProps {
    onClose: () => void;
}

const iconSuggestions = ['✈️', '🎓', '🏠', '💻', '🎁', '🚗'];

const SetGoalModal: React.FC<SetGoalModalProps> = ({ onClose }) => {
    const { addGoal } = useGoals();
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('1000');
    const [selectedIcon, setSelectedIcon] = useState(iconSuggestions[0]);
    const [error, setError] = useState<string | null>(null);

    const handleSave = () => {
        const amount = parseFloat(targetAmount);
        if (!name.trim()) {
            setError('Dale un nombre a tu tesoro.');
            return;
        }
        if (isNaN(amount) || amount <= 0) {
            setError('Ingresa un valor válido y mayor a cero.');
            return;
        }

        const newGoal: Goal = {
            id: generateUniqueId(),
            name: name.trim(),
            targetAmount: amount,
            currentAmount: 0,
            icon: selectedIcon,
            createdAt: new Date().toISOString(),
            // FIX: Added missing 'status' property to match the 'Goal' type definition.
            status: 'active',
        };
        
        addGoal(newGoal);
        onClose();
    };

    return (
        <ModalWrapper title="Marcar un Nuevo Tesoro" onClose={onClose}>
            <div className="-mt-5">
                <p className="text-sm text-center text-on-surface-secondary mb-4">
                    Dale un nombre a tu tesoro, define su valor (monto objetivo) y elige un ícono para marcarlo en tu mapa financiero.
                </p>
                <div className="space-y-4">
                    {error && <p role="alert" className="text-danger bg-danger/20 p-2 rounded-md text-xs text-center">{error}</p>}
                    
                    <div>
                        <label className="block text-sm font-medium text-on-surface-secondary mb-1">Nombre del Tesoro</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ej: Tesoro 'Viaje a Cusco'"
                            className="block w-full rounded-xl border border-active-surface bg-background p-2.5 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-on-surface-secondary mb-1">Valor del Tesoro</label>
                         <div className="relative">
                             <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <span className="text-on-surface-secondary">S/</span>
                            </div>
                            <input
                                type="number"
                                value={targetAmount}
                                onChange={(e) => setTargetAmount(e.target.value)}
                                className="block w-full rounded-xl border border-active-surface bg-background pl-8 pr-3 py-2.5 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div>
                         <label className="block text-sm font-medium text-on-surface-secondary mb-2">Elige un Ícono</label>
                         <div className="flex justify-center items-center gap-2">
                            {iconSuggestions.map(icon => (
                                <button
                                    key={icon}
                                    onClick={() => setSelectedIcon(icon)}
                                    aria-label={`Seleccionar ícono ${icon}`}
                                    className={`w-10 h-10 text-2xl rounded-full transition-all duration-200 flex items-center justify-center ${selectedIcon === icon ? 'bg-primary ring-2 ring-offset-2 ring-offset-surface ring-primary' : 'bg-background hover:bg-active-surface'}`}
                                >
                                    {icon}
                                </button>
                            ))}
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
                        onClick={handleSave}
                        className="px-6 py-2 text-sm font-bold text-primary-dark bg-primary rounded-xl hover:opacity-90 flex items-center"
                    >
                        <CheckIcon className="w-5 h-5 mr-1.5"/>
                        Marcar Tesoro
                    </button>
                </div>
            </div>
        </ModalWrapper>
    );
};

export default SetGoalModal;
