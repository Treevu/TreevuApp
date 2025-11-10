import React, { useEffect, useRef } from 'react';
import { XMarkIcon } from './Icons';

interface ModalWrapperProps {
    onClose: () => void;
    children: React.ReactNode;
    title: React.ReactNode;
    titleId?: string;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({ onClose, children, title, titleId = 'modal-title' }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    // Handle closing on 'Escape' key press
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // Handle focus trapping
    useEffect(() => {
        const modalElement = modalRef.current;
        if (!modalElement) return;

        const focusableElements = modalElement.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // Move focus to the first focusable element when the modal opens
        firstElement.focus();

        const handleTabKeyPress = (event: KeyboardEvent) => {
            if (event.key !== 'Tab') return;

            if (event.shiftKey) { // Shift + Tab
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    event.preventDefault();
                }
            } else { // Tab
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    event.preventDefault();
                }
            }
        };

        modalElement.addEventListener('keydown', handleTabKeyPress);
        return () => modalElement.removeEventListener('keydown', handleTabKeyPress);
    }, []);

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-end sm:items-center z-50 p-0 sm:p-4 animate-fade-in" 
            onClick={onClose}
        >
            <div 
                ref={modalRef}
                className="bg-surface rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-sm max-h-[90vh] flex flex-col animate-grow-and-fade-in"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                style={{ animationDuration: '0.3s' }}
            >
                <div className="p-5 border-b border-active-surface/50 flex justify-between items-center flex-shrink-0">
                    <h2 id={titleId} className="text-xl font-bold text-on-surface">{title}</h2>
                    <button ref={closeButtonRef} onClick={onClose} className="text-on-surface-secondary hover:text-on-surface rounded-full focus:outline-none focus:ring-2 focus:ring-primary">
                        <span className="sr-only">Cerrar modal</span>
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-5 overflow-y-auto custom-scrollbar flex-grow">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default ModalWrapper;