import React from 'react';
import { DocumentArrowDownIcon } from '../Icons';

interface EmployerExportButtonProps {
    data: any; // The aggregated dashboard data
    filename?: string;
}

const EmployerExportButton: React.FC<EmployerExportButtonProps> = ({ data, filename = 'treevu_reporte_consolidado.csv' }) => {
    
    const convertToCSV = (kpiData: any): string => {
        const headers = ["Métrica", "Valor"];
        
        const rows = [
            ["Índice de Bienestar Financiero (FWI)", kpiData.financialWellnessIndex.toFixed(1)],
            ["Índice de Formalidad (%)", kpiData.formalityScore.toFixed(1)],
            ["Balance Vida-Trabajo (%)", kpiData.workLifeBalanceScore.toFixed(1)],
            ["Desarrollo Profesional (%)", kpiData.selfDevScore.toFixed(1)],
            ["Tasa de Activación (%)", kpiData.activationRate.toFixed(1)],
            ["Riesgo de Fuga de Talento", kpiData.talentFlightRisk],
            ["ROI del Programa (x)", kpiData.roiMultiplier.toFixed(1)],
            ["Gasto Promedio por Colaborador (S/)", kpiData.avgSpendingPerUser.toFixed(2)],
            ["Tasa de Canje de Beneficios (%)", kpiData.redemptionRate.toFixed(1)],
            ["Adopción de Metas de Ahorro (%)", kpiData.goalAdoptionRate.toFixed(1)],
        ];

        return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    };

    const handleExport = () => {
        if (!data || data.isEmpty) {
            return;
        }

        const csvString = convertToCSV(data);
        const blob = new Blob([`\uFEFF${csvString}`], { type: 'text/csv;charset=utf-8;' });
        
        const link = document.createElement('a');
        if (link.download !== undefined) { 
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    };

    return (
        <button
            onClick={handleExport}
            disabled={!data || data.isEmpty}
            className="flex items-center text-sm font-semibold text-primary hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Exportar reporte consolidado a CSV"
        >
            <DocumentArrowDownIcon className="w-5 h-5 mr-1.5" />
            Exportar Reporte
        </button>
    );
};

export default EmployerExportButton;