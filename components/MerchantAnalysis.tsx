import React, { useMemo, useState } from 'react';
import { type Expense } from '../types/expense';
import { ShoppingBagIcon, ChevronDownIcon } from './Icons';
import { BarChartDataPoint, SimpleBarChart } from './TrendAnalysis';
import Tooltip from './Tooltip';

interface MerchantAnalysisProps {
    expenses: Expense[];
}

const get30DayHistory = (merchantName: string, allExpenses: Expense[]): BarChartDataPoint[] => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const relevantExpenses = allExpenses.filter(expense => {
        const expenseDate = new Date(expense.fecha);
        return expenseDate >= thirtyDaysAgo && expense.razonSocial.trim() === merchantName;
    });

    const dailyTotals = relevantExpenses.reduce((acc, expense) => {
        const dateKey = expense.fecha;
        acc[dateKey] = (acc[dateKey] || 0) + expense.total;
        return acc;
    }, {} as Record<string, number>);

    const chartData: BarChartDataPoint[] = [];
    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        
        chartData.push({
            label: date.toLocaleDateString('es-PE', { day: 'numeric' }),
            value: dailyTotals[dateString] || 0,
        });
    }
    return chartData;
};


const MerchantAnalysis: React.FC<MerchantAnalysisProps> = ({ expenses }) => {
    const [expandedMerchant, setExpandedMerchant] = useState<string | null>(null);

    const dataByMerchant = useMemo(() => {
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
                total: (data as { total: number; count: number }).total,
                count: (data as { total: number; count: number }).count,
                avg: (data as { total: number; count: number }).total / (data as { total: number; count: number }).count
            }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 5); // Top 5 merchants
    }, [expenses]);
    
    const handleToggle = (merchantName: string) => {
        setExpandedMerchant(prev => (prev === merchantName ? null : merchantName));
    };
    
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-on-surface flex items-center">
                    <ShoppingBagIcon className="w-6 h-6 mr-2 text-primary"/>
                    Top Comercios
                </h2>
                <Tooltip id="top-comercios-tooltip" text="Los 5 comercios donde más gastas. Haz clic para ver su detalle de los últimos 30 días y tu ticket promedio." />
            </div>
            <div className="space-y-2">
                {dataByMerchant.map(({ name, total, count, avg }) => {
                    const isExpanded = expandedMerchant === name;
                    const historyData = isExpanded ? get30DayHistory(name, expenses) : [];

                    return (
                        <div key={name} className="bg-background rounded-xl transition-shadow hover:shadow-md">
                            <button onClick={() => handleToggle(name)} className="w-full p-3 flex justify-between items-center text-left">
                                <div>
                                    <p className="font-semibold text-on-surface text-base truncate max-w-[150px] sm:max-w-xs">{name}</p>
                                    <p className="text-xs text-on-surface-secondary">{count} {count === 1 ? 'transacción' : 'transacciones'}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-bold text-on-surface text-base">
                                        s/&nbsp;{total.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                    <ChevronDownIcon className={`w-5 h-5 text-on-surface-secondary transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                </div>
                            </button>
                             <div
                                className="transition-all duration-500 ease-in-out overflow-hidden"
                                style={{ maxHeight: isExpanded ? '220px' : '0px' }}
                            >
                                <div className="px-3 pb-3">
                                    <div className="pt-2 border-t border-active-surface/50">
                                         <div className="flex justify-between items-center mb-2">
                                            <h4 className="text-xs font-bold text-on-surface-secondary">Gasto en los últimos 30 días</h4>
                                            <div className="text-right">
                                                 <p className="text-xs font-semibold text-on-surface-secondary">Ticket Promedio</p>
                                                 <p className="font-bold text-primary text-sm">
                                                    S/ {avg.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                                 </p>
                                            </div>
                                         </div>
                                        <SimpleBarChart data={historyData} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MerchantAnalysis;