import React, { useState, useEffect } from 'react';
import ModalWrapper from '@/components/ui/ModalWrapper.tsx';
import { CheckIcon } from '@/components/ui/Icons';

interface PersonalizationModalProps {
    onClose: () => void;
    storageKey: string;
}

const materials = [
    { id: 'default', name: 'Original', class: '' },
    { id: 'carbon-fiber', name: 'Fibra de Carbono', class: 'card-material-carbon-fiber' },
    { id: 'brushed-metal', name: 'Metal Cepillado', class: 'card-material-brushed-metal' },
    { id: 'holographic', name: 'Holográfico', class: 'card-material-holographic' },
    { id: 'matte-black', name: 'Negro Mate', class: 'card-material-matte-black' },
    { id: 'wood', name: 'Madera', class: 'card-material-wood' },
    { id: 'marble', name: 'Mármol', class: 'card-material-marble' },
    { id: 'pearl', name: 'Perlado', class: 'card-material-pearl' },
];

const accentColors = [
    { id: 'primary', name: 'Esmeralda', hex: '#10B981' },
    { id: 'accent', name: 'Dorado', hex: '#FACC15' },
    { id: 'danger', name: 'Rubí', hex: '#EF4444' },
    { id: 'indigo', name: 'Zafiro', hex: '#6366F1' },
    { id: 'cyan', name: 'Cian', hex: '#22D3EE' },
    { id: 'pink', name: 'Rosa', hex: '#EC4899' },
    { id: 'lime', name: 'Lima', hex: '#84CC16' },
    { id: 'silver', name: 'Plata', hex: '#D1D5DB' },
];

const PersonalizationModal: React.FC<PersonalizationModalProps> = ({ onClose, storageKey }) => {
    const [selectedMaterial, setSelectedMaterial] = useState('default');
    const [selectedAccent, setSelectedAccent] = useState('primary');

    useEffect(() => {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            const { material, accent } = JSON.parse(saved);
            setSelectedMaterial(material || 'default');
            setSelectedAccent(accent || 'primary');
        }
    }, [storageKey]);

    const handleSave = () => {
        localStorage.setItem(storageKey, JSON.stringify({ material: selectedMaterial, accent: selectedAccent }));
        window.dispatchEvent(new Event('storage')); // Disparar un evento para que las tarjetas se actualicen
        onClose();
    };

    return (
        <ModalWrapper title="Personalizar Tarjeta" onClose={onClose}>
            <div className="space-y-6">
                <div>
                    <h3 className="text-sm font-bold text-on-surface-secondary mb-2">Material de la Tarjeta</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {materials.map(material => (
                            <button
                                key={material.id}
                                onClick={() => setSelectedMaterial(material.id)}
                                className={`p-3 text-sm font-semibold rounded-lg border-2 transition-all ${
                                    selectedMaterial === material.id ? 'border-primary text-primary' : 'border-active-surface text-on-surface-secondary'
                                }`}
                            >
                                {material.name}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="text-sm font-bold text-on-surface-secondary mb-2">Color de Acento</h3>
                    <div className="grid grid-cols-4 gap-4">
                        {accentColors.map(color => (
                            <button
                                key={color.id}
                                onClick={() => setSelectedAccent(color.id)}
                                aria-label={`Color ${color.name}`}
                                className={`w-10 h-10 rounded-full transition-all transform hover:scale-110 ${selectedAccent === color.id ? 'ring-2 ring-offset-2 ring-offset-surface ring-primary' : ''}`}
                                style={{ backgroundColor: color.hex }}
                            />
                        ))}
                    </div>
                </div>

                <div className="mt-6 pt-5 border-t border-active-surface/50 flex justify-end">
                    <button
                        onClick={handleSave}
                        className="w-full px-6 py-2.5 text-sm font-bold text-primary-dark bg-primary rounded-xl hover:opacity-90 flex items-center justify-center gap-2"
                    >
                        <CheckIcon className="w-5 h-5"/>
                        Guardar Cambios
                    </button>
                </div>
            </div>
        </ModalWrapper>
    );
};

export default PersonalizationModal;