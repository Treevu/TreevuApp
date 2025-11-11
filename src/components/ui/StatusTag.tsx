import React from 'react';
import { ExclamationTriangleIcon } from '@/components/ui/Icons';

interface StatusTagProps {
    children: React.ReactNode;
}

const StatusTag: React.FC<StatusTagProps> = ({ children }) => {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-400/20 px-3 py-1 text-sm font-semibold text-yellow-300">
            <ExclamationTriangleIcon className="h-4 w-4" />
            {children}
        </span>
    );
};

export default StatusTag;