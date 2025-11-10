import React from 'react';
import Logo from './Logo';

interface LoadingViewProps {
    text: string;
}

const LoadingView: React.FC<LoadingViewProps> = ({ text }) => {
    return (
        <div className="flex flex-col items-center justify-center py-12" role="status" aria-live="polite">
            <div className="relative w-24 h-24">
                {/* The static background track */}
                <div className="absolute w-full h-full border-8 border-active-surface rounded-full"></div>
                
                {/* The spinning part - a single border segment */}
                <div className="absolute w-full h-full border-8 border-t-primary border-transparent rounded-full animate-spin"></div>
                
                {/* The logo in the center */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <Logo className="w-10 h-10 text-primary" />
                </div>
            </div>
            <p className="mt-6 font-semibold text-lg text-on-surface-secondary">{text}</p>
        </div>
    );
};

export default LoadingView;