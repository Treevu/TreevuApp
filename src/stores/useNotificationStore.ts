import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Notification, NotificationType } from '@/types/notification'

// Estado del store
interface NotificationState {
  notifications: Notification[]
  lastNotificationTimes: Record<string, number>
}

// Acciones del store
interface NotificationActions {
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotifications: () => void
  getUnreadCount: () => number
  removeNotification: (id: string) => void
}

// Store completo
export type NotificationStore = NotificationState & NotificationActions

const MAX_NOTIFICATIONS = 50

// Notificaciones iniciales de demo
const initialNotifications: Notification[] = [
  {
    id: 'demo-1',
    type: NotificationType.StreakBonus,
    title: '¡Racha de 5 días!',
    message: '¡Felicidades! Ganaste 30 treevüs de bonificación por mantener tu constancia.',
    timestamp: Date.now() - 2 * 60 * 60 * 1000, // 2 horas atrás
    isRead: false,
  },
  {
    id: 'demo-2',
    type: NotificationType.GoalMilestone,
    title: '¡Meta del 50% alcanzada!',
    message: 'Has completado el 50% de tu meta "Vacaciones en Cusco". ¡Sigue así!',
    timestamp: Date.now() - 24 * 60 * 60 * 1000, // 1 día atrás
    isRead: false,
  },
  {
    id: 'demo-3',
    type: NotificationType.Info,
    title: 'Tip de ahorro',
    message: 'Detectamos que gastas mucho en comida. ¿Qué tal si intentas cocinar más en casa?',
    timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 días atrás
    isRead: false,
  },
  {
    id: 'demo-4',
    type: NotificationType.Info,
    title: 'Tip de ahorro',
    message: 'Detectamos que gastas mucho en comida. ¿Qué tal si intentas cocinar más en casa?',
    timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 días atrás
    isRead: false,
  },
]

const useNotificationStore = create<NotificationStore>()(
  devtools(
    // persist(
      (set, get) => ({
        // Estado inicial
        notifications: initialNotifications,
        lastNotificationTimes: {},

        // Agregar nueva notificación
        addNotification: (notificationData) => {
          const newNotification: Notification = {
            ...notificationData,
            id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
            isRead: false
          }

          set((state) => {
            const notifications = [newNotification, ...state.notifications]
              .slice(0, MAX_NOTIFICATIONS) // Limitar número máximo
            
            return {
              notifications,
              lastNotificationTimes: {
                ...state.lastNotificationTimes,
                [notificationData.type]: Date.now()
              }
            }
          }, false, 'addNotification')
        },

        // Marcar como leída
        markAsRead: (id) => {
          set((state) => ({
            notifications: state.notifications.map(notification =>
              notification.id === id 
                ? { ...notification, isRead: true }
                : notification
            )
          }), false, `markAsRead(${id})`)
        },

        // Marcar todas como leídas
        markAllAsRead: () => {
          set((state) => ({
            notifications: state.notifications.map(notification => ({
              ...notification,
              isRead: true
            }))
          }), false, 'markAllAsRead')
        },

        // Limpiar todas las notificaciones
        clearNotifications: () => {
          set({
            notifications: []
          }, false, 'clearNotifications')
        },

        // Obtener cantidad de no leídas
        getUnreadCount: () => {
          const { notifications } = get()
          return notifications.filter(n => !n.isRead).length
        },

        // Remover notificación específica
        removeNotification: (id) => {
          set((state) => ({
            notifications: state.notifications.filter(n => n.id !== id)
          }), false, `removeNotification(${id})`)
        }
      }),
      {
        name: 'notifications-storage',
        partialize: (state) => ({
          notifications: state.notifications,
          lastNotificationTimes: state.lastNotificationTimes
        })
      }
    // ),
    // { name: 'Notifications Store' }
  )
)

export default useNotificationStore