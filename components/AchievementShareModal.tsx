import React, { useRef, useEffect, useCallback, useState } from 'react';
import ModalWrapper from './ModalWrapper';
import { ShareIcon, CheckBadgeIcon } from './Icons';
import Logo from './Logo';
import TreevuLogoText from './TreevuLogoText';

export interface AchievementShareModalProps {
    onClose: () => void;
    title: string;
    subtitle: string;
    userName: string;
    userPicture: string;
}

const AchievementShareModal: React.FC<AchievementShareModalProps> = ({ onClose, title, subtitle, userName, userPicture }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isSharing, setIsSharing] = useState(false);
    const [shareError, setShareError] = useState('');

    const drawCard = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx || !canvas) return;

        const width = 500;
        const height = 280;
        canvas.width = width * 2;
        canvas.height = height * 2;
        ctx.scale(2, 2);

        // Background
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#1E293B');
        gradient.addColorStop(1, '#0F172A');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Title
        ctx.fillStyle = '#4ADE80'; // text-primary
        ctx.font = 'bold 24px Poppins';
        ctx.textAlign = 'center';
        ctx.fillText(title, width / 2, 60);

        // Subtitle
        ctx.fillStyle = '#F1F5F9'; // text-on-surface
        ctx.font = '600 18px Poppins';
        ctx.fillText(subtitle, width / 2, 100);

        // User Info
        ctx.beginPath();
        ctx.arc(width / 2, 160, 35, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        const userImg = new Image();
        userImg.crossOrigin = "anonymous";
        userImg.onload = () => {
            ctx.drawImage(userImg, (width / 2) - 35, 125, 70, 70);
            ctx.restore(); // Restore context after clipping
            
            // User Name
            ctx.fillStyle = '#F1F5F9';
            ctx.font = 'bold 20px Poppins';
            ctx.fillText(userName, width / 2, 220);
        };
        userImg.src = userPicture;
        
    }, [title, subtitle, userName, userPicture]);
    
    useEffect(() => {
        drawCard();
    }, [drawCard]);

    const handleShare = async () => {
        setShareError('');
        setIsSharing(true);
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.toBlob(async (blob) => {
            if (!blob) {
                setShareError('No se pudo generar la imagen para compartir.');
                setIsSharing(false);
                return;
            }

            try {
                const file = new File([blob], 'logro-treevu.png', { type: 'image/png' });
                if (navigator.share) {
                    await navigator.share({
                        title: '¡Nuevo logro en treevü!',
                        text: `¡Alcancé un nuevo logro en mi aventura financiera con treevü!`,
                        files: [file],
                    });
                } else {
                    // Fallback for browsers that don't support navigator.share with files
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = 'logro-treevu.png';
                    link.click();
                }
            } catch (error) {
                console.error('Error sharing:', error);
                if ((error as Error).name !== 'AbortError') {
                   setShareError('No se pudo compartir la imagen. Puedes intentar de nuevo.');
                }
            } finally {
                setIsSharing(false);
            }
        }, 'image/png');
    };

    return (
        <ModalWrapper title="¡Logro Desbloqueado!" onClose={onClose}>
            <div className="text-center -mt-4">
                <CheckBadgeIcon className="w-20 h-20 text-primary mx-auto animate-grow-and-fade-in" />
                <h3 className="text-xl font-bold text-on-surface mt-2">{title}</h3>
                <p className="text-on-surface-secondary">{subtitle}</p>

                <div className="mt-4 p-3 bg-background rounded-xl">
                    <p className="text-sm text-on-surface-secondary">¡Comparte tu progreso con tu equipo y amigos!</p>
                </div>
                
                {shareError && <p className="text-danger text-sm mt-2">{shareError}</p>}

                <div className="mt-6 pt-5 border-t border-active-surface/50 flex flex-col gap-3">
                    <button
                        onClick={handleShare}
                        disabled={isSharing}
                        className="w-full bg-primary text-primary-dark font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-opacity disabled:opacity-50"
                    >
                        {isSharing ? 'Compartiendo...' : <> <ShareIcon className="w-5 h-5" /> Compartir Logro </> }
                    </button>
                    <button onClick={onClose} className="w-full bg-active-surface text-on-surface font-bold py-2.5 rounded-xl">
                        Cerrar
                    </button>
                </div>
                 {/* Hidden canvas for rendering the image */}
                <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
            </div>
        </ModalWrapper>
    );
};

export default AchievementShareModal;
