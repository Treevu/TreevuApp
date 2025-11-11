import React from 'react';
import Logo from '@/components/ui/Logo';

const Spinner: React.FC = () => {
    return (
        <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="absolute w-full h-full border-4 border-active-surface rounded-full"></div>
            <div className="absolute w-full h-full border-4 border-t-primary border-transparent rounded-full animate-spin"></div>
            <Logo className="w-8 h-8 text-primary animate-logo-pulse" />
        </div>
    );
};

export default Spinner;
