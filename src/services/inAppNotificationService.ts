import { getAINotificationContent } from './ai/employeeService';

import { CategoriaGasto } from '@/types/common';
import { Expense } from '@/types/expense';
import { Goal } from '@/types/goal';
import { Notification, NotificationType } from '@/types/notification';

const ANOMALY_THRESHOLD = 3;
const RELEVANT_ANOMALY_CATEGORIES = [CategoriaGasto.Ocio, CategoriaGasto.Consumos];
const GOAL_MILESTONE_PERCENTAGES = [80, 90, 95];

/**
 * Checks for a spending anomaly in recent expenses.
 * An anomaly is defined as `ANOMALY_THRESHOLD` consecutive expenses in the same relevant category.
 * @param recentExpenses The user's most recent expenses.
 * @returns The category if an anomaly is detected, otherwise null.
 */
const checkSpendingAnomaly = (recentExpenses: Expense[]): CategoriaGasto | null => {
    if (recentExpenses.length < ANOMALY_THRESHOLD) {
        return null;
    }

    const lastThreeExpenses = recentExpenses.slice(0, ANOMALY_THRESHOLD);
    const firstCategory = lastThreeExpenses[0].categoria;

    if (
        RELEVANT_ANOMALY_CATEGORIES.includes(firstCategory) &&
        lastThreeExpenses.every(exp => exp.categoria === firstCategory)
    ) {
        return firstCategory;
    }

    return null;
};

/**
 * Checks if any goal has crossed a significant milestone after a new expense (contribution).
 * @param goals The user's current goals.
 * @param lastNotificationTimes A map of goal IDs to the timestamp of their last milestone notification.
 * @returns The goal and percentage of the milestone reached, or null.
 */
const checkGoalMilestones = (
    goals: Goal[],
    lastNotificationTimes: Record<string, number>
): { goal: Goal; percentage: number } | null => {
    for (const goal of goals) {
        if (goal.targetAmount <= 0) continue;
        const currentPercentage = Math.floor((goal.currentAmount / goal.targetAmount) * 100);
        
        for (const milestone of GOAL_MILESTONE_PERCENTAGES) {
            if (currentPercentage >= milestone) {
                // Check if we've already notified for this milestone recently to avoid spam
                const lastTime = lastNotificationTimes[goal.id] || 0;
                const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
                if (lastTime < oneDayAgo) {
                    return { goal, percentage: milestone };
                }
            }
        }
    }
    return null;
};

/**
 * The main service function to trigger all in-app notification checks.
 * This should be called after a significant state change, like adding an expense.
 */
export const triggerInAppNotificationChecks = async (
    expenses: Expense[],
    goals: Goal[],
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void,
    lastNotificationTimes: Record<string, number>
): Promise<void> => {
    
    // 1. Check for Spending Anomaly
    const anomalousCategory = checkSpendingAnomaly(expenses);
    if (anomalousCategory) {
        const aiContent = await getAINotificationContent('spending_anomaly', { category: anomalousCategory });
        if (aiContent) {
            addNotification({
                type: NotificationType.SpendingAnomaly,
                title: aiContent.title,
                message: aiContent.message,
            });
        }
    }

    // 2. Check for Goal Milestones
    const milestoneHit = checkGoalMilestones(goals, lastNotificationTimes);
    if (milestoneHit) {
        const { goal, percentage } = milestoneHit;
        const aiContent = await getAINotificationContent('goal_milestone', { goalName: goal.name, percentage });
        if (aiContent) {
            addNotification({
                type: NotificationType.GoalMilestone,
                title: aiContent.title,
                message: aiContent.message,
            });
        }
    }
};