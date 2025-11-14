import React from 'react';
import {
    ExclamationTriangleIcon,
    PencilIcon,
    TrashIcon,
    ChevronDownIcon,
    EyeIcon,
} from './Icons';
import { categoryDetails } from './TrendAnalysis';
import { CategoriaGasto } from '../types/common';
import { Expense } from '../types/expense';

interface ExpenseCardUltraCompactProps {
    expense: Expense;
    onDelete: (expenseId: string) => void;
    onEdit: (expenseId: string) => void;
    isExpanded: boolean;
    onToggle: () => void;
    index: number;
}

const ExpenseCardUltraCompact: React.FC<ExpenseCardUltraCompactProps> = ({
    expense,
    onDelete,
    onEdit,
    isExpanded,
    onToggle,
    index,
}) => {
    const Icon = categoryDetails[expense.categoria]?.Icon || categoryDetails[CategoriaGasto.Otros].Icon;
    
    const isInformalAndLost = !expense.esFormal && expense.ahorroPerdido > 0;
    const hasViolations = expense.violations && expense.violations.length > 0;
    
    const cardClasses = `w-full text-left bg-surface rounded-2xl transition-all duration-300 ease-in-out group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary shadow-card dark:shadow-none dark:ring-1 dark:ring-white/10 ${isInformalAndLost ? 'informal-expense' : hasViolations ? 'border-l-4 border-warning' : 'border-l-4 border-transparent'}`;

    return (
        <div 
            className="relative animate-staggered-fade-in-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            <button className={cardClasses} onClick={onToggle} aria-expanded={isExpanded}>
                {/* Main visible part */}
                <div className="p-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-active-surface flex-shrink-0">
                        <Icon className="w-5 h-5 text-on-surface-secondary" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-on-surface">
                            {expense.razonSocial}
                        </p>
                        <div className="flex items-center text-xs text-on-surface-secondary mt-0.5">
                            <span>{expense.categoria}</span>
                            {isInformalAndLost && (
                                <span className="flex items-center ml-2 text-warning font-semibold">
                                    <ExclamationTriangleIcon className="w-3.5 h-3.5 mr-1" />
                                    Ahorro perdido
                                </span>
                            )}
                            {hasViolations && (
                                <span className="flex items-center ml-2 text-warning font-semibold">
                                    <ExclamationTriangleIcon className="w-3.5 h-3.5 mr-1" />
                                    Incumplimiento
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="text-right flex-shrink-0 flex items-center gap-3">
                        <span className="font-bold text-base text-on-surface">
                            S/ {expense.total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                        </span>
                        <ChevronDownIcon className={`w-5 h-5 text-primary transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                </div>
            </button>
            {/* Collapsible details part */}
            <div
                className="transition-all duration-300 ease-in-out overflow-hidden"
                style={{ maxHeight: isExpanded ? '250px' : '0px' }}
                aria-hidden={!isExpanded}
            >
                <div className="bg-surface rounded-b-2xl">
                    <div className="border-t border-active-surface/50"></div>
                    <div className="p-3 text-xs text-on-surface-secondary space-y-2">
                        {hasViolations && (
                            <div className="bg-warning/10 p-2 rounded-lg space-y-1 mb-2">
                                {expense.violations?.map(v => (
                                    <div key={v.policyId} className="flex items-start gap-1.5 text-warning">
                                        <ExclamationTriangleIcon className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                                        <p className="text-xs font-semibold">{v.message}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="font-semibold">Tipo Comprobante:</span>
                            <span>{expense.tipoComprobante}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">RUC:</span>
                            <span>{expense.ruc}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">IGV (aprox.):</span>
                            <span>S/ {expense.igv.toFixed(2)}</span>
                        </div>
                        {isInformalAndLost && (
                            <div className="flex justify-between font-bold text-warning">
                            <span>Base Deducible Perdida:</span>
                            <span>S/ {expense.ahorroPerdido.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-end space-x-2 pt-1">
                             {expense.imageUrl && (
                                <a
                                    href={expense.imageUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="px-3 py-1 text-xs font-bold text-on-surface bg-active-surface rounded-full hover:opacity-80 transition-opacity flex items-center"
                                >
                                    <EyeIcon className="w-3 h-3 mr-1" /> Ver Imagen
                                </a>
                            )}
                            <button onClick={(e) => { e.stopPropagation(); onEdit(expense.id); }} className="px-3 py-1 text-xs font-bold text-on-surface bg-active-surface rounded-full hover:opacity-80 transition-opacity flex items-center"> <PencilIcon className="w-3 h-3 mr-1"/> Editar </button>
                            <button onClick={(e) => { e.stopPropagation(); onDelete(expense.id); }} className="px-3 py-1 text-xs font-bold text-white bg-danger rounded-full hover:opacity-80 transition-opacity flex items-center"> <TrashIcon className="w-3 h-3 mr-1"/> Eliminar </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(ExpenseCardUltraCompact);