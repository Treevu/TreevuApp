import React, { useState, useEffect } from 'react';
import { FlaskIcon } from './Icons';
import { FwiComponents, FwiComponent } from '../types/common';
import { useAppContext } from '../contexts/AppContext';
import { SimpleLineChart } from './TrendAnalysis';
import { getFWIExplanation } from '../services/ai/employeeService';
import { useAuth } from '../contexts/AuthContext';
import Spinner from './Spinner';

interface FinancialWellnessWidgetProps {
    fwi: number;
    components: FwiComponents;
}

const FinancialWellnessWidget: React.FC<FinancialWellnessWidgetProps> = ({ fwi, components }) => {
    const { state: { fwiHistory } } = useAppContext();
    const { user } = useAuth();
    const [isFlipped, setIsFlipped] = useState(false);
    const [explanation, setExplanation] = useState<Record<string, string> | null>(null);
    const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);

    const index = Math.round(fwi);
    const circumference = 2 * Math.PI * 34;
    const strokeDashoffset = circumference - (index / 100) * circumference;

    useEffect(() => {
        if (isFlipped && !explanation && user) {
            const fetchExplanation = async () => {
                setIsLoadingExplanation(true);
                try {
                    const result = await getFWIExplanation(user, components);
                    setExplanation(result);
                } catch (error) {
                    console.error("Failed to fetch FWI explanation", error);
                    setExplanation({ "Error": "No se pudo cargar la explicación." });
                } finally {
                    setIsLoadingExplanation(false);
                }
            };
            fetchExplanation();
        }
    }, [isFlipped, explanation, components, user]);

    const getStatus = () => {
        if (index >= 80) return { text: 'Maestro Alquimista', color: 'text-emerald-500' };
        if (index >= 65) return { text: 'Transmutación Avanzada', color: 'text-primary' };
        if (index >= 50) return { text: 'Fórmula Perfectible', color: 'text-warning' };
        return { text: 'Materia Prima', color: 'text-danger' };
    };

    const status = getStatus();
    const chartData = fwiHistory.map(h => ({ label: h.month, value: h.value }));

    return (
        <div className="status-card-container aspect-[1.3] md:aspect-auto" onClick={() => setIsFlipped(!isFlipped)}>
            <div className={`status-card-inner ${isFlipped ? 'is-flipped' : ''}`}>
                {/* --- FRONT FACE --- */}
                <div className="status-card-face status-card-front bg-surface rounded-2xl p-4 flex flex-col justify-between cursor-pointer">
                    <div>
                        <h2 className="text-lg font-bold text-on-surface flex items-center">
                            <FlaskIcon className="w-6 h-6 mr-2 text-primary"/>
                            Tu Fórmula de Bienestar (FWI 2.0)
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative w-20 h-20 flex-shrink-0">
                            <svg className="w-full h-full" viewBox="0 0 80 80">
                                <circle className="text-active-surface" strokeWidth="8" stroke="currentColor" fill="transparent" r="36" cx="40" cy="40" />
                                <circle className={status.color} strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" stroke="currentColor" fill="transparent" r="36" cx="40" cy="40" style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.5s ease-out' }} />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className={`text-2xl font-bold ${status.color}`}>{index}</span>
                            </div>
                        </div>
                        <div className="text-left">
                            <p className={`font-bold text-lg ${status.color}`}>{status.text}</p>
                            <p className="text-xs text-on-surface-secondary mt-1">
                                Toca para descubrir el <strong className="text-on-surface">'porqué'</strong> detrás de tu puntaje.
                            </p>
                        </div>
                    </div>
                     <div className="text-xs text-center text-on-surface-secondary">Evolución (3 meses)</div>
                     <div className="h-20 -mx-2 -mb-2">
                        <SimpleLineChart data={chartData.slice(-3)} />
                     </div>
                </div>
                {/* --- BACK FACE --- */}
                <div className="status-card-face status-card-back bg-surface rounded-2xl p-4 flex flex-col justify-between cursor-pointer">
                     <h2 className="text-lg font-bold text-on-surface flex items-center">
                        <FlaskIcon className="w-6 h-6 mr-2 text-primary"/>
                        El 'Porqué' de tu FWI
                    </h2>
                    {isLoadingExplanation ? (
                        <div className="flex-grow flex items-center justify-center"><Spinner /></div>
                    ) : (
                        <div className="space-y-3 flex-grow flex flex-col justify-center">
                            {Object.values(components).map((comp, i) => {
                                const fwiComp = comp as FwiComponent;
                                return (
                                <div key={fwiComp.name} className="bg-background p-2 rounded-lg">
                                    <div className="flex items-center justify-between text-sm font-bold">
                                        <span>{fwiComp.name}</span>
                                        <span>{fwiComp.value.toFixed(0)}</span>
                                    </div>
                                    <p className="text-xs text-on-surface-secondary mt-1 italic">
                                        {explanation ? `"${explanation[fwiComp.name]}"` : 'Cargando explicación...'}
                                    </p>
                                </div>
                            )})}
                        </div>
                    )}
                    <p className="text-xs text-center text-on-surface-secondary mt-2">Toca de nuevo para volver.</p>
                </div>
            </div>
        </div>
    );
};

export default FinancialWellnessWidget;