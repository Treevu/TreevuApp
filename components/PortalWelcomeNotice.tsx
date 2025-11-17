import React from 'react';

interface PortalWelcomeNoticeProps {
    onClose: () => void;
    icon: React.ReactNode;
    title: string;
    cta: string;
    children: React.ReactNode;
    platform?: 'business' | 'merchant'; // Optional, defaults to 'people' theme
}

const PortalWelcomeNotice: React.FC<PortalWelcomeNoticeProps> = ({ onClose, icon, title, cta, children, platform }) => {
    
    const themeClass = platform === 'business' ? 'theme-business' : platform === 'merchant' ? 'theme-merchant' : '';

    return (
        <div 
            className={`fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-end sm:items-center z-50 p-4 animate-fade-in ${themeClass}`}
            onClick={onClose}
        >
            <div 
                className="bg-background rounded-3xl shadow-2xl w-full max-w-sm flex flex-col animate-grow-and-fade-in"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="portal-notice-title"
                style={{ animationDuration: '0.3s' }}
            >
                 <div className="p-6 sm:p-8">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            {icon}
                        </div>
                         <h2 id="portal-notice-title" className="text-3xl font-bold text-on-surface mt-4">{title}</h2>
                        <div className="mt-4 text-left">
                             {children}
                        </div>
                        <div className="mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full px-6 py-3 text-base font-bold text-primary-dark bg-gradient-to-br from-primary to-accent rounded-xl hover:opacity-90 shadow-lg shadow-primary/30 transition-all transform hover:scale-105"
                            >
                                {cta}
                            </button>
                        </div>
                    </div>
                 </div>
            </div>
        </div>
    );
};

export default PortalWelcomeNotice;