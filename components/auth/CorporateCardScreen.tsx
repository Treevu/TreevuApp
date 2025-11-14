import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AuthLayout from './AuthLayout';
import { CreditCardIcon, CheckIcon } from '../Icons';
import TreevuLogoText from '../TreevuLogoText';

const CorporateCardScreen: React.FC = () => {
    const { updateUser } = useAuth();
    const [isLoading, setIsLoading] = useState<boolean | null>(null);

    const handleSelection = (hasCard: boolean) => {
        setIsLoading(hasCard); // Show loading only on the selected button
        // A slight delay to show feedback to the user before the screen changes
        setTimeout(() => {
            updateUser({ hasCorporateCard: hasCard });
        }, 500);
    };

    return (
        <AuthLayout>
            <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCardIcon className="w-9 h-9 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-on-surface">
                    ¿Usas una Tarjeta Corporativa?
                </h1>
                <p className="mt-2 text-on-surface-secondary">
                    Si tu empresa te da una tarjeta para gastos, <TreevuLogoText /> te ayudará a registrarlos y gestionarlos fácilmente.
                </p>

                <div className="mt-8 space-y-4">
                    <button
                        onClick={() => handleSelection(true)}
                        disabled={isLoading !== null}
                        className="w-full bg-primary text-primary-dark font-bold py-4 px-6 rounded-xl text-lg transition-all duration-300 disabled:opacity-50 hover:shadow-lg hover:shadow-primary/20 flex items-center justify-center"
                    >
                        {isLoading === true ? (
                            <div className="w-6 h-6 border-2 border-t-primary-dark border-background rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <CheckIcon className="w-6 h-6 mr-2" />
                                Sí, tengo una
                            </>
                        )}
                    </button>
                    <button
                        onClick={() => handleSelection(false)}
                        disabled={isLoading !== null}
                        className="w-full bg-active-surface text-on-surface font-bold py-4 px-6 rounded-xl text-lg transition-colors hover:bg-background disabled:opacity-50"
                    >
                        {isLoading === false ? (
                           <div className="w-6 h-6 border-2 border-t-on-surface border-active-surface rounded-full animate-spin"></div>
                        ) : (
                            'No, no tengo'
                        )}
                    </button>
                </div>
                <p className="text-xs text-on-surface-secondary mt-6">
                    Esto nos ayuda a personalizar tu dashboard. Podrás cambiarlo más adelante.
                </p>
            </div>
        </AuthLayout>
    );
};

export default CorporateCardScreen;