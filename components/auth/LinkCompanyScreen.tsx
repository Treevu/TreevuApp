import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { BuildingOffice2Icon, CheckIcon } from '../Icons';
import Logo from '../Logo';
import TreevuLogoText from '../TreevuLogoText';
import { useModal } from '../../contexts/ModalContext';

const LinkCompanyScreen: React.FC = () => {
    const { linkCompany, skipCompanyLink } = useAuth();
    const { openModal } = useModal();
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showSuggestion, setShowSuggestion] = useState(false);
    const isEmail = useMemo(() => code.includes('@') && code.split('@')[1]?.includes('.'), [code]);

    const handleLink = async (value: string) => {
        setIsLoading(true);
        setError('');
        setSuccess('');
        setShowSuggestion(false);

        try {
            const company = await linkCompany(value);
            setSuccess(`¡Vinculación exitosa con ${company.name}!`);
            // The context change will trigger navigation
        } catch (err: any) {
            setError(err.message || 'Ocurrió un error al vincular.');
            setShowSuggestion(true); // Show suggestion button on error
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!code.trim()) {
            setError('Por favor, ingresa un código o email.');
            return;
        }
        handleLink(code);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-on-surface animate-fade-in">
            <main className="w-full max-w-sm">
                <div className="text-center mb-8">
                     <Logo className="w-16 h-16 text-primary mx-auto mb-2" />
                    <h1 className="text-2xl font-bold text-on-surface">
                        Activa tu Experiencia Corporativa
                    </h1>
                    <p className="mt-2 text-on-surface-secondary">
                        Si tu empresa es aliada de <TreevuLogoText />, vincula tu cuenta para desbloquear beneficios.
                    </p>
                </div>
                
                <div className="bg-surface/80 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/10">
                    <form onSubmit={handleSubmit} className="space-y-4">
                         <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <BuildingOffice2Icon className="h-5 w-5 text-on-surface-secondary" />
                            </div>
                            <input
                                type="text"
                                value={code}
                                onChange={e => setCode(e.target.value)}
                                placeholder="Email corporativo o código"
                                disabled={isLoading || !!success}
                                className="block w-full rounded-xl border border-active-surface bg-background py-3 pl-10 pr-3 text-on-surface placeholder:text-on-surface-secondary focus:border-primary focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary"
                            />
                        </div>

                        {error && <p className="text-danger text-sm text-center">{error}</p>}
                        {success && <p className="text-primary font-bold text-sm text-center flex items-center justify-center gap-2"><CheckIcon className="w-5 h-5"/> {success}</p>}

                        {showSuggestion && (
                            <div className="text-center animate-fade-in">
                                 <button
                                    type="button"
                                    onClick={() => openModal('leadCapture', { type: 'business' })}
                                    className="text-sm font-bold text-primary hover:underline"
                                >
                                    ¿Tu empresa no está? Sugiérela aquí
                                </button>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || !code.trim() || !!success}
                            className="w-full bg-gradient-to-r from-accent to-accent-secondary text-primary-dark font-bold py-3 px-6 rounded-xl text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-wait hover:shadow-lg hover:shadow-accent/20 !mt-6"
                        >
                             {isLoading ? (
                                <div className="w-6 h-6 border-2 border-t-primary-dark border-background rounded-full animate-spin mx-auto"></div>
                            ) : 'Vincular Cuenta'}
                        </button>
                    </form>

                     <div className="relative flex py-5 items-center">
                        <div className="flex-grow border-t border-active-surface"></div>
                        <span className="flex-shrink mx-4 text-xs text-on-surface-secondary">O</span>
                        <div className="flex-grow border-t border-active-surface"></div>
                    </div>

                    <button
                        onClick={skipCompanyLink}
                        disabled={isLoading || !!success}
                        className="w-full bg-active-surface text-on-surface font-bold py-3 px-6 rounded-xl text-lg transition-colors hover:bg-background disabled:opacity-50"
                    >
                        Omitir por ahora
                    </button>

                </div>
            </main>
        </div>
    );
};

export default LinkCompanyScreen;