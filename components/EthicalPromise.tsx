
import React from 'react';
import { ShieldCheckIcon } from './Icons';
import Logo from './Logo';

interface EthicalPromiseProps {
    onAccept: () => void;
}

const EthicalPromise: React.FC<EthicalPromiseProps> = ({ onAccept }) => {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center p-4 text-on-surface animate-fade-in">
            <main className="w-full max-w-md text-center flex-grow flex flex-col justify-center">
                <div className="bg-surface rounded-3xl shadow-2xl p-6 sm:p-8">
                    <ShieldCheckIcon className="w-16 h-16 text-primary mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-on-surface leading-tight">
                        Tu Confianza
                        <span className="block">es Nuestra Prioridad</span>
                    </h1>
                    <p className="mt-4 text-on-surface-secondary">
                        En treevü, tu privacidad es sagrada. Nos comprometemos a que tus datos de gastos personales son y siempre serán <strong className="font-semibold text-on-surface">100% anónimos y privados</strong>.
                    </p>
                    <ul className="mt-4 text-left text-sm text-on-surface-secondary space-y-2 list-disc list-inside bg-background p-3 rounded-xl">
                        <li><strong className="font-semibold text-on-surface">Nunca compartiremos</strong> tus datos individuales con tu empleador.</li>
                        <li>Tu empleador solo ve <strong className="font-semibold text-on-surface">estadísticas agregadas y anónimas</strong> del <strong className="font-semibold text-on-surface">equipo</strong> (ej. "número de premios canjeados").</li>
                        <li>Tus datos se usan para darte <strong className="font-semibold text-on-surface">insights personalizados solo para ti</strong> y para mejorar la plataforma.</li>
                    </ul>
                    <p className="mt-4 text-xs text-on-surface-secondary">
                        Al continuar, confías en nuestro compromiso de proteger tu información.
                    </p>
                    <button
                        onClick={onAccept}
                        className="w-full mt-6 bg-primary text-primary-dark font-bold py-3 px-6 rounded-xl text-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                    >
                        Entiendo y acepto
                    </button>
                </div>
            </main>
             <footer className="pt-8 text-center text-sm text-on-surface-secondary">
                <p>&copy; {new Date().getFullYear()} Sinapsis Innovadora S.A.C.</p>
                <p className="mt-1 italic">Powered by Gemini</p>
            </footer>
        </div>
    );
};

export default EthicalPromise;
