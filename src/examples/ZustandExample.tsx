import { CategoriaGasto, TipoComprobante } from '@/types/common'
import { Expense } from '@/types/expense'
import useUserStore from '@/stores/useUserStore'
import useExpensesStore from '@/stores/useExpensesStore'
import useBudgetStore from '@/stores/useBudgetStore'
import useGoalsStore from '@/stores/useGoalsStore'
import { useAlertStore } from '@/stores'

// Componente ejemplo que usa directamente los stores
export const ExampleZustandComponent = () => {
  // Suscripción selectiva para mejor rendimiento
  const user = useUserStore(state => state.user)
  const addTreevus = useUserStore(state => state.addTreevus)
  
  // Suscripción a múltiples valores
  const { expenses, addExpense } = useExpensesStore(state => ({
    expenses: state.expenses,
    addExpense: state.addExpense
  }))
  
  // Suscripción a un solo valor
  const budget = useBudgetStore(state => state.budget)
  const setBudget = useBudgetStore(state => state.setBudget)
  
  // Suscripción a getters computados
  const totalExpenses = useExpensesStore(state => state.getTotalExpenses())
  const activeGoals = useGoalsStore(state => state.getActiveGoals())
  
  // Función para agregar expense y ganar treevus
  const handleAddExpense = () => {
    const newExpense: Expense = {
      id: Date.now().toString(),
      razonSocial: 'Tienda Demo',
      ruc: '12345678901',
      fecha: new Date().toISOString(),
      total: 50,
      categoria: CategoriaGasto.Alimentacion,
      tipoComprobante: TipoComprobante.BoletaVentaElectronica,
      esFormal: true,
      ahorroPerdido: 0,
      igv: 9
    }
    
    addExpense(newExpense)
    addTreevus(10) // Recompensar con treevus
    
    // Mostrar alerta
    useAlertStore.getState().setAlert({
      message: '¡Gasto agregado! +10 treevüs ganados 🌿',
      type: 'success'
    })
  }
  
  return (
    <div>
      <h3>Usuario: {user?.name}</h3>
      <p>Treevus: {user?.treevus}</p>
      <p>Total gastos: S/. {totalExpenses}</p>
      <p>Presupuesto: S/. {budget || 'No definido'}</p>
      <p>Metas activas: {activeGoals.length}</p>
      
      <button onClick={handleAddExpense}>
        Agregar Gasto Demo
      </button>
      
      <button onClick={() => setBudget(1000)}>
        Establecer Presupuesto S/. 1000
      </button>
    </div>
  )
}

// Función para usar stores fuera de componentes
export const useStoresOutsideComponent = () => {
  // Acceso directo al estado sin suscripción
  const currentUser = useUserStore.getState().user
  const currentBudget = useBudgetStore.getState().budget
  
  // Escuchar cambios específicos
  const unsubscribe = useUserStore.subscribe(
    (state, prevState) => {
      const currentTreevus = state.user?.treevus || 0
      const previousTreevus = prevState.user?.treevus || 0
      
      if (currentTreevus > previousTreevus) {
        console.log(`¡Ganaste ${currentTreevus - previousTreevus} treevus!`)
      }
    }
  )
  
  // Llamar acciones directamente
  useUserStore.getState().addTreevus(25)
  
  return unsubscribe
}