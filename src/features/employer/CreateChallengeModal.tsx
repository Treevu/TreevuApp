



import React, { useState, useEffect } from 'react';
// FIX: Updated imports from deprecated 'types.ts'.
import { Challenge, DEPARTMENTS } from '@/types/employer';
import { CheckIcon } from '@/components/ui/Icons';
import ModalWrapper from '@/components/ui/ModalWrapper.tsx';

interface CreateChallengeModalProps {
    onClose: () => void;
    onSave: (challenge: Omit<Challenge, 'id'>) => void;
    suggestion?: Omit<Challenge, 'id'>;
}

const inputClasses = "block w-full bg-background border border-active-surface rounded-xl p-2.5 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary";

const CreateChallengeModal: React.FC<CreateChallengeModalProps> = ({ onClose, onSave, suggestion }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [department, setDepartment] = useState('all');
    const [targetMetric, setTargetMetric] = useState<'financialWellnessIndex' | 'formalityScore'>('formalityScore');
    const [targetValue, setTargetValue] = useState(80);
    const [reward, setReward] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (suggestion) {
            setTitle(suggestion.title || '');
            setDescription(suggestion.description || '');
            setDepartment(suggestion.department || 'all');
            setTargetMetric(suggestion.targetMetric || 'formalityScore');
            setTargetValue(suggestion.targetValue || 80);
            setReward(suggestion.reward || '');
        }
    }, [suggestion]);

    const handleSubmit = () => {
        setError('');
        if (!title.trim() || !reward.trim()) {
            setError('El nombre y el incentivo de la iniciativa son obligatorios.');
            return;
        }

        onSave({
            title,
            description,
            department,
            targetMetric,
            targetValue,
            reward,
        });
    };

    return (
        <ModalWrapper title="Crear Nueva Iniciativa" onClose={onClose}>
            <div className="space-y-4 -mt-5">
                {error && <p className="text-danger bg-danger/20 p-2 rounded-md text-sm text-center">{error}</p>}
                <div>
                    <label className="block text-sm font-medium text-on-surface-secondary mb-1">Nombre de la Iniciativa</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Impulso de Formalidad Q3" className={inputClasses} />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-on-surface-secondary mb-1">Descripción de la Iniciativa</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ej: Aumentar el % de gastos formales para maximizar el ahorro fiscal." className={`${inputClasses} min-h-[60px]`} rows={2} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-on-surface-secondary mb-1">Departamento</label>
                        <select value={department} onChange={(e) => setDepartment(e.target.value)} className={inputClasses}>
                            <option value="all">Toda la Empresa</option>
                            {DEPARTMENTS.map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-on-surface-secondary mb-1">Métrica Clave</label>
                        <select value={targetMetric} onChange={(e) => setTargetMetric(e.target.value as any)} className={inputClasses}>
                            <option value="formalityScore">Índice de Formalidad (%)</option>
                            <option value="financialWellnessIndex">Índice de Bienestar (FWI)</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-on-surface-secondary mb-1">
                        Objetivo: <span className="font-bold text-primary">{targetValue}{targetMetric === 'formalityScore' ? '%' : ''}</span>
                    </label>
                    <input type="range" min="1" max="100" value={targetValue} onChange={(e) => setTargetValue(Number(e.target.value))} className="w-full h-2 bg-active-surface rounded-lg appearance-none cursor-pointer" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-on-surface-secondary mb-1">Incentivo de la Iniciativa</label>
                    <input type="text" value={reward} onChange={(e) => setReward(e.target.value)} placeholder="Ej: Almuerzo de equipo pagado" className={inputClasses} />
                </div>
                 <div className="pt-4 border-t border-active-surface/50 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-on-surface bg-active-surface rounded-xl hover:bg-active-surface/70">
                        Cancelar
                    </button>
                    <button onClick={handleSubmit} className="px-6 py-2 text-sm font-bold text-primary-dark bg-primary rounded-xl hover:opacity-90 flex items-center">
                        <CheckIcon className="w-5 h-5 mr-1.5"/>
                        Crear Iniciativa
                    </button>
                </div>
            </div>
        </ModalWrapper>
    );
};

export default CreateChallengeModal;