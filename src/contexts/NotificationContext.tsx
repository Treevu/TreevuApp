import React, { createContext, useState, useContext, ReactNode, useEffect, useMemo, useCallback } from 'react';
import { Notification, NotificationType } from '@/types/notification';

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearNotifications: () => void;
    lastNotificationTimes: Record<string, number>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const MAX_NOTIFICATIONS = 50;
const NOTIFICATION_STORAGE_KEY = 'treevu-notifications';

const initialNotifications: Notification[] = [
    {
        id: 'demo-1',
        type: NotificationType.StreakBonus,
        title: '¡Racha de 5 días!',
        message: '¡Felicidades! Ganaste 30 treevüs de bonificación por mantener tu constancia.',
        timestamp: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
        isRead: false,
    },
    {
        id: 'demo-2',
        type: NotificationType.GoalMilestone,
        title: '¡Meta casi completada!',
        message: 'Estás al 95% de tu meta "Fondo de Emergencia". ¡Un último esfuerzo!',
        timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
        isRead: false,
    },
    {
        id: 'demo-3',
        type: NotificationType.SpendingAnomaly,
        title: 'Ojo con los gastos en Ocio',
        message: 'Notamos varios gastos seguidos en Ocio. ¿Se alinea con tu presupuesto?',
        timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
        isRead: true,
    },
     {
        id: 'demo-4',
        type: NotificationType.Kudos,
        title: '¡Recibiste Kudos!',
        message: 'Ana te envió 25 treevüs por tu gran ayuda en el proyecto Centauri.',
        timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
        isRead: true,
    }
];

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        try {
            const savedNotifications = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
            if (savedNotifications) {
                setNotifications(JSON.parse(savedNotifications));
            } else {
                setNotifications(initialNotifications);
            }
        } catch (e) {
            console.error("Failed to load notifications from localStorage", e);
            setNotifications(initialNotifications);
        }
        setIsInitialLoad(false);
    }, []);

    useEffect(() => {
        if (isInitialLoad) return;
        try {
            // Filter out notifications with actions before saving to prevent serialization issues
            const serializableNotifications = notifications.map(({ action, ...rest }) => rest);
            localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(serializableNotifications));
        } catch (e) {
            console.error("Failed to save notifications to localStorage", e);
        }
    }, [notifications, isInitialLoad]);

    const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
        const newNotification: Notification = {
            id: `${Date.now()}-${Math.random()}`,
            timestamp: Date.now(),
            isRead: false,
            ...notification,
        };
        setNotifications(prev => [newNotification, ...prev].slice(0, MAX_NOTIFICATIONS));
    }, []);

    const markAsRead = useCallback((id: string) => {
        setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    }, []);

    const clearNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    const unreadCount = useMemo(() => notifications.filter(n => !n.isRead).length, [notifications]);
    
    const lastNotificationTimes = useMemo(() => {
        return notifications.reduce((acc, n) => {
            // This logic is specific to goal milestones to prevent spam
            if (n.type === 'GOAL_MILESTONE' && n.action?.label) {
                const goalId = n.action.label; // A bit of a hack, assuming label holds goalId
                if (!acc[goalId] || n.timestamp > acc[goalId]) {
                    acc[goalId] = n.timestamp;
                }
            }
            return acc;
        }, {} as Record<string, number>);
    }, [notifications]);

    const value = useMemo(() => ({
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        lastNotificationTimes
    }), [notifications, unreadCount, addNotification, markAsRead, markAllAsRead, clearNotifications, lastNotificationTimes]);

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};