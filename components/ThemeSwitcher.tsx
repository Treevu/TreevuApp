import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

// Basic icons for the theme switcher
const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
    </svg>
);

const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25c0 5.385 4.365 9.75 9.75 9.75 2.572 0 4.921-.996 6.697-2.648Z" />
    </svg>
);

const ComputerDesktopIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25A2.25 2.25 0 0 1 5.25 3h13.5A2.25 2.25 0 0 1 21 5.25Z" />
    </svg>
);

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