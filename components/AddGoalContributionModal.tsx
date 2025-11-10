

import React, { useState } from 'react';
import { BanknotesIcon } from './Icons';
import { useGoals } from '../contexts/GoalsContext';
import ModalWrapper from './ModalWrapper';
import { trackEvent } from '../services/analyticsService';
import { useAuth } from '../contexts/AuthContext';

interface AddGoalContributionModalProps {
    onClose: () => void;
    goalId: string;
}

const AddGoalContributionModal: React.FC<AddGoalContributionModalProps> = ({ onClose, goalId }) => {
    const { updateGoalContribution, goals } = useGoals();
    const { user } = useAuth();
    const goal = goals.find(g => g.id === goalId);
    const [amount, setAmount] = useState('');
    const [error, setError] = useState<string | null>(null);

    if (!goal) {
        // This should not happen if the UI is correct
        return null;
    }

    const handleSave = () => {
        const contributionAmount = parseFloat(amount);
        if (isNaN(contributionAmount) || contributionAmount <= 0) {
            setError('Por favor, ingresa un monto válido y positivo.');
            return;
        }
        
        // --- Telemetry (Result): Track successful action from stimulus ---
        const activeStimulusRaw = sessionStorage.getItem('active_stimulus');
        if (activeStimulusRaw) {
            const activeStimulus = JSON.parse(activeStimulusRaw);
            if (activeStimulus.id === 'savings_challenge') {
                trackEvent('stimulus_responded', { 
                    stimulusId: activeStimulus.id,
                    result: 'success',
                    timeToConvert_ms: Date.now() - activeStimulus.shownAt,
                    properties: { contributionAmount }
                }, user);
                sessionStorage.removeItem('active_stimulus'); // Track only once
            }
        }

        updateGoalContribution(goalId, contributionAmount);
        onClose();
    };

    return (
        <ModalWrapper title={`Añadir Fondos al Proyecto "${goal.name}"`} onClose={onClose}>
            <div>
                <p className="text-on-surface-secondary mb-4 text-sm">
                    Registra un avance en tu proyecto. Este es un <strong className="text-on-surface">registro virtual</strong> para monitorear tu progreso, no una transferencia de dinero real.
                </p>
                {error && <p role="alert" className="text-danger bg-danger/20 p-2 rounded-md text-xs text-center mb-4">{error}</p>}
                
                <div>
                    <label htmlFor="contribution-amount" className="block text-sm font-medium text-on-surface-secondary">
                        Monto a Invertir
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-on-surface-secondary sm:text-sm">S/</span>
                        </div>
                        <input
                            type="number"
                            id="contribution-amount"
                            value={amount}
                            onChange={(e) => {
                                setAmount(e.target.value);
                                if (error) setError(null);
                            }}
                            className="block w-full rounded-xl border border-active-surface bg-background pl-8 pr-3 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary sm:text-sm"
                            placeholder="50.00"
                            autoFocus
                        />
                    </div>
                </div>
                
                <div className="mt-6 pt-5 border-t border-active-surface/50 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-bold text-on-surface bg-active-surface rounded-xl hover:bg-active-surface/70 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 text-sm font-bold text-primary-dark bg-primary rounded-xl hover:opacity-90 flex items-center transition-opacity"
                    >
                        <BanknotesIcon className="w-5 h-5 mr-1.5"/>
                        Registrar Aporte
                    </button>
                </div>
            </div>
        </ModalWrapper>
    );
};

export default AddGoalContributionModal;
