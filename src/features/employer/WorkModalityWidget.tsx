
import React from 'react';
import { BuildingOffice2Icon, LightBulbIcon, ReceiptPercentIcon, TruckIcon, HomeIcon, ShoppingBagIcon, TicketIcon, CogIcon, HeartIcon, AcademicCapIcon, SparklesIcon } from '@/components/ui/Icons';
import Tooltip from '@/components/ui/Tooltip.tsx';
import { CategoriaGasto, TreevuLevel } from '@/types/common';
import { Modality } from '@/types/employer';

interface ModalityData {
    modality: Modality;
    fwi: number;
    topCategories: { category: CategoriaGasto; amount: number }[];
    employeeCount: number;
    intentBreakdown: {
        essentialPercent: number;
        desiredPercent: number;
    };
}

interface WorkModalityWidgetProps {
    data: ModalityData[];
}

const categoryIcons: { [key in CategoriaGasto]: React.FC<{className?: string}> } = {
    [CategoriaGasto.Alimentacion]: ReceiptPercentIcon,
    [CategoriaGasto.Transporte]: TruckIcon,
    [CategoriaGasto.Vivienda]: HomeIcon,
    [CategoriaGasto.Consumos]: ShoppingBagIcon,
    [CategoriaGasto.Ocio]: TicketIcon,
    [CategoriaGasto.Servicios]: CogIcon,
    [CategoriaGasto.Salud]: HeartIcon,
    [CategoriaGasto.Educacion]: AcademicCapIcon,
    [CategoriaGasto.Otros]: SparklesIcon,
};

const getModalityInsight = (modality: Modality, fwi: number, topCategories: { category: CategoriaGasto; amount: number }[]): string => {
    if (topCategories.length === 0) {
        return "No hay suficientes datos para generar un insight detallado para este grupo.";
    }
    const topCatName = topCategories[0].category;

    if (modality === 'Remoto' && (topCatName === CategoriaGasto.Servicios || topCatName === CategoriaGasto.Vivienda)) {
        return "El gasto se concentra en el hogar. Considera ofrecer un bono para utilities o home office.";
    }
    if (modality === 'Presencial' && topCatName === CategoriaGasto.Transporte) {
        return "El transporte es un gasto clave. Beneficios como vales de movilidad podrían tener un alto impacto.";
    }
    if (modality === 'Híbrido' && fwi < 65) {
        return "El FWI es menor. Este grupo podría estar enfrentando gastos duplicados (hogar y transporte). Es clave investigar sus necesidades específicas.";
    }
    if (fwi > 80) {
        return "Este grupo muestra un gran bienestar. ¡Analiza sus hábitos para replicar su éxito en otras modalidades!";
    }
    return "Analiza el desglose de gastos para identificar oportunidades de beneficios personalizados que se ajusten a su realidad.";
};

const ModalityCard: React.FC<{ data: ModalityData }> = ({ data }) => {
    const { modality, fwi, topCategories, employeeCount, intentBreakdown } = data;
    const insight = getModalityInsight(modality, fwi, topCategories);
    const totalSpending = topCategories.reduce((sum, cat) => sum + cat.amount, 0);

    const getFwiColor = (score: number) => {
        if (score >= 75) return 'text-emerald-500';
        if (score >= 60) return 'text-warning';
        return 'text-danger';
    };

    return (
        <div className="bg-background p-4 rounded-xl flex-1 min-w-[280px]">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-bold text-on-surface">{modality}</h4>
                    <p className="text-xs text-on-surface-secondary">{employeeCount} colaboradores</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-on-surface-secondary">FWI Promedio</p>
                    <p className={`text-2xl font-bold ${getFwiColor(fwi)}`}>{fwi.toFixed(0)}</p>
                </div>
            </div>

            <div className="mt-3 space-y-2">
                <p className="text-xs font-semibold text-on-surface-secondary">Top 3 Categorías de Gasto:</p>
                {topCategories.map(cat => {
                    const Icon = categoryIcons[cat.category] || SparklesIcon;
                    const percentage = totalSpending > 0 ? (cat.amount / totalSpending) * 100 : 0;
                    return (
                        <div key={cat.category}>
                            <div className="flex justify-between items-center text-xs mb-1">
                                <span className="flex items-center gap-1.5 text-on-surface-secondary font-medium"><Icon className="w-4 h-4"/> {cat.category}</span>
                                <span className="font-bold text-on-surface">S/ {cat.amount.toLocaleString('es-PE', { maximumFractionDigits: 0 })}</span>
                            </div>
                            <div className="h-1.5 w-full bg-active-surface rounded-full">
                                <div className="h-1.5 rounded-full bg-primary" style={{ width: `${percentage}%` }}></div>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <div className="mt-4">
                <div className="flex justify-between items-center text-xs font-semibold text-on-surface-secondary mb-1">
                    <span>Balance Esencial / Deseado</span>
                    <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1" title="Esencial"><div className="w-2 h-2 rounded-full bg-primary"></div> {intentBreakdown.essentialPercent.toFixed(0)}%</span>
                        <span className="flex items-center gap-1" title="Deseado"><div className="w-2 h-2 rounded-full bg-accent"></div> {intentBreakdown.desiredPercent.toFixed(0)}%</span>
                    </div>
                </div>
                <div className="flex w-full h-1.5 rounded-full overflow-hidden bg-active-surface shadow-inner">
                    <div 
                        style={{ width: `${intentBreakdown.essentialPercent}%` }} 
                        className="bg-primary" 
                        title={`Esencial: ${intentBreakdown.essentialPercent.toFixed(1)}%`}
                    ></div>
                    <div 
                        style={{ width: `${intentBreakdown.desiredPercent}%` }} 
                        className="bg-accent" 
                        title={`Deseado: ${intentBreakdown.desiredPercent.toFixed(1)}%`}
                    ></div>
                </div>
            </div>
            
             <div className="mt-4 pt-3 border-t border-active-surface/50">
                <div className="flex items-start space-x-2.5">
                    <LightBulbIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-on-surface-secondary leading-tight">{insight}</p>
                </div>
            </div>
        </div>
    );
};


const WorkModalityWidget: React.FC<WorkModalityWidgetProps> = ({ data }) => {
    return (
        <div className="bg-surface rounded-2xl p-5 relative">
            <div className="absolute top-4 right-4">
                <Tooltip id="modality-widget-tooltip" text="Compara el FWI y los patrones de gasto entre equipos remotos, híbridos y presenciales para diseñar beneficios más efectivos y equitativos." />
            </div>
            <h3 className="text-lg font-bold text-on-surface mb-4 flex items-center">
                <BuildingOffice2Icon className="w-6 h-6 mr-2 text-primary" />
                Radiografía por Modalidad
            </h3>
            
            {data && data.some(d => d.employeeCount > 0) ? (
                 <div className="flex flex-col lg:flex-row gap-4">
                    {data.filter(d => d.employeeCount > 0).map(modalityData => (
                        <ModalityCard key={modalityData.modality} data={modalityData} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-on-surface-secondary">
                    <p>No hay suficientes datos para comparar las modalidades de trabajo.</p>
                </div>
            )}
        </div>
    );
};

export default WorkModalityWidget;
