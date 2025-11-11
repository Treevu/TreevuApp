import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBudget } from '@/contexts/BudgetContext';
import { CheckIcon, ExclamationTriangleIcon, InformationCircleIcon, ArrowLeftIcon, GiftIcon } from '@/components/ui/Icons';
import AuthLayout from '@/components/auth/AuthLayout.tsx';
// FIX: Updated imports from deprecated 'types.ts' to 'types/employer.ts'.
import { Department, Modality, Tenure, AgeRange, DEPARTMENTS, TENURES, MODALITIES, AGE_RANGES } from '@/types/employer';

const inputClasses = "mt-1 block w-full bg-background border border-active-surface rounded-xl p-2 text-lg text-center font-bold text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary";
const selectClasses = "mt-1 block w-full bg-background border border-active-surface rounded-xl p-2 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary";


interface InfoTooltipProps {
    type: 'info' | 'warning';
    children: React.ReactNode;
    isVisible: boolean;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ type, children, isVisible }) => {
    const styles = {
        info: {
            border: 'border-primary',
            iconColor: 'text-primary',
            textColor: 'text-on-surface-secondary',
        },
        warning: {
            border: 'border-yellow-500',
            iconColor: 'text-yellow-400',
            textColor: 'text-yellow-300/90',
        },
    };
    const currentStyle = styles[type];
    const Icon = type === 'info' ? InformationCircleIcon : ExclamationTriangleIcon;

    return (
        <div
            className={`transition-[max-height,margin-top] duration-300 ease-in-out overflow-hidden ${isVisible ? 'max-h-48 mt-2' : 'max-h-0 mt-0'}`}
            aria-hidden={!isVisible}
        >
            <div className={`p-2.5 rounded-md flex items-start space-x-2.5 bg-surface border-l-4 ${currentStyle.border} shadow-lg`}>
                <Icon className={`w-5 h-5 ${currentStyle.iconColor} flex-shrink-0 mt-0.5`} />
                <p className={`text-xs ${currentStyle.textColor} text-left`}>
                    {children}
                </p>
            </div>
        </div>
    );
};

interface ProfileSetupProps {
    onBack: () => void;
}


const ProfileSetup: React.FC<ProfileSetupProps> = ({ onBack }) => {
    const { user, completeProfileSetup } = useAuth();
    const { updateBudget } = useBudget();
    
    const [name, setName] = useState(user?.name || '');
    const [documentId, setDocumentId] = useState('');
    const [department, setDepartment] = useState('');
    const [tenure, setTenure] = useState('');
    const [modality, setModality] = useState('');
    const [ageRange, setAgeRange] = useState('');

    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

    const isNameValid = name.trim().length > 2;
    const isDocIdValid = documentId.length === 8;
    const areDemographicsValid = department && tenure && modality && ageRange;


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!isNameValid || !isDocIdValid || !areDemographicsValid) {
            setError('Por favor, completa todos los campos correctamente.');
            return;
        }

        setIsSubmitting(true);
        
        // This single call now handles updating user details and setting the profile as complete.
        completeProfileSetup({
            name,
            documentId,
            department: department as Department,
            tenure: tenure as Tenure,
            modality: modality as Modality,
            ageRange: ageRange as AgeRange,
        });
        
        // Set a default budget so the user can start using the app.
        // This can be changed later.
        updateBudget(0);
    };

    const isContinueDisabled = !isNameValid || !isDocIdValid || !areDemographicsValid || isSubmitting;
    
    const backToPortalButton = (
         <button
            onClick={onBack}
            className="mt-6 text-on-surface-secondary font-semibold text-sm flex items-center mx-auto"
        >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Volver atrás
        </button>
    );

    return (
        <AuthLayout footer={backToPortalButton}>
            <div className="w-full text-center">
                <h1 className="text-2xl font-bold text-on-surface">Crea tu Perfil</h1>
                <p className="text-on-surface-secondary mt-2 mb-6">
                    Personaliza tu experiencia y empieza a cosechar.
                </p>

                <div className="bg-primary/10 text-primary p-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 mb-8 animate-fade-in">
                    <GiftIcon className="w-5 h-5" />
                    <span>¡Recibirás <strong>50 treevüs</strong> por completar tu perfil!</span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <label className="flex items-center text-sm font-medium text-on-surface-secondary text-left mb-1">
                            <span>Nombre completo</span>
                            <button type="button" onClick={() => setActiveTooltip(activeTooltip === 'name' ? null : 'name')} className="ml-1 text-on-surface-secondary hover:text-on-surface">
                                <InformationCircleIcon className="w-4 h-4" />
                            </button>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ej: Ada Lovelace"
                                className={inputClasses}
                                autoComplete="name"
                            />
                            {isNameValid && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none animate-grow-and-fade-in">
                                    <CheckIcon className="w-6 h-6 text-primary" />
                                </div>
                            )}
                        </div>
                        <InfoTooltip type="info" isVisible={activeTooltip === 'name'}>
                            Tu nombre nos ayuda a personalizar tu experiencia y a que te sientas en control de tu dinero desde el primer día.
                        </InfoTooltip>
                    </div>

                    <div className="relative">
                        <label className="flex items-center text-sm font-medium text-on-surface-secondary text-left mb-1">
                           <span>Documento de Identidad (DNI)</span>
                            <button type="button" onClick={() => setActiveTooltip(activeTooltip === 'docId' ? null : 'docId')} className="ml-1 text-on-surface-secondary hover:text-on-surface">
                                <InformationCircleIcon className="w-4 h-4" />
                            </button>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={documentId}
                                onChange={(e) => setDocumentId(e.target.value.replace(/\D/g, '').slice(0, 8))}
                                placeholder="Tu DNI de 8 dígitos"
                                className={inputClasses}
                                autoComplete="off"
                            />
                            {isDocIdValid && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none animate-grow-and-fade-in">
                                    <CheckIcon className="w-6 h-6 text-primary" />
                                </div>
                            )}
                        </div>
                        <InfoTooltip type="warning" isVisible={activeTooltip === 'docId'}>
                            <strong>Es tu llave maestra.</strong> Tu DNI es crucial para que los gastos formales se vinculen a ti y sumen a tu devolución. ¡Asegúrate de que sea el correcto!
                        </InfoTooltip>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-on-surface-secondary text-left mb-1">Área</label>
                            <select value={department} onChange={e => setDepartment(e.target.value)} className={selectClasses}>
                                <option value="" disabled>Selecciona...</option>
                                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-on-surface-secondary text-left mb-1">Antigüedad</label>
                            <select value={tenure} onChange={e => setTenure(e.target.value)} className={selectClasses}>
                                <option value="" disabled>Selecciona...</option>
                                {TENURES.map(t => (
                                    <option key={t} value={t}>
                                        {t === '< 1 año' ? 'Menos de 1 año' : t === '> 5 años' ? 'Más de 5 años' : '1 a 5 años'}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-on-surface-secondary text-left mb-1">Modalidad</label>
                            <select value={modality} onChange={e => setModality(e.target.value)} className={selectClasses}>
                                <option value="" disabled>Selecciona...</option>
                                {MODALITIES.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-on-surface-secondary text-left mb-1">Rango de Edad</label>
                            <select value={ageRange} onChange={e => setAgeRange(e.target.value)} className={selectClasses}>
                                <option value="" disabled>Selecciona...</option>
                                {AGE_RANGES.map(ar => <option key={ar} value={ar}>{`${ar} años`}</option>)}
                            </select>
                        </div>
                    </div>
                    
                    {error && <p role="alert" className="text-danger text-sm">{error}</p>}
                    
                    <button
                        type="submit"
                        disabled={isContinueDisabled}
                        className="w-full bg-primary text-primary-dark font-bold py-3 px-6 rounded-xl text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary/20 !mt-8"
                    >
                        {isSubmitting ? 'Guardando...' : isContinueDisabled ? 'Completa tus datos' : '¡Empecemos!'}
                    </button>
                </form>
            </div>
        </AuthLayout>
    );
};

export default ProfileSetup;