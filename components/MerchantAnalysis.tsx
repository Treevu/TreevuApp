import React, { useMemo } from 'react';
// FIX: Updated import from deprecated 'types.ts'.
import { type Expense } from '../types/expense';
import { ShoppingBagIcon } from './Icons';

interface MerchantAnalysisProps {
    expenses: Expense[];
}

const MerchantAnalysis: React.FC<MerchantAnalysisProps> = ({ expenses }) => {
    const dataByMerchant = useMemo(() => {
        // FIX: Correctly typed the accumulator's initial value in the reduce function to ensure proper type inference.
        const merchantData = expenses
            .filter(expense => !expense.isProductScan) // Exclude expenses from product scans
            .reduce((acc, expense) => {
                const name = expense.razonSocial.trim();
                if (!acc[name]) {
                    acc[name] = { total: 0, count: 0 };
                }
                acc[name].total += expense.total;
                acc[name].count += 1;
                return acc;
            }, {} as Record<string, { total: number; count: number }>);

        return Object.entries(merchantData)
            .map(([name, data]) => ({
                name,
                // FIX: Cast `data` to its expected type to resolve TypeScript error where it was being inferred as `unknown`.
                total: (data as { total: number; count: number }).total,
                count: (data as { total: number; count: number }).count
            }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 5); // Top 5 merchants
    }, [expenses]);
    
    return (
        <div>
            <h2 className="text-lg font-bold text-on-surface mb-4 flex items-center">
                <ShoppingBagIcon className="w-6 h-6 mr-2 text-primary"/>
                Top Comercios
            </h2>
            <div className="space-y-4">
                {dataByMerchant.map(({ name, total, count }) => (
                    <div key={name} className="flex justify-between items-center">
                        <div>
                            <p className="font-semibold text-on-surface text-base truncate max-w-[150px] sm:max-w-xs">{name}</p>
                            <p className="text-xs text-on-surface-secondary">{count} {count === 1 ? 'transacción' : 'transacciones'}</p>
                        </div>
                        <span className="font-bold text-on-surface text-base">
                            s/&nbsp;{total.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MerchantAnalysis;
