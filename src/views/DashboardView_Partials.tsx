
import React, { useState, useRef, useEffect } from 'react';
import { XMarkIcon, CheckCircleIcon, SparklesIcon, UserGroupIcon, PlusIcon, BanknotesIcon, TagIcon, CurrencyDollarIcon, PencilIcon, CalendarDaysIcon, BuildingStorefrontIcon, ArrowRightIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { TreevuLevel, OfferType, UserRole, ExpenseCategory } from '@/types';
import { useStore } from '@/contexts/Store';

// ... (Previous exports: CreateOfferModal, ManualExpenseModal, ContributeGoalModal, BudgetConfigModal, RedemptionModal, FileImportModal, SquadSelectionModal, SquadZone, LevelUpModal, OnboardingTour) ...

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
            <div className="bg-surface p-6 rounded-2xl border border-white/10 w-[95%] max-w-md shadow-2xl m-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
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

export const ManualExpenseModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { addExpense } = useStore();
    const [amount, setAmount] = useState('');
    const [merchant, setMerchant] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [isFormal, setIsFormal] = useState(false);
    const [category, setCategory] = useState<ExpenseCategory>(ExpenseCategory.OTHER);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = () => {
        if (!amount || !merchant) return;
        const numAmount = parseFloat(amount);
        if (numAmount <= 0) return;

        setIsSubmitting(true);

        // Simulate API latency
        setTimeout(() => {
            addExpense({
                merchant,
                amount: numAmount,
                date,
                category,
                isFormal,
                ruc: isFormal ? 'MANUAL_ENTRY' : undefined
            });
            setIsSubmitting(false);
            onClose();
        }, 600);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
            <div className="bg-surface p-6 rounded-2xl border border-white/10 w-[95%] max-w-sm shadow-2xl m-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-white font-bold text-xl flex items-center gap-2">
                        <PencilIcon className="w-6 h-6 text-emerald-400" /> Registro Manual
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><XMarkIcon className="w-6 h-6" /></button>
                </div>

                <div className="space-y-4">
                    {/* Amount */}
                    <div className="relative">
                         <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">S/</span>
                         <input 
                            type="number" 
                            className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-10 pr-4 text-white text-3xl font-bold focus:border-emerald-500 outline-none transition-colors text-center" 
                            placeholder="0.00"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            autoFocus
                            min="0.1"
                            step="0.1"
                         />
                    </div>

                    {/* Merchant */}
                    <div>
                        <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Comercio</label>
                        <div className="relative">
                            <BuildingStorefrontIcon className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
                            <input 
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-9 pr-3 text-white text-sm focus:border-emerald-500 outline-none" 
                                placeholder="Ej. Bodega Pepe" 
                                value={merchant}
                                onChange={e => setMerchant(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Date & Category */}
                    <div className="flex gap-3">
                         <div className="flex-1">
                            <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Fecha</label>
                            <input 
                                type="date"
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-white text-sm focus:border-emerald-500 outline-none" 
                                value={date}
                                onChange={e => setDate(e.target.value)}
                            />
                         </div>
                         <div className="flex-1">
                            <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Categoría</label>
                            <select 
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-white text-sm focus:border-emerald-500 outline-none appearance-none"
                                value={category}
                                onChange={e => setCategory(e.target.value as ExpenseCategory)}
                            >
                                {Object.values(ExpenseCategory).map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                         </div>
                    </div>

                    {/* Formal Toggle */}
                    <div 
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${isFormal ? 'bg-emerald-500/20 border-emerald-500' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                        onClick={() => setIsFormal(!isFormal)}
                    >
                        <div className={`w-10 h-5 rounded-full p-0.5 transition-colors ${isFormal ? 'bg-emerald-500' : 'bg-gray-600'}`}>
                             <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${isFormal ? 'translate-x-5' : 'translate-x-0'}`}></div>
                        </div>
                        <div>
                            <span className={`text-sm font-bold ${isFormal ? 'text-emerald-300' : 'text-gray-300'}`}>Gasto Formal</span>
                            <p className="text-[10px] text-gray-500">Tengo boleta con DNI/RUC.</p>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={handleSubmit} 
                    disabled={!amount || !merchant || isSubmitting || parseFloat(amount) <= 0}
                    className="w-full mt-6 bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3 rounded-xl hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] flex items-center justify-center"
                >
                    {isSubmitting ? <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span> : 'Guardar Gasto'}
                </button>
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
            <div className="bg-surface p-6 rounded-2xl border border-white/10 w-[95%] max-w-sm shadow-2xl m-4" onClick={e => e.stopPropagation()}>
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
            <div className="bg-surface p-6 rounded-2xl border border-white/10 w-[95%] max-w-sm shadow-2xl m-4" onClick={e => e.stopPropagation()}>
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
    <div className="bg-surface p-6 rounded-xl border border-white/10 w-[95%] max-w-sm shadow-2xl m-4" onClick={e => e.stopPropagation()}>
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
             <div className="bg-surface p-6 rounded-2xl border border-white/10 w-[95%] max-w-md shadow-2xl m-4" onClick={e => e.stopPropagation()}>
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
        <div className="relative w-full max-w-sm bg-surface border border-accent rounded-3xl p-8 text-center overflow-hidden m-4" onClick={e => e.stopPropagation()}>
            <div className="absolute inset-0 bg-gradient-to-b from-accent/20 to-transparent"></div>
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
  const { toggleChat, chatMessages, sendAIChatMessage, isAiThinking, role } = useStore();
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (input.trim()) {
          sendAIChatMessage(input);
          setInput('');
      }
  };

  // Auto-scroll to bottom
  useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiThinking]);

  // Determine Theme Color based on Role
  const headerColor = role === UserRole.EMPLOYEE ? 'bg-gradient-to-r from-emerald-600 to-teal-600' :
                      role === UserRole.EMPLOYER ? 'bg-gradient-to-r from-blue-600 to-cyan-600' :
                      'bg-gradient-to-r from-purple-600 to-fuchsia-600';

  return (
    <div className="fixed bottom-24 right-4 w-[90%] md:w-80 h-96 bg-surface/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col z-[150] overflow-hidden animate-slideUp mx-auto left-0 right-0 md:mx-0 md:left-auto">
        <div className={`p-4 ${headerColor} flex items-center justify-between`}>
            <div className="flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 text-white" />
                <h3 className="text-white font-bold text-sm">Asistente Treevü</h3>
            </div>
            <button onClick={() => toggleChat(false)} className="p-1 rounded-full hover:bg-white/20 text-white transition-colors">
                <XMarkIcon className="w-5 h-5" />
            </button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-3">
            {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 ${msg.sender === 'ai' ? 'bg-white/10 text-white' : 'bg-emerald-500 text-black'}`}>
                        {msg.sender === 'ai' ? 'AI' : 'Yo'}
                    </div>
                    <div className={`rounded-2xl p-3 text-xs max-w-[80%] ${msg.sender === 'ai' ? 'bg-white/5 text-gray-200 rounded-tl-none' : 'bg-emerald-500/20 text-emerald-100 border border-emerald-500/30 rounded-tr-none'}`}>
                        {msg.text}
                    </div>
                </div>
            ))}
            {isAiThinking && (
                <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs shrink-0 text-white">AI</div>
                    <div className="bg-white/5 rounded-2xl rounded-tl-none p-3 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                    </div>
                </div>
            )}
            <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="p-3 border-t border-white/10 flex gap-2">
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe algo..." 
                className="flex-1 bg-black/20 border border-white/10 rounded-full px-4 py-2 text-xs text-white outline-none focus:border-white/30" 
            />
            <button type="submit" disabled={!input.trim() || isAiThinking} className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20 disabled:opacity-50 transition-colors">
                <PaperAirplaneIcon className="w-4 h-4" />
            </button>
        </form>
    </div>
  );
};

export const OnboardingTour: React.FC = () => {
  const { showTour, closeTour, role } = useStore();
  const [step, setStep] = useState(0);

  if (!showTour) return null;

  const steps = role === UserRole.EMPLOYEE ? [
    { title: 'Bienvenido a Treevü', desc: 'Tu pasaporte al bienestar financiero.', target: '' },
    { title: 'Registra Gastos', desc: 'Usa el botón central para escanear recibos o ingresar gastos manuales.', target: '' },
    { title: 'Sube de Nivel', desc: 'Acumula Treevüs para desbloquear mejores beneficios fiscales.', target: '' },
  ] : role === UserRole.EMPLOYER ? [
    { title: 'Panel de Control', desc: 'Monitorea el bienestar financiero de tu equipo en tiempo real.', target: '' },
    { title: 'Reduce Riesgos', desc: 'Identifica áreas con alto riesgo de fuga de talento.', target: '' },
  ] : [
    { title: 'Panel de Socios', desc: 'Gestiona tus ofertas y atrae más clientes.', target: '' },
    { title: 'Analítica', desc: 'Visualiza el impacto de tus campañas.', target: '' },
  ];

  const currentStep = steps[step] || steps[0];

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      closeTour();
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface p-8 rounded-2xl border border-white/10 w-[95%] max-w-md text-center shadow-2xl relative overflow-hidden m-4" onClick={(e) => e.stopPropagation()}>
         {/* Decorative BG */}
         <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl"></div>
         <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>

         <h3 className="text-2xl font-bold text-white mb-2 relative z-10">{currentStep.title}</h3>
         <p className="text-gray-400 mb-8 relative z-10">{currentStep.desc}</p>
         
         <div className="flex gap-2 justify-center mb-6 relative z-10">
             {steps.map((_, i) => (
                 <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === step ? 'bg-emerald-500' : 'bg-white/10'}`}></div>
             ))}
         </div>

         <button onClick={nextStep} className="bg-emerald-500 text-black font-bold py-3 px-8 rounded-xl hover:scale-105 transition-transform shadow-lg relative z-10">
             {step === steps.length - 1 ? '¡Comenzar!' : 'Siguiente'}
         </button>

         <button onClick={closeTour} className="absolute top-4 right-4 text-gray-500 hover:text-white z-20">
             <XMarkIcon className="w-6 h-6" />
         </button>
      </div>
    </div>
  );
};
