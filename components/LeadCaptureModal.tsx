import React, { useState } from 'react';
import ModalWrapper from './ModalWrapper';
import { CheckIcon, PaperAirplaneIcon, ArrowTopRightOnSquareIcon } from './Icons';

interface LeadCaptureModalProps {
    onClose: () => void;
    type: 'people' | 'business' | 'merchants';
}

const freeEmailDomains = [
  'gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com', 'aol.com', 'icloud.com', 'live.com', 'msn.com',
  'protonmail.com', 'gmx.com', 'zoho.com'
];

const isCorporateEmail = (email: string): boolean => {
  if (!email.includes('@')) return false;
  const domain = email.split('@')[1];
  return !freeEmailDomains.includes(domain.toLowerCase());
};

const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({ onClose, type }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [step, setStep] = useState<'form' | 'success'>('form');

    const requiresCorporateEmail = type === 'business' || type === 'merchants';

    const titleMap = {
        people: 'Demo para Personas',
        business: 'Solicitar Demo para Empresas',
        merchants: 'Demo para Comercios'
    };
    const modalTitle = titleMap[type];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!name.trim() || !email.trim()) {
            setError('Por favor, completa todos los campos.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Por favor, ingresa un correo electrónico válido.');
            return;
        }
        
        if (requiresCorporateEmail && !isCorporateEmail(email)) {
            setError('Por favor, utiliza un correo corporativo para esta demo.');
            return;
        }
        
        // Here you would typically send the data to a backend/CRM
        console.log({ type, name, email });

        setStep('success');
    };
    
    if (step === 'success') {
        return (
            <ModalWrapper title="¡Solicitud Enviada!" onClose={onClose}>
                <div className="text-center -mt-4">
                    <CheckIcon className="w-16 h-16 text-primary mx-auto animate-grow-and-fade-in bg-primary/10 rounded-full p-2" />
                    <h3 className="text-xl font-bold text-on-surface mt-4">¡Gracias por tu interés!</h3>
                    <p className="text-on-surface-secondary mt-2">
                        Nuestro equipo te contactará pronto. Mientras tanto, ¿te gustaría ser de los primeros en probar nuestras nuevas funcionalidades?
                    </p>
                    <div className="mt-6 flex flex-col gap-3">
                        <a
                            href="https://tally.so/r/81ojAA"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={onClose}
                            className="w-full bg-gradient-to-r from-accent to-accent-secondary text-primary-dark font-bold py-2.5 rounded-xl hover:opacity-90 flex items-center justify-center gap-2"
                        >
                            <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                            Unirme al Piloto
                        </a>
                        <button
                            onClick={onClose}
                            className="w-full bg-active-surface text-on-surface font-bold py-2.5 rounded-xl hover:bg-background"
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            </ModalWrapper>
        )
    }

    return (
        <ModalWrapper title={modalTitle} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4 -mt-4">
                <p className="text-sm text-center text-on-surface-secondary">
                    Déjanos tus datos y nos pondremos en contacto para agendar una demostración personalizada.
                </p>
                
                {error && <p className="text-danger bg-danger/20 p-2 rounded-md text-sm text-center">{error}</p>}
                
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-on-surface-secondary mb-1">Nombre Completo</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Ej: Alex Quispe"
                        className="block w-full rounded-xl border border-active-surface bg-background p-2.5 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-on-surface-secondary mb-1">
                        {requiresCorporateEmail ? 'Email Corporativo' : 'Email de Contacto'}
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder={requiresCorporateEmail ? "ej: alex.quispe@empresa.com" : "ej: alex.quispe@email.com"}
                        className="block w-full rounded-xl border border-active-surface bg-background p-2.5 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                </div>
                
                <div className="pt-2">
                    <p className="text-xs text-on-surface-secondary text-center">
                        Al hacer clic en "Solicitar Demo", aceptas nuestra política de privacidad y el tratamiento de tus datos para contactarte.
                    </p>
                </div>
                
                <div className="pt-2 flex justify-end">
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-accent to-accent-secondary text-primary-dark font-bold py-2.5 rounded-xl hover:opacity-90 flex items-center justify-center gap-2"
                    >
                        <PaperAirplaneIcon className="w-5 h-5"/>
                        Solicitar Demo
                    </button>
                </div>
            </form>
        </ModalWrapper>
    );
};

export default LeadCaptureModal;