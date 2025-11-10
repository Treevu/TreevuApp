import React from 'react';
import { BellIcon } from './Icons';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useModal } from '../contexts/ModalContext';
import Logo from './Logo';
import TreevuLogoText from './TreevuLogoText';

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
    const { user } = useAuth();
    const { unreadCount } = useNotifications();
    const { openModal } = useModal();

    return (
        <header className="bg-surface text-on-surface relative border-b border-active-surface/50">
            {/* Top section with title and profile */}
            <div className="max-w-3xl mx-auto px-4 pt-4 pb-4">
                <div className="flex justify-between items-center">
                     <div className="flex items-center gap-2">
                        <Logo className="w-8 h-8 text-primary" />
                        <h1 className="text-3xl font-bold leading-tight treevu-text">
                            <TreevuLogoText />
                        </h1>
                    </div>
                    {user && (
                        <div className="flex items-center gap-3">
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
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default React.memo(Header);