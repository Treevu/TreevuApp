
import React, { useState, useRef } from 'react';
import { useStore } from '../contexts/Store';
import { UserRole } from '../types';
import { QrCodeIcon, WifiIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const TreevuCard: React.FC = () => {
  const { user, role, companyKPIs, offers, hourlyTraffic, expenses, toggleBudgetModal } = useStore();
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // --- CONFIGURATION BASED ON ROLE ---
  const getConfig = () => {
    switch (role) {
      case UserRole.EMPLOYER:
        return {
          theme: 'blue',
          gradient: 'from-slate-900 via-blue-900 to-slate-900',
          border: 'border-blue-500/30',
          accent: 'text-blue-400',
          title: 'CORPORATE KEY',
          chipColor: 'bg-gradient-to-br from-blue-200 to-blue-400',
          frontData: {
            label1: 'EMPRESA',
            val1: 'TechCorp Inc.',
            label2: 'PLAN',
            val2: user.subscriptionTier
          },
          backData: [
            { l: 'AHORRO RETENCIÓN', v: `S/ ${(companyKPIs.retentionSavings / 1000).toFixed(1)}k` },
            { l: 'RIESGO FUGA', v: `${companyKPIs.flightRiskScore}%`, color: 'text-red-400' },
            { l: 'FWI GLOBAL', v: companyKPIs.avgFWI }
          ]
        };
      case UserRole.MERCHANT:
        return {
          theme: 'purple',
          gradient: 'from-gray-900 via-purple-900 to-gray-900',
          border: 'border-purple-500/30',
          accent: 'text-purple-400',
          title: 'MERCHANT PLATINUM',
          chipColor: 'bg-gradient-to-br from-purple-200 to-fuchsia-400',
          frontData: {
            label1: 'COMERCIO',
            val1: user.name || 'Mi Negocio',
            label2: 'MIEMBRO DESDE',
            val2: '2023'
          },
          backData: [
            { l: 'INGRESOS', v: `S/ ${offers.reduce((a,b)=>a+(b.revenueGenerated||0),0)}` },
            { l: 'REDENCIONES', v: offers.reduce((a,b)=>a+b.redemptions,0) },
            { l: 'TRÁFICO HOY', v: hourlyTraffic.reduce((a,b)=>a+b.volume,0) }
          ]
        };
      case UserRole.EMPLOYEE:
      default:
        // Calculate Budget Dynamics for B2C Card
        const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
        const remaining = user.monthlyBudget - totalSpent;
        const usagePct = user.monthlyBudget > 0 ? (totalSpent / user.monthlyBudget) * 100 : 0;
        const isOverBudget = remaining < 0;
        const isZeroBudget = user.monthlyBudget === 0;
        
        // Strategy: "Dinero Inmediato" - Mock retrieved value from offers
        const mockSavings = 45.00; 

        return {
          theme: 'emerald',
          gradient: 'from-gray-900 via-emerald-900 to-gray-900',
          border: 'border-emerald-500/30',
          accent: 'text-emerald-400',
          title: 'THE WEALTH PASS',
          chipColor: 'bg-gradient-to-br from-yellow-200 to-yellow-500',
          isFounder: true, // Flag for Founder Badge
          frontData: {
            label1: 'MIEMBRO',
            val1: user.name,
            label2: 'NIVEL',
            val2: user.level.toUpperCase()
          },
          backData: [
            { 
                l: 'DISPONIBLE (PPT)', 
                v: isZeroBudget ? 'DEFINIR LÍMITE' : `S/ ${remaining.toFixed(2)}`, 
                size: 'text-2xl', 
                color: isZeroBudget ? 'text-yellow-400 animate-pulse' : (isOverBudget ? 'text-red-400' : 'text-emerald-400'),
                subText: isZeroBudget ? 'Toca para configurar' : `${usagePct.toFixed(0)}% Usado`,
                action: () => toggleBudgetModal(true)
            },
            { 
                l: 'AHORRO RECUPERADO', 
                v: `S/ ${mockSavings.toFixed(2)}`, 
                color: 'text-yellow-400',
                subText: 'En ofertas este mes' 
            },
            { l: 'FWI SCORE', v: user.fwiScore }
          ]
        };
    }
  };

  const config = getConfig();

  // --- PHYSICS ENGINE ---
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation (Max 15deg)
    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div className="w-full max-w-md mx-auto perspective-1000 my-6 group z-20 relative">
        {/* Floating Animation Wrapper */}
        <div className="animate-float"> 
            <div
                ref={cardRef}
                onClick={() => setIsFlipped(!isFlipped)}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={handleMouseLeave}
                className={`
                    relative w-full aspect-[1.586/1] rounded-2xl transition-transform duration-500 transform-style-3d cursor-pointer
                    ${isFlipped ? 'rotate-y-180' : ''}
                `}
                style={{
                    transform: `
                        rotateX(${rotation.x}deg) 
                        rotateY(${rotation.y + (isFlipped ? 180 : 0)}deg)
                        scale3d(${isHovering ? 1.02 : 1}, ${isHovering ? 1.02 : 1}, 1)
                    `
                }}
            >
                {/* --- FRONT FACE --- */}
                <div className={`absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br ${config.gradient} border ${config.border} shadow-2xl overflow-hidden backface-hidden`}>
                    {/* Holographic Sheen Overlay */}
                    <div 
                        className="absolute inset-0 opacity-40 pointer-events-none mix-blend-overlay"
                        style={{
                            background: `linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.4) ${40 + (rotation.y)}%, transparent 60%)`
                        }}
                    />
                    
                    {/* Texture Noise */}
                    <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

                    {/* STRATEGY 4: FOUNDER STATUS (PREMIUM LOOK) */}
                    {(config as any).isFounder && (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 text-black text-[9px] font-extrabold px-4 py-1 rounded-full tracking-[0.2em] shadow-[0_0_20px_rgba(250,204,21,0.6)] z-20 border border-white/50">
                            MIEMBRO FUNDADOR
                        </div>
                    )}

                    {/* Content Container */}
                    <div className="relative z-10 p-6 flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start mt-4">
                            {/* Chip & Signal */}
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-8 rounded-md ${config.chipColor} shadow-inner border border-white/20 relative overflow-hidden`}>
                                    <div className="absolute inset-0 border border-black/10 rounded-md opacity-50 flex">
                                        <div className="w-1/3 h-full border-r border-black/10"></div>
                                        <div className="h-1/2 w-full border-b border-black/10 absolute top-1/4"></div>
                                    </div>
                                </div>
                                <WifiIcon className="w-6 h-6 text-white/50 rotate-90" />
                            </div>
                            <div className="text-right">
                                <h3 className="text-white font-bold italic tracking-widest text-lg">treevü</h3>
                                <p className={`text-[10px] font-bold tracking-[0.2em] ${config.accent}`}>{config.title}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                             <div className="text-xl tracking-widest text-white/80 font-mono shadow-black drop-shadow-md">
                                 **** **** **** <span className="text-white">8842</span>
                             </div>
                        </div>

                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">{config.frontData.label1}</p>
                                <p className="text-sm text-white font-medium tracking-wide shadow-black drop-shadow-md uppercase">{config.frontData.val1}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">{config.frontData.label2}</p>
                                <p className={`text-sm font-bold tracking-wide shadow-black drop-shadow-md uppercase ${config.accent}`}>{config.frontData.val2}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- BACK FACE --- */}
                <div className={`absolute inset-0 w-full h-full rounded-2xl bg-gray-900 border ${config.border} shadow-2xl overflow-hidden backface-hidden rotate-y-180`}>
                     {/* Magnetic Strip */}
                     <div className="w-full h-10 bg-black mt-6 relative">
                         <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 opacity-80"></div>
                     </div>

                     <div className="p-6 mt-0 flex justify-between items-center h-48">
                         <div className="flex-1 space-y-3">
                             {config.backData.map((item: any, idx) => (
                                 <div 
                                    key={idx} 
                                    className={`flex justify-between items-end border-b border-white/5 pb-1 ${item.action ? 'cursor-pointer hover:bg-white/5 rounded px-1 -mx-1 transition-colors' : ''}`}
                                    onClick={(e) => {
                                        if (item.action) {
                                            e.stopPropagation();
                                            item.action();
                                        }
                                    }}
                                 >
                                     <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{item.l}</span>
                                     <div className="text-right">
                                         <div className={`font-mono font-bold ${item.color || 'text-white'} ${item.size || 'text-sm'}`}>{item.v}</div>
                                         {item.subText && <div className="text-[9px] text-gray-400">{item.subText}</div>}
                                     </div>
                                 </div>
                             ))}
                         </div>
                         <div className="ml-4 flex flex-col items-center justify-center gap-3 border-l border-white/10 pl-4">
                             {/* STRATEGY 3: PRIVACY VAULT UI */}
                             {role === UserRole.EMPLOYEE && (
                                 <div className="flex flex-col items-center text-center opacity-60">
                                     <ShieldCheckIcon className="w-8 h-8 text-emerald-400 mb-1" />
                                     <p className="text-[7px] text-emerald-400 font-bold uppercase leading-tight">BÚNKER<br/>DE DATOS</p>
                                     <p className="text-[6px] text-gray-500 uppercase mt-1">OFFLINE MODE</p>
                                 </div>
                             )}
                             {role !== UserRole.EMPLOYEE && (
                                <div className="bg-white p-1 rounded">
                                    <QrCodeIcon className="w-12 h-12 text-black" />
                                </div>
                             )}
                         </div>
                     </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default TreevuCard;
