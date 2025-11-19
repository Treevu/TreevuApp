import React from 'react';
import { useNotifications } from '@/hooks/useZustandCompat';
import NotificationItem from './NotificationItem';
import { BellIcon } from '@/components/ui/Icons';

interface NotificationCenterProps {
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ }) => {
    const { notifications, unreadCount, markAllAsRead, clearNotifications } = useNotifications();

    return (
        <div className="p-1">
            <div className="flex justify-between items-center mb-4 px-1">
                <button 
                    onClick={markAllAsRead} 
                    disabled={unreadCount === 0}
                    className="text-xs font-semibold text-primary disabled:text-on-surface-secondary disabled:opacity-50"
                >
                    Marcar todo como leído
                </button>
                <button 
                    onClick={clearNotifications}
                    disabled={notifications.length === 0}
                    className="text-xs font-semibold text-danger disabled:text-on-surface-secondary disabled:opacity-50"
                >
                    Limpiar todo
                </button>
            </div>
            {notifications.length > 0 ? (
                <div className="space-y-2 max-h-[60vh] overflow-y-auto custom-scrollbar -mr-3 pr-3">
                    {notifications.map(notification => (
                        <NotificationItem key={notification.id} notification={notification} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <BellIcon className="w-12 h-12 text-on-surface-secondary/20 mx-auto"/>
                    <p className="font-semibold mt-4">Todo está tranquilo</p>
                    <p className="text-sm text-on-surface-secondary mt-1">No tienes notificaciones nuevas por ahora.</p>
                </div>
            )}
        </div>
    );
};

export default NotificationCenter;