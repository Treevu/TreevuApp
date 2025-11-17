import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAppContext } from '../contexts/AppContext';
import { useAlert } from '../contexts/AlertContext';
import { Goal } from '../types/goal';
import { generateUniqueId } from '../utils';
import { CheckIcon, BuildingBlocksIcon, BanknotesIcon } from './Icons';

const iconSuggestions = ['✈️', '🎓', '🏠', '💻', '🎁', '🚗'];

const OnboardingWizard: React.FC = () => {
    const { completeOnboarding } = useAuth();
    const { updateBudget, addGoal } = useAppContext();
    const { setAlert } = useAlert();

    const [step, setStep] = useState(1);

    // Step 1 state
    const [budget, setBudget] = useState('1500');

    // Step 2 state
    const [goalName, setGoalName] = useState('');
    const [goalAmount, setGoalAmount] = useState('1000');
    const [selectedIcon, setSelectedIcon] = useState(iconSuggestions[0]);
    const [error, setError] = useState('');

    const handleBudgetSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(2);
    };

    const handleFinish = () => {
        setError('');
        const budgetValue = parseFloat(budget);
        const goalAmountValue = parseFloat(goalAmount);
        
        if (!goalName.trim()) {
            setError('Dale un nombre a tu proyecto.');
            return;
        }
        if (isNaN(goalAmountValue) || goalAmountValue <= 0) {
            setError('El valor del proyecto debe ser mayor a cero.');
            return;
        }

        // Update context states
        updateBudget(budgetValue); // This will grant the first 25 treevüs
        
        const newGoal: Goal = {
            id: generateUniqueId(),
            name: goalName.trim(),
            targetAmount: goalAmountValue,
            currentAmount: 0,
            icon: selectedIcon,
            createdAt: new Date().toISOString(),
            status: 'active',
        };
        addGoal(newGoal); // This will grant the next 25 treevüs

        // Mark onboarding as complete
        completeOnboarding(); // This will grant the final 50 treevüs
        
        setAlert({
            message: '¡Configuración completada! Has ganado un total de <strong>100 treevüs</strong>. ¡Que comience la expedición!',
            type: 'success'
        });
    };

    const renderStep1 = () => (
        <>
            <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BanknotesIcon className="w-9 h-9 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-on-surface">Define tu Presupuesto Mensual</h2>
                <p className="text-on-surface-secondary mt-2">Establece un límite para tus gastos. Será tu brújula para navegar tus finanzas.</p>
            </div>
            <form onSubmit={handleBudgetSubmit} className="mt-8 space-y-6">
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
                        onChange={(e) => setBudget(e.target.value)}
                        aria-labelledby="budget-amount-label"
                    />
                     <div className="w-full flex justify-between text-xs text-on-surface-secondary mt-1">
                        <span>S/ 0</span>
                        <span>S/ 5,000</span>
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-accent to-accent-secondary text-primary-dark font-bold py-3 px-6 rounded-xl text-lg transition-all duration-300 hover:shadow-lg hover:shadow-accent/20"
                >
                    Siguiente
                </button>
            </form>
        </>
    );

    const renderStep2 = () => (
         <>
            <div className="text-center">
                 <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BuildingBlocksIcon className="w-9 h-9 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-on-surface">Tu Primer Proyecto de Conquista</h2>
                <p className="text-on-surface-secondary mt-2">Dale un propósito a tu ahorro. ¿Cuál es tu primer gran tesoro a conquistar?</p>
            </div>
            <div className="mt-8 space-y-4">
                {error && <p className="text-danger text-sm text-center bg-danger/10 p-2 rounded-lg">{error}</p>}
                <div>
                    <label className="block text-sm font-medium text-on-surface-secondary mb-1">Nombre del Proyecto</label>
                    <input type="text" value={goalName} onChange={(e) => setGoalName(e.target.value)} placeholder="Ej: Viaje a Cusco" className="w-full bg-background border border-active-surface rounded-xl p-2.5" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-on-surface-secondary mb-1">Valor del Tesoro (S/)</label>
                    <input type="number" value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)} className="w-full bg-background border border-active-surface rounded-xl p-2.5" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-on-surface-secondary mb-2">Elige un Ícono</label>
                    <div className="flex justify-center items-center gap-2">
                        {iconSuggestions.map(icon => (
                            <button key={icon} onClick={() => setSelectedIcon(icon)} className={`w-10 h-10 text-2xl rounded-full transition-all duration-200 flex items-center justify-center ${selectedIcon === icon ? 'bg-primary ring-2 ring-offset-2 ring-offset-surface ring-primary' : 'bg-background hover:bg-active-surface'}`}>
                                {icon}
                            </button>
                        ))}
                    </div>
                </div>
                <button
                    onClick={handleFinish}
                    className="w-full bg-gradient-to-r from-accent to-accent-secondary text-primary-dark font-bold py-3 px-6 rounded-xl text-lg transition-all duration-300 !mt-6 hover:shadow-lg hover:shadow-accent/20"
                >
                    <CheckIcon className="w-6 h-6 inline-block mr-2" />
                    Finalizar y Empezar
                </button>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-on-surface animate-fade-in">
             <main className="w-full max-w-sm">
                <div className="flex items-center justify-center gap-3 mb-6">
                    <div className={`w-1/2 h-1.5 rounded-full transition-colors ${step >= 1 ? 'bg-primary' : 'bg-active-surface'}`}></div>
                    <div className={`w-1/2 h-1.5 rounded-full transition-colors ${step >= 2 ? 'bg-primary' : 'bg-active-surface'}`}></div>
                </div>
                <div className="bg-surface/80 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/10">
                    {step === 1 ? renderStep1() : renderStep2()}
                </div>
             </main>
        </div>
    );
};

export default OnboardingWizard;