import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';

type AlertState = {
    message: string;
    type: 'info' | 'warning' | 'danger' | 'success';
    action?: {
        text: string;
        onClick: () => void;
    };
} | null;

interface AlertContextType {
    alert: AlertState;
    setAlert: React.Dispatch<React.SetStateAction<AlertState>>;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [alert, setAlert] = useState<AlertState>(null);

    const value = useMemo(() => ({ alert, setAlert }), [alert]);

    return (
        <AlertContext.Provider value={value}>
            {children}
        </AlertContext.Provider>
    );
};

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (context === undefined) {
        throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
};
