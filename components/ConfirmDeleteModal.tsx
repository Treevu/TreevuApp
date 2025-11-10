import React from 'react';
import { ExclamationTriangleIcon, TrashIcon } from './Icons';
import ModalWrapper from './ModalWrapper';

interface ConfirmDeleteModalProps {
    onClose: () => void;
    onConfirm: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ onClose, onConfirm }) => {
    return (
        <ModalWrapper title="Eliminar Gasto" onClose={onClose}>
            <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-danger/20">
                    <ExclamationTriangleIcon className="h-6 w-6 text-danger" />
                </div>
                <div className="mt-4">
                    <p className="text-sm text-on-surface-secondary">
                        ¿Estás seguro de que quieres eliminar este gasto? Esta acción no se puede deshacer.
                    </p>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2.5 text-sm font-bold text-on-surface bg-active-surface rounded-xl hover:bg-active-surface/70 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="px-6 py-2.5 text-sm font-bold text-white bg-danger rounded-xl hover:bg-red-600 flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-red-500"
                    >
                        <TrashIcon className="w-5 h-5 mr-1.5"/>
                        Sí, eliminar
                    </button>
                </div>
            </div>
        </ModalWrapper>
    );
};

export default ConfirmDeleteModal;
