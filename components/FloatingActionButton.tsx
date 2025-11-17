import React from 'react';
import { useModal } from '../contexts/ModalContext';
import { CameraIcon, DocumentArrowUpIcon, PencilSquareIcon, ReceiptPercentIcon } from './Icons';

interface FloatingActionButtonProps {
    isOpen: boolean;
    onClose: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ isOpen, onClose }) => {
    const { openModal } = useModal();

    const handleActionClick = (action: 'camera' | 'file' | 'manual' | 'divert') => {
        openModal('addExpense', { initialAction: action });
        onClose(); // Close menu after action
    };

    const menuItems = [
        { icon: ReceiptPercentIcon, label: 'Desviar Gasto', action: () => handleActionClick('divert') },
        { icon: PencilSquareIcon, label: 'Registro Manual', action: () => handleActionClick('manual') },
        { icon: DocumentArrowUpIcon, label: 'Subir Archivo', action: () => handleActionClick('file') },
        { icon: CameraIcon, label: 'Captura Gasto', action: () => handleActionClick('camera') },
    ];


    return (
        <>
            {/* Backdrop */}
            {isOpen && <div className="fixed inset-0 bg-black/40 z-30" onClick={onClose} aria-hidden="true" />}

            <div className="fixed bottom-[88px] left-1/2 -translate-x-1/2 z-40" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
                {/* Menu items that unfold upwards */}
                <div className={`flex flex-col-reverse items-center gap-y-4 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    {menuItems.map((item, index) => (
                        <button
                            key={item.label}
                            onClick={item.action}
                            className="flex items-center gap-3 bg-surface rounded-full shadow-lg h-12 px-4 transition-transform duration-300 ease-in-out"
                            style={{ transform: isOpen ? 'translateY(0)' : 'translateY(20px)', transitionDelay: isOpen ? `${index * 40}ms` : '0ms' }}
                            aria-label={item.label}
                        >
                            <span className="font-bold text-on-surface text-sm whitespace-nowrap">{item.label}</span>
                            <item.icon className="w-6 h-6 text-primary" />
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
};

export default FloatingActionButton;