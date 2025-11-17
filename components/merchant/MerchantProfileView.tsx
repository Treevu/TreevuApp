import React, { useMemo } from 'react';
import { MerchantUser } from '../../data/merchantData';
import ThemeSwitcher from '../ThemeSwitcher';
import { ArrowLeftIcon, UsersIcon, ShareIcon } from '../Icons';
import { useAlert } from '../../contexts/AlertContext';

const InviteMerchants: React.FC<{ user: MerchantUser }> = ({ user }) => {
    const { setAlert } = useAlert();

    const referralCode = useMemo(() => {
        const namePart = user.name.replace(/\s+/g, '').slice(0, 4).toUpperCase();
        const idPart = user.id.slice(-4).toUpperCase();
        return `PARTNER-${namePart}${idPart}`;
    }, [user]);

    const handleCopy = () => {
        navigator.clipboard.writeText(referralCode).then(() => {
            setAlert({ message: '¡Código de referido copiado!', type: 'success' });
        });
    };

    const handleShare = async () => {
        const shareData = {
            title: 'Únete a la red de comercios de treevü',
            text: `¡Hola! Te invito a unirte a la red de comercios de treevü para conectar con miles de clientes de alto valor. Usa mi código ${referralCode} al registrarte y obtén beneficios de posicionamiento.`,
            url: window.location.href,
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(shareData.text);
                setAlert({ message: 'Enlace de invitación copiado.', type: 'info' });
            }
        } catch (error) {
             if ((error as Error).name !== 'AbortError') {
              setAlert({ message: 'No se pudo compartir la invitación.', type: 'danger' });
            }
        }
    };
    
    return (
        <div className="bg-surface rounded-2xl p-5 border-2 border-dashed border-accent/50 text-center">
            <UsersIcon className="w-10 h-10 text-accent mx-auto mb-2" />
            <h3 className="font-bold text-lg text-on-surface">Invita a otros Comercios y Crece</h3>
            <p className="text-sm text-on-surface-secondary mt-1 max-w-2xl mx-auto">
                Por cada comercio que se una usando tu código, tu negocio ganará <strong className="text-accent">mejor posicionamiento y visibilidad</strong> en la tienda de recompensas para los colaboradores.
            </p>
            <div className="mt-4 flex justify-center">
                <div className="flex items-center gap-2 bg-background p-2 rounded-lg border border-dashed border-active-surface">
                    <span className="font-mono font-bold text-lg text-on-surface">{referralCode}</span>
                    <button onClick={handleCopy} className="bg-active-surface text-on-surface font-bold text-xs px-3 py-1.5 rounded-md hover:bg-background">
                        Copiar
                    </button>
                </div>
            </div>
            <button onClick={handleShare} className="mt-4 bg-accent text-accent-dark font-bold py-2 px-6 rounded-xl flex items-center justify-center gap-2 mx-auto">
                <ShareIcon className="w-5 h-5" />
                Compartir Invitación
            </button>
        </div>
    );
};


interface MerchantProfileViewProps {
    user: MerchantUser;
    onSignOut: () => void;
}

const MerchantProfileView: React.FC<MerchantProfileViewProps> = ({ user, onSignOut }) => {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-surface rounded-2xl p-4">
                <h2 className="text-lg font-bold text-on-surface mb-3">Configuración de Apariencia</h2>
                <ThemeSwitcher />
            </div>

            <InviteMerchants user={user} />
            
            <div className="mt-8">
                <button
                    onClick={onSignOut}
                    className="w-full max-w-sm mx-auto flex items-center justify-center gap-2 text-sm font-semibold bg-danger/10 text-danger hover:bg-danger/20 transition-colors py-3 rounded-xl"
                >
                    <ArrowLeftIcon className="w-5 h-5" />
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
};

export default MerchantProfileView;
