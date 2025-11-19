import React, { useState, useCallback } from 'react';
import ModalWrapper from '@/components/ui/ModalWrapper.tsx';
import { SparklesIcon, FlagIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, CheckIcon } from '@/components/ui/Icons';
import { DEPARTMENTS, Challenge } from '@/types/employer';
import { getAIImpactProjection } from '@/services/ai/employerService';
import { useModal } from '@/hooks/useZustandCompat';

interface ImpactSimulatorModalProps {
    onClose: () => void;
    dashboardData: any;
    onLaunch: (suggestion?: Omit<Challenge, 'id'>) => void;
}

type Projection = {
    newFwi: number;
    newRiskScore: number;
    newRoi: number;
    rationale: string;
}

const KpiProjectionCard: React.FC<{ title: string; oldValue: string; newValue: string; delta: string; isPositive: boolean }> = ({ title, oldValue, newValue, delta, isPositive }) => (
    <div className="bg-background p-3 rounded-lg text-center">
        <p className="text-xs font-semibold text-on-surface-secondary">{title}</p>
        <div className="flex items-baseline justify-center gap-2 mt-1">
            <span className="text-lg font-bold text-on-surface-secondary line-through">{oldValue}</span>
            <span className="text-3xl font-extrabold text-on-surface">{newValue}</span>
        </div>
        <p className={`text-sm font-bold flex items-center justify-center ${isPositive ? 'text-emerald-500' : 'text-danger'}`}>
            {isPositive ? <ArrowTrendingUpIcon className="w-4 h-4 mr-1" /> : <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />}
            {delta}
        </p>
    </div>
);

const ImpactSimulatorModal: React.FC<ImpactSimulatorModalProps> = ({ onClose, dashboardData, onLaunch }) => {
    const { closeModal } = useModal();
    const [action, setAction] = useState<'challenge' | 'bonus' | 'workshop'>('challenge');
    const [department, setDepartment] = useState('all');
    const [parameter, setParameter] = useState(4); // weeks for challenge, % for bonus, etc.

    const [isLoading, setIsLoading] = useState(false);
    const [projection, setProjection] = useState<Projection | null>(null);
    const [error, setError] = useState('');

    const handleSimulate = useCallback(async () => {
        setIsLoading(true);
        setError('');
        setProjection(null);

        try {
            const result = await getAIImpactProjection({
                currentData: dashboardData,
                action,
                department,
                parameter,
            });
            if (result) {
                setProjection(result);
            } else {
                setError('La IA no pudo generar una proyección con estos datos. Intenta ajustar los parámetros.');
            }
        } catch (e) {
            setError('Hubo un error al conectar con la IA. Por favor, intenta de nuevo.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [dashboardData, action, department, parameter]);
    
    const handleLaunch = () => {
        const suggestion: Omit<Challenge, 'id'> = {
            title: `Iniciativa: ${action === 'challenge' ? 'Desafío de Ahorro' : action === 'bonus' ? 'Bono de Bienestar' : 'Taller Financiero'}`,
            description: `Iniciativa generada a partir de una simulación de impacto para el departamento de ${department === 'all' ? 'toda la empresa' : department}.`,
            department: department,
            targetMetric: 'financialWellnessIndex',
            targetValue: Math.round(projection?.newFwi || dashboardData.financialWellnessIndex + 2),
            reward: `Bono de ${parameter}%`
        };
        closeModal();
        onLaunch(suggestion);
    };

    const isFormIncomplete = !action || !department || !parameter;

    return (
        <ModalWrapper title="Simulador de Impacto Estratégico" onClose={onClose}>
            <div className="space-y-4 -mt-4">
                <p className="text-sm text-on-surface-secondary">Selecciona una iniciativa y un segmento para proyectar su impacto en los KPIs clave de tu equipo.</p>
                
                {/* --- FORMULARIO --- */}
                <div className="space-y-3 p-3 bg-background rounded-lg">
                    <div>
                        <label className="block text-xs font-medium text-on-surface-secondary mb-1">Tipo de Iniciativa</label>
                        <select value={action} onChange={e => setAction(e.target.value as any)} className="w-full bg-surface border border-active-surface rounded-md p-2 text-sm">
                            <option value="challenge">Lanzar Desafío de Ahorro</option>
                            <option value="bonus">Otorgar Bono de Bienestar (%)</option>
                            <option value="workshop">Ofrecer Taller Financiero</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-on-surface-secondary mb-1">Segmento</label>
                         <select value={department} onChange={e => setDepartment(e.target.value)} className="w-full bg-surface border border-active-surface rounded-md p-2 text-sm">
                            <option value="all">Toda la Empresa</option>
                            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <div>
                         <label className="block text-xs font-medium text-on-surface-secondary mb-1">
                           {action === 'challenge' ? 'Duración (Semanas)' : action === 'bonus' ? 'Monto del Bono (% del salario)' : 'Nº de Sesiones'}
                        </label>
                        <input type="number" value={parameter} onChange={e => setParameter(Number(e.target.value))} className="w-full bg-surface border border-active-surface rounded-md p-2 text-sm" />
                    </div>
                </div>

                <button
                    onClick={handleSimulate}
                    disabled={isLoading || isFormIncomplete}
                    className="w-full bg-primary text-primary-dark font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-opacity disabled:opacity-50"
                >
                    {isLoading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-primary-dark border-t-transparent rounded-full animate-spin"></div>
                            <span>Analizando Escenario...</span>
                        </>
                    ) : (
                        <>
                            <SparklesIcon className="w-5 h-5"/>
                            Simular Impacto con IA
                        </>
                    )}
                </button>
                {error && <p className="text-sm text-center text-danger">{error}</p>}
                
                {/* --- RESULTADOS --- */}
                {projection && (
                    <div className="pt-4 border-t border-active-surface/50 space-y-4 animate-fade-in">
                        <h3 className="text-base font-bold text-on-surface">Proyección de Impacto</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <KpiProjectionCard title="FWI" oldValue={dashboardData.financialWellnessIndex.toFixed(0)} newValue={projection.newFwi.toFixed(0)} delta={`+${(projection.newFwi - dashboardData.financialWellnessIndex).toFixed(1)} pts`} isPositive={true}/>
                            <KpiProjectionCard title="Riesgo Fuga" oldValue={`${dashboardData.flightRiskScore.toFixed(0)}%`} newValue={`${projection.newRiskScore.toFixed(0)}%`} delta={`${(projection.newRiskScore - dashboardData.flightRiskScore).toFixed(1)} pts`} isPositive={false}/>
                            <KpiProjectionCard title="ROI" oldValue={`${dashboardData.roiMultiplier.toFixed(1)}x`} newValue={`${projection.newRoi.toFixed(1)}x`} delta={`+${(projection.newRoi - dashboardData.roiMultiplier).toFixed(1)}x`} isPositive={true}/>
                        </div>
                         <div className="p-3 bg-background rounded-lg">
                            <p className="text-xs font-bold text-primary mb-1">Análisis de la IA:</p>
                            <p className="text-sm text-on-surface-secondary">{projection.rationale}</p>
                        </div>
                        <button 
                            onClick={handleLaunch}
                            className="w-full bg-primary/20 text-primary font-bold py-2.5 rounded-xl flex items-center justify-center gap-2"
                        >
                            <FlagIcon className="w-5 h-5"/>
                            Convertir en Iniciativa
                        </button>
                    </div>
                )}
            </div>
        </ModalWrapper>
    );
};

export default ImpactSimulatorModal;
