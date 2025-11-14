import React, { useState, useEffect, useMemo } from 'react';
import { LightBulbIcon, SparklesIcon, ArrowTopRightOnSquareIcon } from './Icons';
import { useAppContext } from '../contexts/AppContext';
import { getAIGoalCoaching } from '../services/ai/employeeService';
import { CategoriaGasto } from '../types/common';

interface AIGoalCoachCardProps {
    onCategoryClick: (category: CategoriaGasto) => void;
}

const AIGoalCoachCard: React.FC<AIGoalCoachCardProps> = ({ onCategoryClick }) => {
    const { state: { goals, expenses } } = useAppContext();
    const [coaching, setCoaching] = useState<{ plan: string; insight: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const primaryGoal = useMemo(() => {
        if (!goals || goals.length === 0) return null;
        return [...goals].sort((a, b) => (b.currentAmount / b.targetAmount) - (a.currentAmount / a.targetAmount))[0];
    }, [goals]);

    useEffect(() => {
        const fetchCoaching = async () => {
            if (!primaryGoal) {
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            setError(null);
            try {
                const result = await getAIGoalCoaching(primaryGoal, expenses);
                if (result) {
                    setCoaching(result);
                } else {
                    setCoaching(null);
                }
            } catch (err) {
                setError("Error al obtener consejo de la IA.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        if (primaryGoal) {
            const timer = setTimeout(fetchCoaching, 300);
            return () => clearTimeout(timer);
        }

    }, [primaryGoal, expenses]);
    
    const suggestedCategory = useMemo(() => {
        if (!coaching?.plan) return null;
        const match = coaching.plan.match(/'([^']+)'/);
        const categoryString = match ? match[1] : null;

        if (categoryString && Object.values(CategoriaGasto).includes(categoryString as CategoriaGasto)) {
            return categoryString as CategoriaGasto;
        }
        return null;
    }, [coaching]);

    if (!primaryGoal) return null;

    if (isLoading) {
        return (
            <div className="bg-surface rounded-2xl p-4 animate-pulse">
                <div className="h-5 w-1/2 bg-active-surface rounded mb-3"></div>
                <div className="h-4 w-full bg-active-surface rounded mb-2"></div>
                <div className="h-4 w-3/4 bg-active-surface rounded"></div>
            </div>
        );
    }
    
    if (error || !coaching) {
        return (
            <div className="bg-surface rounded-2xl p-4 animate-grow-and-fade-in">
                <h2 className="text-lg font-bold text-on-surface mb-2 flex items-center">
                    <SparklesIcon className="w-6 h-6 mr-2 text-primary"/>
                    Consejero de Proyectos IA
                </h2>
                <div className="text-sm text-on-surface-secondary min-h-[40px] flex items-center">
                    <p>No hay sugerencias por ahora. ¡Sigue registrando gastos y metas para recibir consejos personalizados!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-surface to-active-surface rounded-2xl p-4 animate-grow-and-fade-in border border-active-surface/50">
            <h2 className="text-lg font-bold text-on-surface mb-2 flex items-center">
                <SparklesIcon className="w-6 h-6 mr-2 text-primary"/>
                Consejero de Proyectos IA
            </h2>

            <div className="bg-background/50 rounded-lg p-3 my-3">
                 <p className="text-sm text-on-surface font-semibold text-center">
                    "{coaching.plan}"
                </p>
            </div>
            
            <div className="flex items-start gap-2 text-sm text-on-surface-secondary">
                <LightBulbIcon className="w-5 h-5 mt-0.5 text-primary flex-shrink-0" />
                <p className="italic">"{coaching.insight}"</p>
            </div>
           
            {suggestedCategory && (
                <div className="mt-4 pt-3 border-t border-active-surface/50">
                    <button 
                        onClick={() => onCategoryClick(suggestedCategory)}
                        className="w-full bg-primary/20 text-primary font-bold py-2 px-4 rounded-xl hover:bg-primary/30 transition-colors flex items-center justify-center text-sm"
                    >
                        Analizar gastos en "{suggestedCategory}"
                        <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-2" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default AIGoalCoachCard;