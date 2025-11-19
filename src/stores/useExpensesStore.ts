import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { type Expense } from '@/types/expense'

interface ExpensesState {
  // Estado
  expenses: Expense[]
  isLoading: boolean
  error: string | null
  
  // Acciones
  addExpense: (expense: Expense) => void
  updateExpense: (id: string, updates: Partial<Expense>) => void
  deleteExpense: (id: string) => void
  clearExpenses: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Getters computados
  getTotalExpenses: () => number
  getFormalExpenses: () => Expense[]
  getInformalExpenses: () => Expense[]
  getExpensesByCategory: (category: string) => Expense[]
  getFormalityIndex: () => number
}

const useExpensesStore = create<ExpensesState>()(
  devtools(
    persist(
      (set, get) => ({
        // Estado inicial
        expenses: [],
        isLoading: false,
        error: null,
        
        // Acciones
        addExpense: (expense) => set((state) => ({
          expenses: [...state.expenses, expense],
          error: null
        }), false, `addExpense(${expense.id})`),
        
        updateExpense: (id, updates) => set((state) => ({
          expenses: state.expenses.map(expense => 
            expense.id === id ? { ...expense, ...updates } : expense
          ),
          error: null
        }), false, `updateExpense(${id})`),
        
        deleteExpense: (id) => set((state) => ({
          expenses: state.expenses.filter(expense => expense.id !== id),
          error: null
        }), false, `deleteExpense(${id})`),
        
        clearExpenses: () => set({ 
          expenses: [], 
          error: null 
        }, false, 'clearExpenses'),
        
        setLoading: (loading) => set({ 
          isLoading: loading 
        }, false, `setLoading(${loading})`),
        
        setError: (error) => set({ 
          error 
        }, false, `setError(${error})`),
        
        // Getters computados
        getTotalExpenses: () => {
          const { expenses } = get()
          return expenses.reduce((sum, expense) => sum + expense.total, 0)
        },
        
        getFormalExpenses: () => {
          const { expenses } = get()
          return expenses.filter(expense => expense.esFormal)
        },
        
        getInformalExpenses: () => {
          const { expenses } = get()
          return expenses.filter(expense => !expense.esFormal)
        },
        
        getExpensesByCategory: (category) => {
          const { expenses } = get()
          return expenses.filter(expense => expense.categoria === category)
        },
        
        // Calcular índice de formalidad (porcentaje de gastos formales por monto)
        getFormalityIndex: () => {
          const { expenses } = get()
          if (expenses.length === 0) return 0
          
          const totalAmount = expenses.reduce((sum, expense) => sum + expense.total, 0)
          const formalAmount = expenses
            .filter(expense => expense.esFormal)
            .reduce((sum, expense) => sum + expense.total, 0)
          
          return totalAmount > 0 ? (formalAmount / totalAmount) : 0
        }
      }),
      {
        name: 'expenses-storage',
        partialize: (state) => ({ 
          expenses: state.expenses 
        })
      }
    ),
    { name: 'Expenses Store' }
  )
)

export default useExpensesStore