import React from 'react';
// FIX: Updated imports from deprecated 'types.ts' to 'types/notification.ts'.
import { type Notification, NotificationType } from '@/types/notification';
import { SparklesIcon, ExclamationTriangleIcon, CheckBadgeIcon, FireIcon, TrophyIcon } from '@/components/ui/Icons';
import { useNotifications } from '@/contexts/NotificationContext';

interface NotificationItemProps {
    notification: Notification;
}

const getIconForType = (type: NotificationType) => {
    switch (type) {
        case NotificationType.SpendingAnomaly:
            return <ExclamationTriangleIcon className="w-5 h-5 text-warning" />;
        case NotificationType.GoalMilestone:
            return <CheckBadgeIcon className="w-5 h-5 text-primary" />;
        case NotificationType.StreakBonus:
            return <FireIcon className="w-5 h-5 text-danger" />;
        case NotificationType.Kudos:
            return <TrophyIcon className="w-5 h-5 text-yellow-400" />;
        default:
            return <SparklesIcon className="w-5 h-5 text-accent" />;
    }
};

const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
    const { markAsRead } = useNotifications();

    const timeAgo = (timestamp: number): string => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return `hace ${Math.floor(interval)} a`;
        interval = seconds / 2592000;
        if (interval > 1) return `hace ${Math.floor(interval)} m`;
        interval = seconds / 86400;
        if (interval > 1) return `hace ${Math.floor(interval)} d`;
        interval = seconds / 3600;
        if (interval > 1) return `hace ${Math.floor(interval)} h`;
        interval = seconds / 60;
        if (interval > 1) return `hace ${Math.floor(interval)} min`;
        return 'justo ahora';
    };

    const handleClick = () => {
        if (!notification.isRead) {
            markAsRead(notification.id);
        }
        if (notification.action) {
            notification.action.onClick();
        }
    };
    
    const isClickable = !!notification.action;

    return (
        <div 
            onClick={handleClick}
            className={`p-3 rounded-xl flex items-start gap-3 transition-colors ${isClickable ? 'cursor-pointer hover:bg-active-surface/50' : ''} ${!notification.isRead ? 'bg-primary/10' : 'bg-background'}`}
            role={isClickable ? 'button' : 'listitem'}
            tabIndex={isClickable ? 0 : -1}
        >
            <div className="w-8 h-8 rounded-full bg-active-surface flex items-center justify-center flex-shrink-0 mt-1">
                {getIconForType(notification.type)}
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <h4 className="font-bold text-sm text-on-surface">{notification.title}</h4>
                    {!notification.isRead && <div className="w-2.5 h-2.5 bg-primary rounded-full flex-shrink-0 ml-2 mt-1" aria-label="No leído"></div>}
                </div>
                <p className="text-xs text-on-surface-secondary mt-0.5">{notification.message}</p>
                <time className="text-xs text-on-surface-secondary/70 mt-1">{timeAgo(notification.timestamp)}</time>
                 {notification.action && (
                    <button className="mt-2 text-xs font-bold text-primary">
                        {notification.action.label}
                    </button>
                )}
            </div>
        </div>
    );
};

export default React.memo(NotificationItem);