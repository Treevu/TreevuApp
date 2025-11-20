
import React, { useState } from 'react';
import { XMarkIcon, CheckCircleIcon, SparklesIcon, UserGroupIcon, PlusIcon, BanknotesIcon, TagIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { TreevuLevel, OfferType } from '../types';
import { useStore } from '../contexts/Store';

export const CreateOfferModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { addOffer } = useStore();
    const [form, setForm] = useState({ title: '', description: '', discount: 10, cost: 100, isFlash: false });

    const handleSubmit = () => {
        addOffer({
            title: form.title,
            description: form.description,
            discount: Number(form.discount),
            costTreevus: Number(form.cost),
            isFlash: form.isFlash,
            type: OfferType.GLOBAL
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
            <div className="bg-surface p-6 rounded-2xl border border-white/10 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-white font-bold text-xl flex items-center gap-2"><TagIcon className="w-6 h-6 text-purple-400" /> Crear Oferta</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><XMarkIcon className="w-6 h-6" /></button>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-gray-400 font-bold uppercase block mb-1">Título de la Oferta</label>
                        <input 
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-purple-500 outline-none transition-colors" 
                            placeholder="Ej. 2x1 en Postres" 
                            value={form.title} 
                            onChange={e => setForm({...form, title: e.target.value})} 
                        />
                    </div>
                     <div>
                        <label className="text-xs text-gray-400 font-bold uppercase block mb-1">Descripción Corta</label>
                        <input 
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-purple-500 outline-none transition-colors" 
                            placeholder="Ej. Válido martes y jueves..." 
                            value={form.description} 
                            onChange={e => setForm({...form, description: e.target.value})} 
                        />
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-xs text-gray-400 font-bold uppercase block mb-1">Descuento %</label>
                            <input type="number" className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-purple-500 outline-none" value={form.discount} onChange={e => setForm({...form, discount: Number(e.target.value)})} />
                        </div>
                        <div className="flex-1">
                            <label className="text-xs text-gray-400 font-bold uppercase block mb-1">Costo (Treevüs)</label>
                            <input type="number" className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-purple-500 outline-none" value={form.cost} onChange={e => setForm({...form, cost: Number(e.target.value)})} />
                        </div>
                    </div>
                    
                    <div 
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${form.isFlash ? 'bg-purple-500/20 border-purple-500' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                        onClick={() => setForm({...form, isFlash: !form.isFlash})}
                    >
                        <div className="flex items-center justify-center w-5 h-5 border border-gray-500 rounded">
                             {form.isFlash && <CheckCircleIcon className="w-4 h-4 text-white bg-purple-500" />}
                        </div>
                        <div>
                            <span className={`text-sm font-bold ${form.isFlash ? 'text-purple-300' : 'text-gray-300'}`}>Oferta Relámpago (Flash)</span>
                            <p className="text-[10px] text-gray-500">Dura 2 horas y aparece destacada.</p>
                        </div>
                        <SparklesIcon className={`w-5 h-5 ml-auto ${form.isFlash ? 'text-purple-400 animate-pulse' : 'text-gray-600'}`} />
                    </div>
                </div>

                <div className="flex gap-3 mt-8">
                    <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 text-sm font-bold hover:bg-white/5 transition-colors">Cancelar</button>
                    <button onClick={handleSubmit} className="flex-1 py-3 rounded-xl bg-purple-500 text-white text-sm font-bold hover:bg-purple-400 shadow-lg shadow-purple-500/20 transition-colors">Publicar Oferta</button>
                </div>
            </div>
        </div>
    );
};

export const ContributeGoalModal: React.FC<{ goalId: string | null; onClose: () => void }> = ({ goalId, onClose }) => {
    const { contributeToGoal, savingsGoals } = useStore();
    const goal = savingsGoals.find(g => g.id === goalId);
    const [amount, setAmount] = useState(50);

    if (!goal) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
            <div className="bg-surface p-6 rounded-2xl border border-white/10 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="text-center mb-6">
                    <div className="w-16 h-16 mx-auto bg-blue-500/20 rounded-full flex items-center justify-center mb-3">
                        <BanknotesIcon className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="text-white font-bold text-xl">Aportar a {goal.title}</h3>
                    <p className="text-blue-400 text-xs font-bold mt-1">Falta: S/ {goal.targetAmount - goal.currentAmount}</p>
                </div>
                
                <div className="mb-6">
                    <label className="text-xs text-gray-400 font-bold uppercase block mb-2 text-center">Monto a Aportar</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">S/</span>
                        <input type="number" className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 pl-10 pr-4 text-white text-3xl font-bold text-center focus:border-blue-500 outline-none transition-colors" value={amount} onChange={e => setAmount(Number(e.target.value))} />
                    </div>
                </div>

                <div className="flex gap-2 mb-8">
                     {[20, 50, 100].map(val => (
                         <button key={val} onClick={() => setAmount(val)} className="flex-1 py-2 bg-white/5 border border-white/5 rounded-lg text-xs font-bold text-gray-300 hover:bg-blue-500/20 hover:border-blue-500/50 hover:text-white transition-all">+S/{val}</button>
                     ))}
                </div>

                <button onClick={() => { contributeToGoal(goalId!, amount); onClose(); }} className="w-full py-3 rounded-xl bg-blue-500 text-white text-sm font-bold hover:bg-blue-400 shadow-lg shadow-blue-500/20 transition-colors">Confirmar Aporte</button>
            </div>
        </div>
    );
};

export const BudgetConfigModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { user, updateMonthlyBudget } = useStore();
    const [amount, setAmount] = useState(user.monthlyBudget);

    const handleSave = () => {
        if (amount > 0) {
            updateMonthlyBudget(amount);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
            <div className="bg-surface p-6 rounded-2xl border border-white/10 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        <CurrencyDollarIcon className="w-6 h-6 text-emerald-400" /> Configurar Presupuesto
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><XMarkIcon className="w-6 h-6" /></button>
                </div>
                
                <p className="text-sm text-gray-400 mb-6">Define tu límite de gasto mensual para que la IA pueda alertarte de desviaciones.</p>

                <div className="mb-8">
                    <label className="text-xs text-gray-400 font-bold uppercase block mb-2">Monto Mensual (S/)</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">S/</span>
                        <input 
                            type="number" 
                            className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-10 pr-4 text-white text-3xl font-bold focus:border-emerald-500 outline-none transition-colors" 
                            value={amount} 
                            onChange={e => setAmount(Number(e.target.value))} 
                        />
                    </div>
                </div>

                <button onClick={handleSave} className="w-full bg-emerald-500 text-black font-bold py-3 rounded-xl hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 transition-colors">
                    Actualizar Presupuesto
                </button>
            </div>
        </div>
    );
};

export const RedemptionModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
    <div className="bg-surface p-6 rounded-xl border border-white/10 max-w-sm w-full" onClick={e => e.stopPropagation()}>
      <h3 className="text-white font-bold text-center">Canje Exitoso</h3>
      <div className="flex justify-center my-4"><CheckCircleIcon className="w-12 h-12 text-emerald-500" /></div>
      <button onClick={onClose} className="mt-4 w-full bg-gray-700 text-white font-bold py-2 rounded-lg">Cerrar</button>
    </div>
  </div>
);

export const FileImportModal: React.FC<{ onClose: () => void }> = ({ onClose }) => null;

const SquadSelectionModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { squads, joinSquad } = useStore();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
             <div className="bg-surface p-6 rounded-2xl border border-white/10 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-white font-bold text-xl">Únete a un Squad</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><XMarkIcon className="w-6 h-6" /></button>
                </div>
                <p className="text-gray-400 text-sm mb-4">Elige un equipo y empieza a sumar puntos.</p>
                
                <div className="space-y-3">
                    {squads.map(sq => (
                        <div key={sq.id} className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between hover:bg-white/10 transition-colors">
                             <div className="flex items-center gap-3">
                                 <img src={sq.avatarUrl} className="w-10 h-10 rounded-full bg-black/30" />
                                 <div>
                                     <h4 className="font-bold text-white">{sq.name}</h4>
                                     <p className="text-xs text-gray-400">{sq.totalTreevus} puntos • Rango #{sq.rank}</p>
                                 </div>
                             </div>
                             <button 
                                onClick={() => { joinSquad(sq.id); onClose(); }} 
                                className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg hover:bg-emerald-500 hover:text-black transition-colors"
                             >
                                Unirme
                             </button>
                        </div>
                    ))}
                </div>
             </div>
        </div>
    );
};

export const SquadZone: React.FC = () => {
  const { user, userSquad } = useStore();
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  // If user has no squad, show CTA
  if (!userSquad) {
      return (
          <>
            {isJoinModalOpen && <SquadSelectionModal onClose={() => setIsJoinModalOpen(false)} />}
            <div className="p-6 bg-white/5 rounded-xl border border-dashed border-white/20 mt-6 text-center hover:bg-white/10 transition-colors cursor-pointer" onClick={() => setIsJoinModalOpen(true)}>
                <UserGroupIcon className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                <h3 className="text-white font-bold text-lg">¿Aún no tienes equipo?</h3>
                <p className="text-gray-400 text-sm mb-4">Únete a un Squad para desbloquear misiones y ganar más Treevüs.</p>
                <button className="px-6 py-2 bg-emerald-500 text-black font-bold rounded-full hover:scale-105 transition-transform shadow-lg">
                    Buscar Squad
                </button>
            </div>
          </>
      );
  }

  return (
    <div className="p-4 bg-white/5 rounded-xl border border-white/10 mt-6 relative overflow-visible group">
         {/* Tooltip */}
         <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-xs text-white px-2 py-1 rounded pointer-events-none whitespace-nowrap z-50">
             Tu equipo actual. Cumple misiones para subir de rango.
         </div>

        {/* Background Mask Container with Overflow Hidden */}
        <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none z-0">
            <div className="absolute -top-2 -right-2 p-2 opacity-10 rotate-12">
                <UserGroupIcon className="w-28 h-28 text-white" />
            </div>
        </div>

        <div className="flex items-center gap-2 mb-2 relative z-10">
            <UserGroupIcon className="w-5 h-5 text-emerald-400" />
            <h3 className="text-white font-bold">{userSquad.name}</h3>
            <span className="ml-auto text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">#{userSquad.rank}</span>
        </div>
        
        <div className="space-y-2 relative z-10 mb-4">
            {userSquad.missions.slice(0, 1).map(m => (
                <div key={m.id} className="bg-black/20 p-2 rounded-lg border border-white/5">
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-300">{m.icon} {m.title}</span>
                        <span className="text-gray-400">{m.progress}/{m.target}</span>
                    </div>
                    <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-accent h-full" style={{ width: `${(m.progress / m.target) * 100}%` }}></div>
                    </div>
                </div>
            ))}
        </div>

        <div className="flex -space-x-2 relative z-10 items-center">
            {userSquad.members.map((m, i) => (
                <img key={i} className="w-8 h-8 rounded-full border-2 border-black bg-gray-800" src={m.avatar} title={m.name} />
            ))}
            <button className="w-8 h-8 rounded-full border-2 border-black bg-gray-700 flex items-center justify-center text-white hover:bg-gray-600 transition-colors">
                <PlusIcon className="w-4 h-4" />
            </button>
        </div>
    </div>
  );
};

export const LevelUpModal: React.FC<{ level: TreevuLevel; onClose: () => void }> = ({ level, onClose }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" onClick={onClose}>
        <div className="relative w-full max-w-sm bg-surface border border-accent rounded-3xl p-8 text-center overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="absolute inset-0 bg-gradient-to-b from-accent/20 to-transparent"></div>
            {/* Confetti Element */}
            <div className="confetti" style={{ left: '20%' }}></div>
            <div className="confetti" style={{ left: '50%', animationDelay: '1s' }}></div>
            <div className="confetti" style={{ left: '80%', animationDelay: '0.5s' }}></div>
            
            <h2 className="text-4xl font-bold text-accent mb-2 relative z-10">¡Nivel Up!</h2>
            <p className="text-white text-lg font-bold mb-6 relative z-10">Ahora eres {level}</p>
            
            <div className="w-32 h-32 mx-auto bg-emerald-500/20 rounded-full flex items-center justify-center mb-8 relative z-10 shadow-[0_0_40px_rgba(52,211,153,0.4)] animate-pulse-slow">
                <span className="text-6xl">🌳</span>
            </div>
            
            <button onClick={onClose} className="w-full py-3 bg-accent text-black font-bold rounded-xl hover:scale-105 transition-transform relative z-10">
                ¡Genial!
            </button>
        </div>
    </div>
);

export const AIChatOverlay: React.FC = () => {
  const { toggleChat } = useStore();
  
  return (
    <div className="fixed bottom-24 right-4 w-80 h-96 bg-surface/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden animate-slideUp">
        <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 text-white" />
                <h3 className="text-white font-bold text-sm">Asistente Treevü</h3>
            </div>
            <button onClick={() => toggleChat(false)} className="p-1 rounded-full hover:bg-white/20 text-white transition-colors">
                <XMarkIcon className="w-5 h-5" />
            </button>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
            <div className="flex gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 text-xs">AI</div>
                <div className="bg-white/10 rounded-r-xl rounded-bl-xl p-3 text-xs text-gray-200 max-w-[80%]">
                    Hola, soy tu copiloto financiero. ¿En qué te ayudo hoy?
                </div>
            </div>
        </div>
        <div className="p-3 border-t border-white/10">
            <input type="text" placeholder="Escribe algo..." className="w-full bg-black/20 border border-white/10 rounded-full px-4 py-2 text-xs text-white outline-none focus:border-indigo-500" />
        </div>
    </div>
  );
};
    