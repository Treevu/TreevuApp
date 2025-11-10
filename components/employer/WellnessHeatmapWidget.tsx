import React, { useState } from 'react';
import Tooltip from '../Tooltip';
import { FireIcon, UsersIcon } from '../Icons';
import { type Department, type Tenure, TENURES } from '../../types/employer';
import SubNavBar from '../SubNavBar';

interface HeatmapData {
    department: Department;
    values: { [key in Tenure]: number };
}

interface WellnessHeatmapWidgetProps {
    data: HeatmapData[];
}

const WellnessHeatmapWidget: React.FC<WellnessHeatmapWidgetProps> = ({ data }) => {
    const [activeTenure, setActiveTenure] = useState<Tenure>(TENURES[0]);

    const getValueStyling = (value: number) => {
        if (value < 0) return { text: 'text-on-surface-secondary', value: 'N/A' };
        if (value >= 80) return { text: 'text-primary', value: value.toFixed(0) };
        if (value >= 65) return { text: 'text-emerald-500', value: value.toFixed(0) };
        if (value >= 50) return { text: 'text-warning', value: value.toFixed(0) };
        return { text: 'text-danger', value: value.toFixed(0) };
    };
    
    const subTabs = TENURES.map(t => ({
        id: t,
        label: t === '< 1 año' ? '< 1 Año' : t === '> 5 años' ? '> 5 Años' : '1-5 Años'
    }));

    const sortedData = [...data].sort((a, b) => {
        const valA = a.values[activeTenure] < 0 ? -Infinity : a.values[activeTenure];
        const valB = b.values[activeTenure] < 0 ? -Infinity : b.values[activeTenure];
        return valB - valA;
    });

    return (
        <div className="bg-surface rounded-2xl p-5 relative">
            <div className="absolute top-4 right-4">
                <Tooltip id="wellness-heatmap-tooltip" text="Identifica con precisión los focos de atención. Este mapa cruza el FWI por área y antigüedad, mostrando en rojo los segmentos con menor bienestar y en verde/azul los más saludables." />
            </div>
            <h3 className="text-lg font-bold text-on-surface mb-4 flex items-center">
                <FireIcon className="w-6 h-6 mr-2 text-primary" />
                Mapa de Calor de Bienestar
            </h3>
            
            <SubNavBar tabs={subTabs} activeTab={activeTenure} onTabClick={(t) => setActiveTenure(t as Tenure)} />

            {sortedData.length > 0 ? (
                <div className="mt-4 space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                    {sortedData.map((row, index) => {
                        const { text, value } = getValueStyling(row.values[activeTenure]);

                        return (
                            <div key={row.department} className="bg-background p-3 rounded-xl flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                                <div className="w-10 h-10 rounded-lg bg-active-surface flex items-center justify-center flex-shrink-0">
                                    <UsersIcon className="w-5 h-5 text-on-surface-secondary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-on-surface truncate">{row.department}</p>
                                    <p className="text-xs text-on-surface-secondary">Índice de Bienestar (FWI)</p>
                                </div>
                                <div className={`text-2xl font-bold ${text}`}>
                                    {value}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                 <div className="text-center py-16 text-on-surface-secondary">
                    <p>No hay datos disponibles para la selección actual.</p>
                </div>
            )}
        </div>
    );
};

export default WellnessHeatmapWidget;