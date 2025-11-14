import { Expense } from '../types/expense';
import { Policy, PolicyViolation } from '../types/policy';
import { CategoriaGasto } from '../types/common';

const MOCK_POLICIES: Policy[] = [
    {
        id: 'policy-001',
        name: 'Límite de Almuerzo',
        description: 'Los gastos en la categoría Alimentación no deben exceder S/ 75 por transacción.',
        check: (expense: Expense): PolicyViolation | null => {
            if (expense.isCorporate && expense.categoria === CategoriaGasto.Alimentacion && expense.total > 75) {
                return {
                    policyId: 'policy-001',
                    policyName: 'Límite de Almuerzo',
                    message: `El gasto de S/ ${expense.total.toFixed(2)} excede el límite de S/ 75 para Alimentación.`
                };
            }
            return null;
        }
    },
    {
        id: 'policy-002',
        name: 'Gastos de Fin de Semana',
        description: 'No se permiten gastos de transporte durante el fin de semana (sábado o domingo).',
        check: (expense: Expense): PolicyViolation | null => {
            const expenseDate = new Date(expense.fecha + 'T12:00:00Z'); // Use UTC to avoid timezone shifts
            const dayOfWeek = expenseDate.getUTCDay(); // Sunday = 0, Saturday = 6
            if (expense.isCorporate && expense.categoria === CategoriaGasto.Transporte && (dayOfWeek === 0 || dayOfWeek === 6)) {
                return {
                    policyId: 'policy-002',
                    policyName: 'Gastos de Fin de Semana',
                    message: 'Los gastos de transporte no están permitidos durante el fin de semana.'
                };
            }
            return null;
        }
    },
    {
        id: 'policy-003',
        name: 'Categorías no Reembolsables',
        description: 'Los gastos en la categoría Ocio no son elegibles para reembolso.',
        check: (expense: Expense): PolicyViolation | null => {
            if (expense.isCorporate && expense.categoria === CategoriaGasto.Ocio) {
                return {
                    policyId: 'policy-003',
                    policyName: 'Categorías no Reembolsables',
                    message: 'Los gastos de Ocio no son reembolsables según la política de la empresa.'
                };
            }
            return null;
        }
    }
];

export const checkExpenseAgainstPolicies = (expense: Expense): PolicyViolation[] => {
    const violations: PolicyViolation[] = [];
    for (const policy of MOCK_POLICIES) {
        const result = policy.check(expense);
        if (result) {
            violations.push(result);
        }
    }
    return violations;
};
