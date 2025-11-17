


import React, { useState, useRef, useEffect } from 'react';
import { BellIcon, UserCircleIcon, ArrowLeftIcon } from './Icons';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useModal } from '../contexts/ModalContext';
import CubeLogo from './CubeLogo';
import TreevuLogoText from './TreevuLogoText';

interface HeaderProps {
    activeTabLabel: string;
}

const Header: React.FC<HeaderProps> = ({ activeTabLabel }) => {
    const { user, signOut } = useAuth();
    const { unreadCount } = useNotifications();
    const { openModal } = useModal();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className={`sticky top-0 z-20 header-base ${isScrolled ? 'header-scrolled' : ''}`}>
            {/* Top section with title and profile */}
            <div className="max-w-3xl mx-auto px-4 pt-4 pb-4">
                <div className="flex justify-between items-center">
                     <div className="flex items-center gap-3">
                        <CubeLogo className="w-9 h-9" />
                        <div>
                            <h1 className="text-2xl font-bold leading-tight -mb-1">
                                <TreevuLogoText />
                            </h1>
                            <p className="text-accent text-sm font-bold leading-none italic">
                                for people
                            </p>
                        </div>
                    </div>
                    {user && (
                        <div className="flex items-center gap-2">
                             <button
                                onClick={() => openModal('notificationCenter')}
                                className="relative p-2 rounded-full text-on-surface-secondary hover:bg-active-surface hover:text-on-surface focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary"
                                aria-label={`Ver notificaciones (${unreadCount} no leídas)`}
                            >
                                <BellIcon className="w-6 h-6"/>
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-1.5 flex h-4 w-4">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-4 w-4 bg-danger text-white text-xs items-center justify-center font-bold">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    </span>
                                )}
                            </button>
                            
                            {/* Profile Menu Button */}
                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                    className="p-2 rounded-full text-on-surface-secondary hover:bg-active-surface hover:text-on-surface focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary"
                                    aria-label="Abrir menú de perfil"
                                    aria-haspopup="true"
                                    aria-expanded={isProfileMenuOpen}
                                >
                                    <UserCircleIcon className="w-6 h-6" />
                                </button>
                                {isProfileMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-surface rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-30 animate-fade-in" style={{ animationDuration: '150ms' }}>
                                        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button">
                                            <div className="px-4 py-2 text-sm text-on-surface-secondary border-b border-active-surface/50">
                                                <p className="font-bold text-on-surface truncate" title={user.name}>{user.name}</p>
                                                <p className="truncate" title={user.email}>{user.email}</p>
                                            </div>
                                            <button
                                                onClick={signOut}
                                                className="w-full text-left px-4 py-3 text-sm text-danger hover:bg-active-surface flex items-center gap-3"
                                                role="menuitem"
                                            >
                                                <ArrowLeftIcon className="w-5 h-5" />
                                                Cerrar Sesión
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default React.memo(Header);