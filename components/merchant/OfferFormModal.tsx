
import React, { useState, useEffect } from 'react';
import { Offer } from '../../data/merchantData';
import { CheckIcon } from '../Icons';
import ModalWrapper from '../ModalWrapper';

interface OfferFormModalProps {
    onClose: () => void;
    onSave: (offerData: Omit<Offer, 'id' | 'views' | 'redemptions' | 'merchantId'>, editingId?: string) => void;
    offerToEdit?: Offer;
}

const inputClasses = "block w-full bg-background border border-active-surface rounded-xl p-2.5 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary";

const OfferFormModal: React.FC<OfferFormModalProps> = ({ onClose, onSave, offerToEdit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<'Café y Postres' | 'Libros y Cultura'>('Café y Postres');
    const [discountDetails, setDiscountDetails] = useState('');
    const [conditions, setConditions] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (offerToEdit) {
            setTitle(offerToEdit.title);
            setDescription(offerToEdit.description);
            setCategory(offerToEdit.category);
            setDiscountDetails(offerToEdit.discountDetails);
            setConditions(offerToEdit.conditions);
        }
    }, [offerToEdit]);

    const handleSubmit = () => {
        setError('');
        if (!title.trim() || !discountDetails.trim() || !description.trim()) {
            setError('Los campos Título, Descripción y Detalles del Descuento son obligatorios.');
            return;
        }

        onSave({
            title,
            description,
            category,
            discountDetails,
            conditions,
        }, offerToEdit?.id);
    };
    
    const modalTitle = offerToEdit ? 'Editar Oferta' : 'Crear Nueva Oferta';

    return (
        <ModalWrapper title={modalTitle} onClose={onClose}>
            <div className="space-y-4 -mt-4">
                {error && <p className="text-danger bg-danger/20 p-2 rounded-md text-sm text-center">{error}</p>}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-on-surface-secondary mb-1">Título de la Oferta</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: 2x1 en Cappuccinos" className={inputClasses} />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-on-surface-secondary mb-1">Categoría</label>
                        <select value={category} onChange={e => setCategory(e.target.value as any)} className={inputClasses}>
                            <option value="Café y Postres">Café y Postres</option>
                            <option value="Libros y Cultura">Libros y Cultura</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-on-surface-secondary mb-1">Detalle del Descuento</label>
                    <input type="text" value={discountDetails} onChange={(e) => setDiscountDetails(e.target.value)} placeholder="Ej: 20% OFF, 2x1, S/ 10 de dscto." className={inputClasses} />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-on-surface-secondary mb-1">Descripción Corta</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe brevemente la oferta para atraer clientes." className={`${inputClasses} min-h-[60px]`} rows={2} />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-on-surface-secondary mb-1">Términos y Condiciones</label>
                    <textarea value={conditions} onChange={(e) => setConditions(e.target.value)} placeholder="Ej: Válido de Lunes a Viernes. No acumulable." className={`${inputClasses} min-h-[60px]`} rows={2} />
                </div>
                 
                 <div className="pt-4 border-t border-active-surface/50 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-on-surface bg-active-surface rounded-xl hover:bg-active-surface/70">
                        Cancelar
                    </button>
                    <button onClick={handleSubmit} className="px-6 py-2 text-sm font-bold text-primary-dark bg-primary rounded-xl hover:opacity-90 flex items-center">
                        <CheckIcon className="w-5 h-5 mr-1.5"/>
                        {offerToEdit ? 'Guardar Cambios' : 'Publicar Oferta'}
                    </button>
                </div>
            </div>
        </ModalWrapper>
    );
};

export default OfferFormModal;