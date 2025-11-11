import React, { createContext, useState, useContext, useEffect, useMemo, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        // 1. Check localStorage for a saved theme
        const savedTheme = localStorage.getItem('treevu-theme') as Theme | null;
        if (savedTheme) {
            return savedTheme;
        }
        // 2. If no saved theme, default to 'dark'
        return 'dark';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        const isDark =
            theme === 'dark' ||
            (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

        root.classList.toggle('dark', isDark);

        // Save the user's preference to localStorage, but only if it's not 'system'
        if (theme === 'light' || theme === 'dark') {
            localStorage.setItem('treevu-theme', theme);
        } else {
            localStorage.removeItem('treevu-theme');
        }

    }, [theme]);

    // Listener for system theme changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleChange = () => {
            if (theme === 'system') {
                const root = window.document.documentElement;
                root.classList.toggle('dark', mediaQuery.matches);
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    const value = useMemo(() => ({ theme, setTheme }), [theme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
