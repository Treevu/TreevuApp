import React from 'react';
import { InformationCircleIcon } from '../Icons';

const PrivacyDisclaimer: React.FC = () => {
    return (
        <div className="mt-8 max-w-3xl mx-auto p-3 bg-surface rounded-lg flex items-start space-x-3 border border-active-surface/50">
            <InformationCircleIcon className="w-5 h-5 text-on-surface-secondary flex-shrink-0 mt-0.5" />
            <p className="text-xs text-on-surface-secondary">
                <strong>Nota de Privacidad:</strong> Todos los datos mostrados en este dashboard son agregados y 100% anónimos para proteger la privacidad de nuestro equipo. No es posible visualizar gastos individuales.
            </p>
        </div>
    );
};

export default PrivacyDisclaimer;
