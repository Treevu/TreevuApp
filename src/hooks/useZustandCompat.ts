// Hook de compatibilidad para facilitar la migración desde Context API
import useUserStore from '@/stores/useUserStore'
import useExpensesStore from '@/stores/useExpensesStore'
import useBudgetStore from '@/stores/useBudgetStore'
import useGoalsStore from '@/stores/useGoalsStore'
import { useAlertStore, useTribesStore } from '@/stores'
import useModalStoreNew from '@/stores/useModalStore'
import useNotificationStore from '@/stores/useNotificationStore'

// Hook que simula useAuth pero usando Zustand
export const useAuth = () => {
  const { user, addTreevus, updateUser, signOut, completeLesson, prestigeUp, redeemTreevusForReward } = useUserStore()
  
  return {
    user,
    addTreevus,
    updateUser,
    signOut,
    completeLesson,
    prestigeUp,
    redeemTreevusForReward
  }
}

// Hook que simula useAlert pero usando Zustand
export const useAlert = () => {
  const { alert, setAlert } = useAlertStore()
  
  return {
    alert,
    setAlert
  }
}

// Hook que simula useModal pero usando Zustand
export const useModal = () => {
  const { openModal, closeModal } = useModalStoreNew()
  
  return {
    openModal,
    closeModal
  }
}

// Hook que simula useExpenses pero usando Zustand
export const useExpenses = () => {
  const { 
    expenses, 
    addExpense, 
    updateExpense, 
    deleteExpense, 
    getTotalExpenses,
    getFormalExpenses,
    getInformalExpenses,
    getFormalityIndex
  } = useExpensesStore()
  
  return {
    expenses,
    addExpense,
    updateExpense, 
    deleteExpense,
    totalExpenses: getTotalExpenses(),
    formalExpenses: getFormalExpenses(),
    informalExpenses: getInformalExpenses(),
    formalityIndex: getFormalityIndex()
  }
}

// Hook que simula useBudget pero usando Zustand
export const useBudget = () => {
  const { budget, setBudget, annualIncome, setAnnualIncome } = useBudgetStore()
  
  return {
    budget,
    setBudget,
    annualIncome,
    setAnnualIncome
  }
}

// Hook que simula useGoals pero usando Zustand
export const useGoals = () => {
  const { 
    goals, 
    addGoal, 
    updateGoal, 
    deleteGoal, 
    updateGoalContribution,
    getActiveGoals,
    getCompletedGoals
  } = useGoalsStore()
  
  return {
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    updateGoalContribution,
    activeGoals: getActiveGoals(),
    completedGoals: getCompletedGoals()
  }
}

// Hook que simula useTribes pero usando Zustand
export const useTribes = () => {
  const { tribes, missions, sendKudos, acceptMission } = useTribesStore()
  
  return {
    tribes,
    missions,
    sendKudos,
    acceptMission
  }
}

// Hook para estado general de la app (reemplaza useAppContext)
export const useAppContext = () => {
  const expenses = useExpensesStore(state => state.expenses)
  const budget = useBudgetStore(state => state.budget)
  const annualIncome = useBudgetStore(state => state.annualIncome)
  const goals = useGoalsStore(state => state.goals)
  
  const addExpense = useExpensesStore(state => state.addExpense)
  const updateExpense = useExpensesStore(state => state.updateExpense)
  const updateGoalContribution = useGoalsStore(state => state.updateGoalContribution)
  
  return {
    state: {
      expenses,
      budget,
      annualIncome,
      goals
    },
    addExpense,
    updateExpense,
    updateGoalContribution
  }
}

// Hook que simula useNotifications pero usando Zustand
export const useNotifications = () => {
  const { 
    notifications, 
    addNotification, 
    markAsRead, 
    markAllAsRead, 
    clearNotifications,
    getUnreadCount,
    removeNotification,
    lastNotificationTimes
  } = useNotificationStore()
  
  return {
    notifications,
    unreadCount: getUnreadCount(),
    lastNotificationTimes,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    removeNotification
  }
}