import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useModal } from '@/contexts/ModalContext';
import { BanknotesIcon, BuildingBlocksIcon, PencilSquareIcon, CheckIcon } from '@/components/ui/Icons';

const OnboardingChecklist: React.FC = () => {
    const { state } = useAppContext();
    const { openModal } = useModal();
    const { budget, goals } = state;

    const tasks = [
        {
            id: 'budget',
            title: 'Define las Fronteras de tu Territorio',
            description: 'Establece un límite mensual para empezar a monitorear.',
            Icon: BanknotesIcon,
            isCompleted: budget !== null && budget > 0,
            action: () => openModal('setBudget'),
        },
        {
            id: 'goal',
            title: 'Traza el Mapa de tu Primer Tesoro',
            description: 'Crea tu primer proyecto de ahorro, como un viaje o una compra.',
            Icon: BuildingBlocksIcon,
            isCompleted: goals.length > 0,
            action: () => openModal('setGoal'),
        },
        {
            id: 'expense',
            title: 'Haz tu Primer Hallazgo en el Terreno',
            description: 'Añade tu primer gasto para ver la magia en acción.',
            Icon: PencilSquareIcon,
            isCompleted: false, // This task leads to the component disappearing
            action: () => openModal('addExpense'),
        },
    ];

    return (
        <div className="bg-surface rounded-2xl p-4 sm:p-6 animate-grow-and-fade-in shadow-card dark:shadow-none dark:ring-1 dark:ring-white/10">
            <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-on-surface">🏕️ Campamento Base del Explorador</h2>
                <p className="text-sm text-on-surface-secondary mt-1">Completa tu misión de iniciación para empezar tu expedición. ¡Cada paso te da recompensas!</p>
            </div>
            
            <div className="space-y-3">
                {tasks.map((task, index) => (
                    <button
                        key={task.id}
                        onClick={task.action}
                        disabled={task.isCompleted}
                        className="w-full p-4 bg-background rounded-xl text-left flex items-center gap-4 transition-all duration-300 disabled:opacity-60 disabled:cursor-default hover:bg-active-surface animate-staggered-fade-in-slide-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${task.isCompleted ? 'bg-primary/20' : 'bg-primary/10'}`}>
                            {task.isCompleted ? (
                                <CheckIcon className="w-8 h-8 text-primary" />
                            ) : (
                                <task.Icon className="w-7 h-7 text-primary" />
                            )}
                        </div>
                        <div className="flex-1">
                            <h3 className={`font-bold text-on-surface ${task.isCompleted ? 'line-through text-on-surface-secondary' : ''}`}>{task.title}</h3>
                            <p className="text-xs text-on-surface-secondary">{task.description}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default OnboardingChecklist;
