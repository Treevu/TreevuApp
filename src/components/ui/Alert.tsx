import React, { useEffect } from 'react';
import { ExclamationTriangleIcon, XMarkIcon, InformationCircleIcon, SparklesIcon } from '@/components/ui/Icons';

interface AlertProps {
    message: string;
    type: 'info' | 'warning' | 'danger' | 'success';
    autoDismiss: boolean,
    dismissTimer?: number,
    onDismiss: () => void;
    action?: {
        text: string;
        onClick: () => void;
    };
}

const alertStyles = {
    info: {
        border: 'border-accent',
        icon: 'text-accent',
        shadow: 'shadow-accent/20',
        buttonHover: 'hover:bg-active-surface/50'
    },
    warning: {
        border: 'border-warning',
        icon: 'text-warning',
        shadow: 'shadow-warning/20',
        buttonHover: 'hover:bg-active-surface/50'
    },
    danger: {
        border: 'border-danger',
        icon: 'text-danger',
        shadow: 'shadow-danger/20',
        buttonHover: 'hover:bg-active-surface/50'
    },
    success: {
        border: 'border-accent',
        icon: 'text-accent',
        shadow: 'shadow-accent/30',
        buttonHover: 'hover:bg-active-surface/50'
    },
};

const Alert: React.FC<AlertProps> = ({ message, type, onDismiss, action, autoDismiss, dismissTimer=5000 }) => {
    const styles = alertStyles[type];
    const Icon = type === 'success' ? SparklesIcon : type === 'info' ? InformationCircleIcon : ExclamationTriangleIcon;

    useEffect(() => {
        if(autoDismiss){
            const timer = setTimeout(() => {
                onDismiss();
            }, dismissTimer);
            return () => clearTimeout(timer);
        }
    }, [onDismiss]);

    return (
        <div role="alert" className={`sticky border-l-4 ${styles.border} bg-surface p-4 rounded-md flex items-start animate-grow-and-fade-in shadow-lg ${styles.shadow} z-[1000]`}>
            <div className="flex-shrink-0">
                <Icon className={`w-6 h-6 ${styles.icon}`} />
            </div>
            <div className="ml-3">
                <div className={`text-sm text-on-surface`}>
                    <span dangerouslySetInnerHTML={{ __html: message }} />
                    {action && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                action.onClick();
                            }}
                            className="ml-2 font-bold text-primary hover:underline focus:outline-none"
                        >
                            {action.text}
                        </button>
                    )}
                </div>
            </div>
            <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                    <button
                        onClick={onDismiss}
                        className={`inline-flex rounded-md p-1.5 text-on-surface-secondary ${styles.buttonHover} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background`}
                    >
                        <span className="sr-only">Descartar</span>
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Alert;
