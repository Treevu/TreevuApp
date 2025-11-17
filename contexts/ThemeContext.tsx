import React, { createContext, useState, useContext, useEffect, useMemo, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { hexToRgb, adjustColor, getContrastColor } from '../utils';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth(); // Get user from AuthContext
    
    // Default to 'system' and let useEffect handle the hydration from localStorage.
    const [theme, setTheme] = useState<Theme>('system');

    // Effect for hydrating theme from localStorage on initial load.
    useEffect(() => {
        const savedTheme = localStorage.getItem('treevu-theme');
        if (savedTheme === 'light' || savedTheme === 'dark') {
            setTheme(savedTheme);
        }
    }, []);

    // Effect for applying theme class and saving preference.
    useEffect(() => {
        const root = window.document.documentElement;
        const isDark =
            theme === 'dark' ||
            (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

        root.classList.toggle('dark', isDark);

        // Save the user's preference to localStorage, or remove it for 'system'.
        if (theme === 'light' || theme === 'dark') {
            localStorage.setItem('treevu-theme', theme);
        } else {
            localStorage.removeItem('treevu-theme');
        }
    }, [theme]);
    
    // Effect for company branding
    useEffect(() => {
        const rootStyle = document.documentElement.style;
        const branding = user?.branding;
        
        if (branding && branding.primaryColor) {
            const primaryColor = branding.primaryColor;
            const rgb = hexToRgb(primaryColor);
            
            rootStyle.setProperty('--primary', primaryColor);
            rootStyle.setProperty('--primary-light', adjustColor(primaryColor, 20));
            rootStyle.setProperty('--primary-dark', getContrastColor(primaryColor));
            if (rgb) {
                rootStyle.setProperty('--primary-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
            }
        } else {
            // Revert to stylesheet defaults if no branding is present
            rootStyle.removeProperty('--primary');
            rootStyle.removeProperty('--primary-light');
            rootStyle.removeProperty('--primary-dark');
            rootStyle.removeProperty('--primary-rgb');
        }

    }, [user]); // Rerun when user object (and thus branding) changes

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