import React from 'react';
import { ShieldCheckIcon, LockClosedIcon } from './Icons';
import Logo from './Logo';
import { useAuth } from '../contexts/AuthContext';

const EthicalPromise: React.FC = () => {
    const { acceptEthicalPromise } = useAuth();

    return (
        <div className="min-h-screen bg-background flex flex-col items-center p-4 text-on-surface animate-fade-in">
            <main className="w-full max-w-md text-center flex-grow flex flex-col justify-center">
                <div className="bg-surface/80 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/10">
                    <ShieldCheckIcon className="w-16 h-16 text-primary mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-on-surface leading-tight">
                        El Juramento del Guardián
                    </h1>
                    <p className="mt-4 text-on-surface-secondary">
                       Estás a punto de iniciar una expedición donde cada pequeño hábito cultiva un gran tesoro. Tu confianza es nuestra brújula.
                    </p>
                    <ul className="mt-4 text-left text-sm text-on-surface-secondary space-y-2 list-disc list-inside bg-background p-3 rounded-xl">
                        <li>Nos comprometemos a que tus datos de gastos personales son y siempre serán <strong className="font-semibold text-on-surface">100% anónimos y privados</strong>.</li>
                        <li>Tu empleador solo ve <strong className="font-semibold text-on-surface">estadísticas agregadas</strong> para tomar mejores decisiones de bienestar para el equipo.</li>
                        <li>Tu información es la tierra fértil para <strong className="font-semibold text-on-surface">tus propios insights</strong> y para el crecimiento de esta plataforma.</li>
                    </ul>
                    <p className="mt-4 text-xs text-on-surface-secondary">
                        Al continuar, aceptas este juramento. Tu privacidad es sagrada en este bosque.
                    </p>
                    <button
                        onClick={acceptEthicalPromise}
                        className="w-full mt-6 bg-gradient-to-r from-accent to-accent-secondary text-primary-dark font-bold py-3 px-6 rounded-xl text-lg transition-all duration-300 hover:shadow-lg hover:shadow-accent/20"
                    >
                        Aceptar el Juramento
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