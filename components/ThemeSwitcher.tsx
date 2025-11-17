import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from './Icons';

const ThemeSwitcher: React.FC = () => {
    const { theme, setTheme } = useTheme();

    const options = [
        { name: 'light', label: 'Claro', Icon: SunIcon },
        { name: 'dark', label: 'Oscuro', Icon: MoonIcon },
        { name: 'system', label: 'Sistema', Icon: ComputerDesktopIcon },
    ];

    return (
        <div className="bg-background rounded-xl p-1 flex items-center justify-between space-x-1">
            {options.map(({ name, label, Icon }) => (
                <button
                    key={name}
                    onClick={() => setTheme(name as 'light' | 'dark' | 'system')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm font-bold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary ${
                        theme === name
                            ? 'bg-primary text-primary-dark shadow'
                            : 'text-on-surface-secondary hover:bg-active-surface'
                    }`}
                    aria-pressed={theme === name}
                >
                    <Icon className="w-5 h-5" />
                    <span>{label}</span>
                </button>
            ))}
        </div>
    );
};

export default ThemeSwitcher;
