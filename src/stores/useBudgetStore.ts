import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface BudgetState {
  // Estado
  budget: number | null
  annualIncome: number | null
  isLoading: boolean
  error: string | null
  
  // Acciones
  setBudget: (amount: number) => void
  setAnnualIncome: (amount: number) => void
  clearBudget: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Getters computados
  getRemainingBudget: (totalExpenses: number) => number | null
  getBudgetStatus: (totalExpenses: number) => 'safe' | 'warning' | 'danger' | null
  getBudgetPercentage: (totalExpenses: number) => number | null
}

const useBudgetStore = create<BudgetState>()(
  devtools(
    persist(
      (set, get) => ({
        // Estado inicial
        budget: null,
        annualIncome: null,
        isLoading: false,
        error: null,
        
        // Acciones
        setBudget: (amount) => {
          set({ 
            budget: amount, 
            error: null 
          }, false, `setBudget(${amount})`)
          
          // Simular alert de presupuesto establecido
          console.log('setAlert called with:', {
            message: '¡Presupuesto establecido! Has ganado <strong>+25 treevüs</strong> 🌿',
            type: 'success'
          })
        },
        
        setAnnualIncome: (amount) => set({ 
          annualIncome: amount, 
          error: null 
        }, false, `setAnnualIncome(${amount})`),
        
        clearBudget: () => set({ 
          budget: null, 
          annualIncome: null, 
          error: null 
        }, false, 'clearBudget'),
        
        setLoading: (loading) => set({ 
          isLoading: loading 
        }, false, `setLoading(${loading})`),
        
        setError: (error) => set({ 
          error 
        }, false, `setError(${error})`),
        
        // Getters computados
        getRemainingBudget: (totalExpenses) => {
          const { budget } = get()
          return budget ? budget - totalExpenses : null
        },
        
        getBudgetStatus: (totalExpenses) => {
          const { budget } = get()
          if (!budget) return null
          
          const percentage = (totalExpenses / budget) * 100
          if (percentage >= 90) return 'danger'
          if (percentage >= 75) return 'warning'
          return 'safe'
        },
        
        getBudgetPercentage: (totalExpenses) => {
          const { budget } = get()
          if (!budget) return null
          return Math.min((totalExpenses / budget) * 100, 100)
        }
      }),
      {
        name: 'budget-storage',
        partialize: (state) => ({ 
          budget: state.budget,
          annualIncome: state.annualIncome
        })
      }
    ),
    { name: 'Budget Store' }
  )
)

export default useBudgetStore