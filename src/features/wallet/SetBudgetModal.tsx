

import React, { useState } from 'react';
import { CheckIcon } from '@/components/ui/Icons';
import { useAppContext } from '@/contexts/AppContext';
import ModalWrapper from '@/components/ui/ModalWrapper.tsx';

interface SetBudgetModalProps {
    onClose: () => void;
}

const SetBudgetModal: React.FC<SetBudgetModalProps> = ({ onClose }) => {
    const { state: { budget: currentBudget }, updateBudget } = useAppContext();
    const [budget, setBudget] = useState<string>(currentBudget ? currentBudget.toString() : '1500');
    const [error, setError] = useState<string | null>(null);
    const budgetSuggestions = [1000, 2000, 3000];

    const handleSave = () => {
        const newBudget = parseFloat(budget);
        if (isNaN(newBudget) || newBudget < 0) {
            setError('Por favor, ingresa un monto válido.');
            return;
        }
        updateBudget(newBudget);
        onClose();
    };

    return (
        <ModalWrapper title="Define el Rumbo de tu Expedición" onClose={onClose}>
            <div>
                <p className="text-on-surface-secondary mb-4 text-sm text-center">Establece un límite mensual. Será tu brújula para navegar tus finanzas y no desviarte del camino.</p>
                {error && <p role="alert" className="text-danger bg-danger/20 p-2 rounded-md text-xs text-center mb-4">{error}</p>}
                
                <div className="flex flex-col items-center">
                    <h3 id="budget-amount-label" className="text-6xl font-black text-primary my-3 tracking-tighter">
                        S/ {parseInt(budget, 10).toLocaleString('es-PE')}
                    </h3>
                    <input
                        type="range"
                        min="0"
                        max="5000"
                        step="50"
                        value={budget}
                        onChange={(e) => {
                            setBudget(e.target.value);
                            if (error) setError(null);
                        }}
                        aria-labelledby="budget-amount-label"
                    />
                    <div className="w-full flex justify-between text-xs text-on-surface-secondary mt-1">
                        <span>S/ 0</span>
                        <span>S/ 5,000</span>
                    </div>
                </div>
                <div className="mt-6 flex items-center justify-center space-x-2">
                     <span className="text-sm text-on-surface-secondary mr-2">Sugerencias:</span>
                    {budgetSuggestions.map((amount) => (
                        <button
                            key={amount}
                            onClick={() => {
                                setBudget(amount.toString());
                                if (error) setError(null);
                            }}
                            className="px-3 py-1 text-xs font-semibold text-on-surface-secondary bg-active-surface rounded-full hover:bg-primary hover:text-primary-dark transition-colors"
                        >
                            S/ {amount.toLocaleString('es-PE')}
                        </button>
                    ))}
                </div>
                <div className="mt-8 pt-5 border-t border-active-surface/50 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2.5 text-sm font-bold text-on-surface bg-active-surface rounded-xl hover:bg-active-surface/70 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2.5 text-sm font-bold text-primary-dark bg-primary rounded-xl hover:opacity-90 flex items-center transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary"
                    >
                        <CheckIcon className="w-5 h-5 mr-1.5"/>
                        Guardar
                    </button>
                </div>
            </div>
        </ModalWrapper>
    );
};

export default SetBudgetModal;
