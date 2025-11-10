import React, { useState } from 'react';
import Tooltip from '../Tooltip';
import { UsersIcon } from '../Icons';
import AccordionItem from './AccordionItem';

// Type for the filter state remains useful for status logic
type KpiStatus = 'Crítico' | 'Atención' | 'Fuerte';

// Props remain the same
interface KpiMatrixData {
    department: string;
    fwi?: number;
    flightRiskScore?: number;
    redemptionRate?: number;
    activationRate?: number;
}

interface KpiMatrixWidgetProps {
    data: KpiMatrixData[];
}

// Config object remains the same
const kpiConfig = {
    fwi: { label: 'FWI', thresholds: [65, 80] as [number, number], invert: false },
    flightRiskScore: { label: 'Riesgo Fuga', thresholds: [35, 60] as [number, number], invert: true },
    redemptionRate: { label: 'Tasa Canje', thresholds: [40, 65] as [number, number], invert: false },
    activationRate: { label: 'Activación', thresholds: [70, 85] as [number, number], invert: false },
};

// getStatus function, modified to return the status string
const getStatus = (value: number | undefined, thresholds: [number, number], invert: boolean = false): KpiStatus | null => {
    if (value === undefined || value < 0) return null;
    const [low, high] = thresholds;
    if (!invert) {
        if (value >= high) return 'Fuerte';
        if (value >= low) return 'Atención';
        return 'Crítico';
    } else {
        if (value <= low) return 'Fuerte';
        if (value <= high) return 'Atención';
        return 'Crítico';
    }
};

const getStatusStyling = (status: KpiStatus | null): { dot: string, text: string } => {
    switch (status) {
        case 'Crítico': return { dot: 'bg-danger', text: 'text-danger' };
        case 'Atención': return { dot: 'bg-warning', text: 'text-warning' };
        case 'Fuerte': return { dot: 'bg-emerald-500', text: 'text-emerald-500' };
        default: return { dot: 'bg-on-surface-secondary/50', text: 'text-on-surface-secondary' };
    }
};

const KpiMatrixWidget: React.FC<KpiMatrixWidgetProps> = ({ data }) => {
    const [openDepartment, setOpenDepartment] = useState<string | null>(data.length > 0 ? data[0].department : null);

    const sortedData = [...data].sort((a, b) => (a.fwi || 0) - (b.fwi || 0));

    return (
        <div className="bg-surface rounded-2xl p-5 relative">
            <div className="absolute top-4 right-4">
                <Tooltip id="kpi-matrix-tooltip" text="Obtén una vista 360° de cada área. Despliega un departamento para ver todos sus KPIs y su estado actual, permitiéndote un diagnóstico rápido y completo." />
            </div>
            <h3 className="text-lg font-bold text-on-surface mb-4 flex items-center">
                <UsersIcon className="w-6 h-6 mr-2 text-primary" />
                Matriz de KPIs por Área
            </h3>

            {data.length === 0 ? (
                <div className="text-center py-8 text-on-surface-secondary">
                    <p>No hay datos suficientes para mostrar la matriz.</p>
                </div>
            ) : (
                <div className="space-y-1">
                    {sortedData.map(deptData => {
                        const kpiStatuses = (Object.keys(kpiConfig) as Array<keyof typeof kpiConfig>).map(key => {
                            const config = kpiConfig[key];
                            const value = deptData[key];
                            const status = getStatus(value, config.thresholds, config.invert);
                            return getStatusStyling(status).dot;
                        });

                        return (
                            <AccordionItem
                                key={deptData.department}
                                isOpen={openDepartment === deptData.department}
                                onClick={() => setOpenDepartment(openDepartment === deptData.department ? null : deptData.department)}
                                title={
                                    <div className="flex justify-between items-center w-full">
                                        <span className="font-bold text-on-surface text-sm">{deptData.department}</span>
                                        <div className="flex items-center gap-1.5">
                                            {kpiStatuses.map((colorClass, index) => (
                                                <div key={index} className={`w-2.5 h-2.5 rounded-full ${colorClass}`} />
                                            ))}
                                        </div>
                                    </div>
                                }
                            >
                                <div className="space-y-3 pt-2">
                                    {(Object.keys(kpiConfig) as Array<keyof typeof kpiConfig>).map(key => {
                                        const config = kpiConfig[key];
                                        const value = deptData[key];
                                        const status = getStatus(value, config.thresholds, config.invert);
                                        const styling = getStatusStyling(status);

                                        return (
                                            <div key={key} className="flex justify-between items-center text-sm">
                                                <div className="flex items-center">
                                                    <div className={`w-2 h-2 rounded-full mr-2.5 ${styling.dot}`} />
                                                    <span className="text-on-surface-secondary">{config.label}</span>
                                                </div>
                                                <span className={`font-bold ${styling.text}`}>
                                                    {value !== undefined && value >= 0 ? `${Math.round(value)}%` : 'N/A'}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </AccordionItem>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default KpiMatrixWidget;