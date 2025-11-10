import { Expense } from '../types/expense';

// Ícono genérico de billetes para las notificaciones
const TREEBU_ICON_DATA_URI = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='%2300E0FF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125-1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z' /%3E%3C/svg%3E";

const showNotification = (title: string, options: NotificationOptions, tag: string) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
        return;
    }

    const finalOptions = {
        icon: TREEBU_ICON_DATA_URI,
        badge: TREEBU_ICON_DATA_URI,
        tag,
        ...options,
    };

    navigator.serviceWorker.getRegistration().then(registration => {
        if (registration) {
            registration.showNotification(title, finalOptions);
        } else {
            new Notification(title, finalOptions);
        }
    }).catch(err => {
        console.error("Service Worker not found, using simple notification.", err);
        new Notification(title, finalOptions);
    });
};


/**
 * Solicita permiso al usuario para mostrar notificaciones.
 * Solo se lo pide si el permiso no ha sido ya concedido o denegado.
 */
export const requestNotificationPermission = async (): Promise<void> => {
    if (!('Notification' in window)) {
        console.warn('Este navegador no soporta notificaciones de escritorio.');
        return;
    }

    if (Notification.permission === 'default') {
        try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                console.log('Permiso para notificaciones concedido.');
            } else {
                console.log('Permiso para notificaciones denegado.');
            }
        } catch (error) {
            console.error('Error al solicitar permiso para notificaciones:', error);
        }
    }
};


/**
 * Envía una notificación push al usuario sobre un crédito fiscal potencial perdido.
 * @param {Expense} expense - El gasto informal que se acaba de añadir.
 */
export const sendInformalExpenseNotification = (expense: Expense): void => {
    const title = '🌿 ¡Oportunidad de Cosecha!';
    const options: NotificationOptions = {
        body: `Registraste un gasto informal en ${expense.razonSocial}. La próxima vez, pide boleta electrónica, gana más treevüs y haz que tu dinero trabaje para ti.`,
    };
    showNotification(title, options, `treevu-expense-${expense.id}`);
};

/**
 * Notifies the user their streak is at risk.
 */
export const sendStreakWarningNotification = (streakCount: number): void => {
    const title = `🔥 ¡No pierdas tu racha de ${streakCount} días!`;
    const options: NotificationOptions = {
        body: "Registra un gasto formal hoy para mantener tu racha y seguir ganando bonificaciones.",
    };
    showNotification(title, options, 'streak-warning');
};

/**
 * Notifies the user about unusual spending in a category.
 */
export const sendSpendingAnomalyNotification = (category: string, count: number): void => {
    const title = `📈 Ojo con tus gastos en "${category}"`;
    const options: NotificationOptions = {
        body: `Hemos notado ${count} gastos seguidos en esta categoría. ¡Asegúrate de que se alinee con tu presupuesto!`,
    };
    showNotification(title, options, `anomaly-${category}-${Date.now()}`);
};

/**
 * Notifies the user they've hit a budget milestone.
 */
export const sendBudgetMilestoneNotification = (percentage: number): void => {
    const title = `🎯 ¡Hito Alcanzado: ${percentage}% de tu presupuesto!`;
    const options: NotificationOptions = {
        body: `Vas por buen camino. Sigue monitoreando tus gastos para cerrar el mes con éxito.`,
    };
    showNotification(title, options, `milestone-${percentage}`);
};