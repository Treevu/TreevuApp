export enum NotificationType {
    StreakBonus = 'STREAK_BONUS',
    SpendingAnomaly = 'SPENDING_ANOMALY',
    GoalMilestone = 'GOAL_MILESTONE',
    Info = 'INFO',
    Kudos = 'KUDOS',
    WeeklySummary = 'WEEKLY_SUMMARY',
}

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    timestamp: number;
    isRead: boolean;
    action?: {
        label: string;
        onClick: () => void;
    };
}