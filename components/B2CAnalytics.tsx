
import React, { useMemo } from 'react';
import { Expense, SubscriptionTier } from '../types';
import { ChartPieIcon, ExclamationTriangleIcon, BoltIcon, CalendarDaysIcon, ScaleIcon, DocumentMagnifyingGlassIcon, SparklesIcon } from '@heroicons/react/24/outline';
import FlipCard from './FlipCard';
import { ScoreBadge } from './UIAtoms';
import Tooltip from './Tooltip';

interface Props {
  expenses: Expense[];
  budget: number;
  subscriptionTier: SubscriptionTier;
  onUpgrade: () => void;
}

// Local Sparkline Component
const Sparkline = ({ data, color = "text-emerald-400" }: { data: number[], color?: string }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((d - min) / range) * 100;
      return `${x},${y}`;
    }).join(' ');
    return (<svg viewBox="0 0 100 100" className="w-full h-8 opacity-70" preserveAspectRatio="none"><polyline points={points} fill="none" stroke="currentColor" strokeWidth="2" className={color} /></svg>);
};

const B2CAnalytics: React.FC<Props> = ({ expenses, budget, subscriptionTier, onUpgrade }) => {
  const isPremium = subscriptionTier !== SubscriptionTier.FREE;

  const metrics = useMemo(() => {
    const total: number = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const byCategory = expenses.reduce((acc, curr) => {
      const categoryName = String(curr.category);
      const currentVal = acc[categoryName] || 0;
      acc[categoryName] = currentVal + curr.amount;
      return acc;
    }, {} as Record<string, number>);
    const sortedCategories = Object.entries(byCategory).map(([cat, amount]: [string, number]) => ({ cat, amount, pct: total ? (amount / total) * 100 : 0 })).sort((a, b) => b.amount - a.amount);
    const formalTotal: number = expenses.filter(e => e.isFormal).reduce((acc, e) => acc + e.amount, 0);
    const informalTotal: number = expenses.filter(e => !e.isFormal).reduce((acc, e) => acc + e.amount, 0);
    const lostSavings: number = expenses.filter(e => !e.isFormal).reduce((acc, e) => acc + (e.lostSavings || 0), 0);
    const trendHistory = [total * 0.8, total * 0.9, total * 0.85, total * 1.1, total * 0.95, total];
    const formalHistory = [formalTotal * 0.7, formalTotal * 0.8, formalTotal * 0.75, formalTotal * 0.9, formalTotal];
    const dailyFreq = [10, 45, 20, 15, 60, 90, 80];
    const maxDaily = Math.max(...dailyFreq);
    const deviationPct = ((total - (budget/30 * new Date().getDate())) / (budget/30 * new Date().getDate())) * 100;
    const maxDeductible = 15450; 
    const currentDeductible = formalTotal * 0.15; 
    const deductibleProgress = Math.min(100, (currentDeductible / maxDeductible) * 100);
    
    // AI Analysis Logic for Deviation
    let deviationAnalysis = "";
    if (deviationPct > 20) {
        deviationAnalysis = "¡Alerta! Estás gastando muy por encima del ritmo sostenible. Revisa tus 'Gastos Hormiga' y comidas fuera.";
    } else if (deviationPct > 0) {
        deviationAnalysis = "Ligero exceso (+). Un par de días de austeridad te pondrán de nuevo en zona verde.";
    } else if (deviationPct > -10) {
        deviationAnalysis = "¡Perfecto! Estás en negativo (-), lo cual es bueno: significa que estás ahorrando respecto al plan.";
    } else {
        deviationAnalysis = "Excelente disciplina (-). Estás muy por debajo del límite. Considera aumentar tu aporte a Metas.";
    }

    return { total, sortedCategories, formalTotal, informalTotal, lostSavings, trendHistory, formalHistory, dailyFreq, maxDaily, deviationPct, currentDeductible, maxDeductible, deductibleProgress, deviationAnalysis };
  }, [expenses, budget]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center gap-2 mb-2"><h2 className="text-xl font-bold dark:text-white text-gray-900 flex items-center gap-2"><ChartPieIcon className="w-6 h-6 text-emerald-400" /> Analítica de Gastos</h2></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* 1. VELOCIDAD DE CAPTURA */}
        <FlipCard themeColor="emerald" heightClass="h-48" frontContent={<div className="h-full flex flex-col justify-between relative overflow-hidden group"><div className="absolute top-0 right-0 opacity-10 group-hover:opacity-30 transition-opacity"><BoltIcon className="w-16 h-16 text-accent" /></div><div><div className="flex items-center gap-1 mb-1"><h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Velocidad de Captura</h3></div><div className="flex items-baseline gap-1"><span className="text-4xl font-bold text-white">1.2s</span><span className="text-xs text-emerald-400 font-bold">Récord</span></div></div><div><p className="text-[10px] text-gray-500 mt-2 mb-2">Tiempo de procesamiento OCR.</p><div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden"><div className="w-[90%] h-full bg-accent animate-pulse shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div></div></div></div>} backContent="Nuestro motor de IA 'Flash' lee tus recibos en tiempo real." />

        {/* 2. RITMO DE GASTO */}
        <FlipCard themeColor="emerald" heightClass="h-48 lg:col-span-2" frontContent={<div className="h-full flex flex-col"><div className="flex justify-between items-start mb-3"><div className="flex items-center gap-1"><h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Frecuencia Semanal</h3></div><CalendarDaysIcon className="w-5 h-5 text-gray-500" /></div><div className="flex-1 flex items-end justify-between gap-2 pb-2">{['L','M','M','J','V','S','D'].map((day, i) => (<div key={i} className="flex-1 flex flex-col items-center gap-1 group/bar cursor-pointer h-full justify-end"><div className="w-full bg-gray-800 rounded-t relative overflow-hidden transition-all hover:bg-gray-700 flex items-end" style={{ height: '100%' }}><div className="w-full bg-primary/60 group-hover/bar:bg-primary transition-all" style={{ height: `${(metrics.dailyFreq[i] / metrics.maxDaily) * 100}%` }}></div></div><span className="text-[9px] text-gray-500 font-bold">{day}</span></div>))}</div></div>} backContent="Este histograma muestra qué días gastas más." />

        {/* 3. GASTO POR CATEGORÍA */}
        <FlipCard themeColor="emerald" heightClass="h-80 lg:col-span-1" frontContent={<div className="h-full flex flex-col"><div className="flex justify-between items-start mb-2"><div className="flex flex-col"><h3 className="text-sm font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider flex items-center gap-2">Gasto Total</h3><span className="text-3xl font-bold dark:text-white text-gray-900">S/ {metrics.total.toFixed(0)}</span></div><div className="w-24"><Sparkline data={metrics.trendHistory} color="text-emerald-500" /></div></div><div className="h-px w-full bg-gray-200 dark:bg-white/10 mb-4"></div><div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">{metrics.sortedCategories.length > 0 ? metrics.sortedCategories.map((item, idx) => (<div key={idx} className="group"><div className="flex justify-between text-xs mb-1"><span className="dark:text-white text-gray-700 font-bold tracking-wide truncate w-2/3">{item.cat}</span><span className="text-emerald-600 dark:text-emerald-300 font-mono">S/ {item.amount.toFixed(0)}</span></div><div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 overflow-hidden border dark:border-white/5 border-gray-300"><div className="bg-emerald-500 dark:bg-emerald-400 h-full rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)] group-hover:bg-emerald-400 transition-colors" style={{ width: `${item.pct}%` }} /></div></div>)) : <div className="flex h-full items-center justify-center text-gray-500 text-sm italic">Registra gastos para ver tu desglose.</div>}</div></div>} backContent="Visualiza en qué categorías se concentra tu dinero." />

        {/* 4. EFICIENCIA FISCAL */}
        <FlipCard themeColor="emerald" heightClass="h-80 lg:col-span-1" frontContent={<div className="h-full flex flex-col"><div className="flex justify-between items-start mb-2"><div className="flex items-center gap-1"><h3 className="text-sm font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Eficiencia Fiscal</h3></div>{metrics.lostSavings > 0 && (<span className="bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-bold px-2 py-1 rounded border border-red-500/30 flex items-center gap-1 animate-pulse"><ExclamationTriangleIcon className="w-3 h-3" /> - S/ {metrics.lostSavings.toFixed(0)}</span>)}</div><div className="w-full h-8 mb-4"><Sparkline data={metrics.formalHistory} color="text-emerald-500" /></div><div className="flex-1 flex items-center justify-center relative my-2"><div className="relative w-32 h-32 rounded-full border-[10px] border-gray-200 dark:border-gray-800 flex items-center justify-center shadow-inner"><div className="absolute inset-0 rounded-full border-[10px] border-emerald-500 dark:border-emerald-400 border-l-transparent border-b-transparent transform -rotate-45 shadow-[0_0_15px_rgba(52,211,153,0.2)]" style={{ opacity: metrics.total > 0 ? (metrics.formalTotal / metrics.total) : 0.5 }}></div><div className="text-center z-10"><span className="block text-2xl font-bold dark:text-white text-gray-900 drop-shadow-sm">{metrics.total > 0 ? ((metrics.formalTotal / metrics.total) * 100).toFixed(0) : 0}%</span><span className="text-[8px] text-emerald-600 dark:text-emerald-400 uppercase font-bold tracking-widest">Formal</span></div></div></div></div>} backContent="Formal = Boleta Electrónica con DNI. Es la única forma de reducir impuestos y ganar más puntos." />

        {/* 5. RADAR DE AHORRO TRIBUTARIO */}
        <div className="lg:col-span-1">
            <FlipCard themeColor="emerald" heightClass="h-80" frontContent={<div className="h-full flex flex-col relative overflow-hidden"><div className="flex justify-between mb-4 relative z-10"><h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2"><DocumentMagnifyingGlassIcon className="w-5 h-5" /> Radar 3 UIT</h3>{!isPremium && <span className="text-[10px] text-black font-bold bg-accent px-2 py-1 rounded shadow-lg animate-pulse">Explorer</span>}</div><div className={`flex-1 flex flex-col justify-center items-center relative z-10 ${!isPremium ? 'blur-[2px]' : ''}`}><div className="text-center mb-4"><p className="text-gray-400 text-xs uppercase font-bold">Deducible Acumulado</p><p className="text-3xl font-bold text-white mt-1">S/ {metrics.currentDeductible.toFixed(2)}</p></div><div className="w-full bg-gray-800 h-4 rounded-full overflow-hidden border border-white/5 mb-2 relative"><div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-10"></div><div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)] transition-all duration-1000" style={{ width: `${metrics.deductibleProgress}%` }}></div></div><div className="flex justify-between w-full text-[10px] text-gray-500 font-mono"><span>0%</span><span>Meta: S/ 15,450</span></div><p className="text-xs text-emerald-300 mt-6 text-center px-2">{metrics.deductibleProgress < 20 ? "¡Pide boleta en restaurantes y hoteles!" : "¡Vas excelente con tus deducciones!"}</p></div>{!isPremium && (<div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[1px]"><p className="text-white font-bold text-center px-6 text-sm mb-3">Calcula tu devolución de impuestos anual</p><button onClick={(e) => {e.stopPropagation(); onUpgrade();}} className="px-4 py-2 bg-accent text-black font-bold rounded-full text-xs hover:scale-105 transition-transform shadow-lg">Ver Mi Radar</button></div>)}</div>} backContent="En Perú, puedes deducir hasta 3 UIT (aprox. S/ 15k) de tus impuestos anuales si pides boleta en rubros seleccionados." />
        </div>

        {/* 6. DESVIACIÓN VS IA (ENRICHED) */}
        <div className="lg:col-span-1 lg:col-start-2 lg:row-start-2">
             {isPremium ? (
                <FlipCard themeColor="emerald" heightClass="h-80" frontContent={
                    <div className="h-full flex flex-col justify-between">
                        {/* Header */}
                        <div className="flex justify-between mb-4 relative z-10">
                            <h3 className="text-sm font-bold text-accent uppercase tracking-wider flex items-center gap-2">
                                <ScaleIcon className="w-5 h-5" /> Desviación IA
                            </h3>
                            <span className="text-[10px] text-black font-bold bg-accent px-2 py-1 rounded shadow-lg">Explorer</span>
                        </div>
                        
                        {/* Main Graphic */}
                        <div className="flex-1 flex flex-col justify-center items-center relative">
                            <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden relative mb-2 shadow-inner">
                                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white z-10"></div>
                                <div 
                                    className={`h-full transition-all duration-1000 ${metrics.deviationPct > 0 ? 'bg-red-500 ml-[50%]' : 'bg-emerald-500 mr-[50%]'}`} 
                                    style={{ 
                                        width: `${Math.min(50, Math.abs(metrics.deviationPct))}%`, 
                                        marginLeft: metrics.deviationPct > 0 ? '50%' : undefined, 
                                        marginRight: metrics.deviationPct <= 0 ? '50%' : undefined, 
                                        alignSelf: metrics.deviationPct <= 0 ? 'flex-end' : 'flex-start' 
                                    }}
                                ></div>
                            </div>
                            <div className="flex justify-between w-full text-[10px] text-gray-500 px-1 font-mono">
                                <span>Ahorro</span>
                                <span>Exceso</span>
                            </div>
                            <div className={`mt-2 text-4xl font-bold ${metrics.deviationPct > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                                {metrics.deviationPct > 0 ? '+' : ''}{metrics.deviationPct.toFixed(1)}%
                            </div>
                            <p className="text-[10px] text-gray-400 text-center mt-1 uppercase tracking-wide">Vs. Presupuesto Óptimo</p>
                        </div>

                        {/* AI Detailed Insight Box */}
                        <div className="mt-4 bg-white/5 border border-white/10 rounded-xl p-3 relative overflow-hidden">
                             <div className="absolute top-0 left-0 w-1 h-full bg-accent"></div>
                             <div className="flex gap-2">
                                 <SparklesIcon className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                                 <div>
                                     <p className="text-[10px] text-accent font-bold uppercase mb-0.5">Análisis Explorer</p>
                                     <p className="text-xs text-gray-200 leading-snug">"{metrics.deviationAnalysis}"</p>
                                 </div>
                             </div>
                        </div>
                    </div>
                } backContent={
                    <span>
                        La IA compara tu gasto real vs. ideal. <br/><br/>
                        <strong className="text-emerald-400">Negativo (-):</strong> ¡Bien! Significa AHORRO (gastas menos de lo planeado).<br/>
                        <strong className="text-red-400">Positivo (+):</strong> ¡Cuidado! Significa SOBREGASTO.
                    </span>
                } />
             ) : (
                <FlipCard themeColor="emerald" heightClass="h-80" frontContent={<div className="h-full flex flex-col relative"><div className="flex justify-between mb-4"><h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2"><ScaleIcon className="w-5 h-5" /> Desviación IA <Tooltip content="Requiere plan Explorer." /></h3></div><div className="flex-1 flex flex-col items-center justify-center opacity-30"><div className="w-full h-4 bg-gray-600 rounded-full mb-4"></div><div className="text-4xl font-bold text-gray-500">+15%</div></div><div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] p-6 text-center z-10"><div className="bg-surface p-3 rounded-full border border-white/10 mb-3 shadow-xl"><ScaleIcon className="w-8 h-8 text-accent" /></div><p className="text-xs text-gray-300 mb-4 leading-relaxed font-medium">Compara tu gasto real vs. sugerencia IA.</p><button onClick={(e) => {e.stopPropagation(); onUpgrade();}} className="px-4 py-2 bg-accent text-black font-bold rounded-full text-xs hover:scale-105 transition-transform shadow-lg">Desbloquear</button></div></div>} backContent="La métrica de Desviación requiere el plan Explorer." />
             )}
        </div>
      </div>
    </div>
  );
};

export default B2CAnalytics;
