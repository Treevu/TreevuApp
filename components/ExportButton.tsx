import React from 'react';
import { DocumentArrowDownIcon } from './Icons';
import { useAuth } from '../contexts/AuthContext';
import { useExpenses } from '../contexts/ExpensesContext';
import { useGoals } from '../contexts/GoalsContext';
import { useBudget } from '../contexts/BudgetContext';
import { levelData } from '../services/gamificationService';

interface ExportButtonProps {
    filename?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({ filename = 'mi_reporte_treevu.txt' }) => {
    const { user } = useAuth();
    const { expenses } = useExpenses();
    const { goals } = useGoals();
    const { budget, annualIncome } = useBudget();

    const generateFullReport = (): string => {
        if (!user) return "Error: Usuario no encontrado.";

        const now = new Date();
        const reportDate = now.toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' });
        const reportTime = now.toLocaleTimeString('es-PE');

        // Explanatory Header
        let report = `REPORTE GENERAL DE DATOS - treevü\n`;
        report += `=======================================\n\n`;
        report += `¡Hola, ${user.name}!\n\n`;
        report += `Este es tu reporte de datos personal generado desde la app treevü el ${reportDate} a las ${reportTime}.\n`;
        report += `Aquí encontrarás toda la información que has registrado, desde tu perfil y metas hasta cada uno de tus movimientos financieros.\n`;
        report += `Recuerda: esta información es tuya y se guarda de forma segura en tu dispositivo.\n\n`;

        // Section 1: Profile Summary
        report += `--- 1. RESUMEN DE PERFIL ---\n`;
        report += `Nombre: ${user.name}\n`;
        report += `Email: ${user.email}\n`;
        report += `Nivel: ${user.level} (${user.level ? levelData[user.level]?.name : 'N/A'})\n`;
        report += `Treevüs: ${user.treevus.toLocaleString('es-PE')}\n`;
        report += `Racha Actual: ${user.streak?.count || 0} días\n`;
        report += `Perfil Completo: ${user.isProfileComplete ? 'Sí' : 'No'}\n\n`;
        
        // Section 2: Financial Summary
        report += `--- 2. RESUMEN FINANCIERO ---\n`;
        report += `Presupuesto Mensual: ${budget ? `S/ ${budget.toLocaleString('es-PE')}` : 'No establecido'}\n`;
        report += `Ingreso Anual Bruto: ${annualIncome ? `S/ ${annualIncome.toLocaleString('es-PE')}` : 'No establecido'}\n`;
        const formalityIndex = user.progress.formalityIndex || 0;
        report += `Índice de Formalidad (FWI): ${formalityIndex.toFixed(1)}%\n\n`;

        // Section 3: Goals
        report += `--- 3. MIS PROYECTOS DE AHORRO ---\n`;
        if (goals.length > 0) {
            goals.forEach(goal => {
                const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
                report += `Proyecto: "${goal.name}" ${goal.icon}\n`;
                report += `  - Progreso: S/ ${goal.currentAmount.toLocaleString('es-PE')} de S/ ${goal.targetAmount.toLocaleString('es-PE')} (${progress.toFixed(1)}%)\n`;
                report += `  - Creado: ${new Date(goal.createdAt).toLocaleDateString('es-PE')}\n\n`;
            });
        } else {
            report += `Aún no has creado ningún proyecto de ahorro.\n\n`;
        }

        // Section 4: Expenses (CSV format)
        report += `--- 4. MIS MOVIMIENTOS ---\n`;
        if (expenses.length > 0) {
            const expenseHeaders = ["Fecha", "Comercio", "RUC", "Categoría", "Total (S/)", "Es Formal", "Ahorro Perdido (S/)", "IGV (S/)"];
            report += expenseHeaders.join(',') + '\n';
            expenses.forEach(exp => {
                const row = [
                    exp.fecha,
                    `"${exp.razonSocial.replace(/"/g, '""')}"`,
                    exp.ruc,
                    exp.categoria,
                    exp.total.toFixed(2),
                    exp.esFormal ? 'Si' : 'No',
                    exp.ahorroPerdido.toFixed(2),
                    exp.igv.toFixed(2)
                ];
                report += row.join(',') + '\n';
            });
            report += '\n';
        } else {
            report += `No tienes movimientos registrados.\n\n`;
        }
        
        // Section 5: Redeemed Rewards
        report += `--- 5. MIS RECOMPENSAS CANJEADAS ---\n`;
        if (user.redeemedRewards && user.redeemedRewards.length > 0) {
             user.redeemedRewards.forEach(reward => {
                report += `Recompensa: "${reward.title}" ${reward.icon}\n`;
                report += `  - Costo: ${reward.costInTreevus.toLocaleString('es-PE')} treevüs\n`;
                report += `  - Canjeado el: ${new Date(reward.date).toLocaleDateString('es-PE')}\n\n`;
            });
        } else {
            report += `Aún no has canjeado ninguna recompensa.\n\n`;
        }
        
        // Footer
        report += `=======================================\n`;
        report += `Fin del reporte. ¡Sigue cultivando tu bienestar financiero!\n`;

        return report;
    };

    const handleExport = () => {
        if (!user) return;

        const reportContent = generateFullReport();
        const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8;' });
        
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <button
            onClick={handleExport}
            disabled={!user}
            className="flex items-center text-sm font-semibold text-primary hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Exportar todos mis datos"
        >
            <DocumentArrowDownIcon className="w-5 h-5 mr-1.5" />
            Exportar Todo
        </button>
    );
};

export default ExportButton;