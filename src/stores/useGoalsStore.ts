import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Goal } from '@/types/goal'

interface GoalsState {
  // Estado
  goals: Goal[]
  isLoading: boolean
  error: string | null
  
  // Acciones
  addGoal: (goal: Goal) => void
  updateGoal: (id: string, updates: Partial<Goal>) => void
  deleteGoal: (id: string) => void
  updateGoalContribution: (goalId: string, amount: number) => void
  clearGoals: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Getters computados
  getGoalById: (id: string) => Goal | undefined
  getActiveGoals: () => Goal[]
  getCompletedGoals: () => Goal[]
  getTotalGoalAmount: () => number
  getTotalContributed: () => number
}

const useGoalsStore = create<GoalsState>()(
  devtools(
    persist(
      (set, get) => ({
        // Estado inicial
        goals: [],
        isLoading: false,
        error: null,
        
        // Acciones
        addGoal: (goal) => set((state) => ({
          goals: [...state.goals, goal],
          error: null
        }), false, `addGoal(${goal.id})`),
        
        updateGoal: (id, updates) => set((state) => ({
          goals: state.goals.map(goal => 
            goal.id === id ? { ...goal, ...updates } : goal
          ),
          error: null
        }), false, `updateGoal(${id})`),
        
        deleteGoal: (id) => set((state) => ({
          goals: state.goals.filter(goal => goal.id !== id),
          error: null
        }), false, `deleteGoal(${id})`),
        
        updateGoalContribution: (goalId, amount) => set((state) => ({
          goals: state.goals.map(goal => {
            if (goal.id === goalId) {
              const newCurrentAmount = goal.currentAmount + amount
              return {
                ...goal,
                currentAmount: newCurrentAmount,
                status: newCurrentAmount >= goal.targetAmount ? 'completed' : 'active',
                lastContributionDate: new Date().toISOString()
              }
            }
            return goal
          }),
          error: null
        }), false, `updateGoalContribution(${goalId}, ${amount})`),
        
        clearGoals: () => set({ 
          goals: [], 
          error: null 
        }, false, 'clearGoals'),
        
        setLoading: (loading) => set({ 
          isLoading: loading 
        }, false, `setLoading(${loading})`),
        
        setError: (error) => set({ 
          error 
        }, false, `setError(${error})`),
        
        // Getters computados
        getGoalById: (id) => {
          const { goals } = get()
          return goals.find(goal => goal.id === id)
        },
        
        getActiveGoals: () => {
          const { goals } = get()
          return goals.filter(goal => goal.status === 'active')
        },
        
        getCompletedGoals: () => {
          const { goals } = get()
          return goals.filter(goal => goal.status === 'completed')
        },
        
        getTotalGoalAmount: () => {
          const { goals } = get()
          return goals.reduce((sum, goal) => sum + goal.targetAmount, 0)
        },
        
        getTotalContributed: () => {
          const { goals } = get()
          return goals.reduce((sum, goal) => sum + goal.currentAmount, 0)
        }
      }),
      {
        name: 'goals-storage',
        partialize: (state) => ({ 
          goals: state.goals 
        })
      }
    ),
    { name: 'Goals Store' }
  )
)

export default useGoalsStore