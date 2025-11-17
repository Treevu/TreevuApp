
import React, { useState } from 'react';
import ModalWrapper from '@/components/ui/ModalWrapper.tsx';
import { CheckIcon, GiftIcon, TreevuCoinIcon } from '@/components/ui/Icons';

interface PromoteLessonModalProps {
    onClose: () => void;
    onSave: (bonus: number) => void;
    lesson: {
        id: string;
        title: string;
    };
}

const PromoteLessonModal: React.FC<PromoteLessonModalProps> = ({ onClose, onSave, lesson }) => {
    // Usuario estático
    const user = {
        level: 3 as const
    };
    const [bonus, setBonus] = useState(50);
    const [error, setError] = useState('');

    const bonusSuggestions = [25, 50, 100, 200];

    const handleSave = () => {
        if (bonus <= 0) {
            setError('El bono debe ser un número positivo.');
            return;
        }
        onSave(bonus);
    };
    
    if (!user) return null;

    return (
        <ModalWrapper title="Promocionar Lección" onClose={onClose}>
            <div className="space-y-4 -mt-4">
                <p className="text-sm text-on-surface-secondary">
                    Estás a punto de crear una iniciativa para la lección: <strong className="text-on-surface">"{lesson.title}"</strong>.
                </p>
                <p className="text-sm text-on-surface-secondary">
                    Define un bono en Treevüs que recibirán los colaboradores al completarla.
                </p>

                {error && <p className="text-sm text-center text-danger">{error}</p>}
                
                <div className="text-center">
                    <label className="block text-sm font-medium text-on-surface-secondary mb-2">Bono por Completitud</label>
                    <div className="flex items-center justify-center gap-2">
                        <input
                            type="number"
                            value={bonus}
                            onChange={(e) => setBonus(Number(e.target.value))}
                            className="w-32 text-center text-3xl font-bold bg-background border border-active-surface rounded-lg p-2"
                        />
                        <TreevuCoinIcon className="w-8 h-8 text-primary" level={user.level}/>
                    </div>
                     <div className="mt-4 flex items-center justify-center space-x-2">
                        {bonusSuggestions.map((amount) => (
                            <button
                                key={amount}
                                onClick={() => setBonus(amount)}
                                className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${bonus === amount ? 'bg-primary text-primary-dark' : 'bg-active-surface text-on-surface-secondary'}`}
                            >
                                {amount}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-6 pt-5 border-t border-active-surface/50 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-on-surface bg-active-surface rounded-xl hover:bg-active-surface/70">
                        Cancelar
                    </button>
                    <button onClick={handleSave} className="px-6 py-2 text-sm font-bold text-primary-dark bg-primary rounded-xl hover:opacity-90 flex items-center">
                        <CheckIcon className="w-5 h-5 mr-1.5"/>
                        Crear Iniciativa
                    </button>
                </div>
            </div>
        </ModalWrapper>
    );
};

export default PromoteLessonModal;