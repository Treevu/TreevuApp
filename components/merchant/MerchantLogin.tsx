
import React from 'react';
import { ArrowLeftIcon, BuildingStorefrontIcon } from '../Icons';
import AuthLayout from '../auth/AuthLayout';
import TreevuLogoText from '../TreevuLogoText';
import { MOCK_MERCHANTS, MerchantUser } from '../../data/merchantData';

interface MerchantLoginProps {
    onLoginSuccess: (user: MerchantUser) => void;
    onBack: () => void;
}

const MerchantLogin: React.FC<MerchantLoginProps> = ({ onLoginSuccess, onBack }) => {

    const title = (
        <>
            <TreevuLogoText />
            <span className="block text-xl font-semibold text-primary -mt-2 tracking-wide italic">for merchants</span>
        </>
    );

    const backButton = (
        <button
            onClick={onBack}
            className="text-on-surface-secondary font-semibold text-sm flex items-center mx-auto"
        >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Volver atrás
        </button>
    );
    
    return (
        <AuthLayout footer={backButton}>
            <div className="text-center">
                <h1 className="text-4xl font-black text-on-surface treevu-text mb-2">{title}</h1>
                <p className="text-on-surface-secondary">La plataforma para convertir a los mejores colaboradores de empresas top en tus clientes más leales.</p>
            </div>
            
            <div className="mt-8 w-full space-y-4">
                <p className="text-center font-semibold text-on-surface-secondary">Selecciona un comercio para ingresar:</p>
                
                {MOCK_MERCHANTS.map((merchant) => (
                    <button
                        key={merchant.id}
                        onClick={() => onLoginSuccess(merchant)}
                        className="w-full p-4 bg-surface rounded-xl border border-active-surface/50 text-left flex items-center gap-4 transform hover:scale-105 hover:bg-active-surface transition-all duration-300"
                    >
                        <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                            <BuildingStorefrontIcon className="w-6 h-6 text-blue-500"/>
                        </div>
                        <div>
                            <h3 className="font-bold text-on-surface">{merchant.name}</h3>
                            <p className="text-xs text-on-surface-secondary">{merchant.category}</p>
                        </div>
                    </button>
                ))}
            </div>
        </AuthLayout>
    );
};

export default MerchantLogin;