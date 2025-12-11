import React, { useState } from 'react';
import { DashboardEmployee } from './components/DashboardEmployee';
import { DashboardB2B } from './components/DashboardB2B';
import { DashboardMerchant } from './components/DashboardMerchant';
import { ViewMode } from './types';
import { LayoutDashboard, Smartphone, ShoppingBag, ArrowRight, Leaf, ShieldCheck, Store, ChevronRight } from 'lucide-react';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode | 'LANDING'>('LANDING');

  const LandingPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-[#F6FAFE] to-[#E2E8F0] flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-purple-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="relative z-10 max-w-5xl w-full text-center">
            <div className="mb-12 animate-in slide-in-from-top-10 duration-700 fade-in">
                <div className="flex items-center justify-center space-x-3 mb-4">
                    <div className="bg-[#1C81F2] p-3 rounded-2xl shadow-lg shadow-blue-500/20">
                        <Leaf className="text-white" size={40} />
                    </div>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold text-[#1E293B] font-['Space_Grotesk'] tracking-tight mb-4">
                    Treevü Proactive
                </h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
                    El ecosistema de bienestar financiero que conecta liquidez, análisis de riesgo y consumo inteligente.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-4">
                {/* Employee Card */}
                <button 
                    onClick={() => setViewMode(ViewMode.EMPLOYEE)}
                    className="group relative bg-white/60 backdrop-blur-xl border border-white/50 p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-left overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-teal-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                    <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#1C81F2] transition-colors duration-300">
                        <Smartphone className="text-[#1C81F2] group-hover:text-white transition-colors" size={28} />
                    </div>
                    <h3 className="text-2xl font-bold text-[#1E293B] mb-2 group-hover:text-[#1C81F2] transition-colors">Colaborador</h3>
                    <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                        Experiencia móvil para gestión de FWI, acceso a salario devengado (EWA) y marketplace de ofertas.
                    </p>
                    <div className="flex items-center text-[#1C81F2] font-bold text-sm">
                        <span>Ver Demo App</span>
                        <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                </button>

                {/* B2B Card */}
                <button 
                    onClick={() => setViewMode(ViewMode.B2B_ADMIN)}
                    className="group relative bg-white/60 backdrop-blur-xl border border-white/50 p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-left overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 to-purple-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                    <div className="bg-indigo-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors duration-300">
                        <ShieldCheck className="text-indigo-600 group-hover:text-white transition-colors" size={28} />
                    </div>
                    <h3 className="text-2xl font-bold text-[#1E293B] mb-2 group-hover:text-indigo-600 transition-colors">Empresa (HR)</h3>
                    <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                        Torre de control para gestión de riesgo operativo, retención de talento y dispersión de nómina.
                    </p>
                    <div className="flex items-center text-indigo-600 font-bold text-sm">
                        <span>Ver Dashboard HR</span>
                        <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                </button>

                {/* Merchant Card */}
                <button 
                    onClick={() => setViewMode(ViewMode.MERCHANT)}
                    className="group relative bg-white/60 backdrop-blur-xl border border-white/50 p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-left overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-green-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                    <div className="bg-teal-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-600 transition-colors duration-300">
                        <Store className="text-teal-600 group-hover:text-white transition-colors" size={28} />
                    </div>
                    <h3 className="text-2xl font-bold text-[#1E293B] mb-2 group-hover:text-teal-600 transition-colors">Comercio</h3>
                    <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                        Portal de aliados para creación de ofertas inteligentes y captación de demanda segmentada.
                    </p>
                    <div className="flex items-center text-teal-600 font-bold text-sm">
                        <span>Ver Portal Socio</span>
                        <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                </button>
            </div>
            
            <p className="mt-12 text-gray-400 text-xs font-mono">
                Treevü v1.0.0 • MVP Build • Powered by Google Gemini
            </p>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F6FAFE]">
      {/* Demo Switcher - Only visible if NOT in Landing Mode */}
      {viewMode !== 'LANDING' && (
        <div className="fixed top-4 right-14 md:right-4 z-50 bg-white/90 backdrop-blur-md p-1 rounded-xl shadow-lg border border-gray-200/50 flex space-x-1 transition-all duration-300 animate-in slide-in-from-top-4 fade-in">
            <button
            onClick={() => setViewMode('LANDING')}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            title="Volver al Inicio"
            >
            <ChevronRight size={16} className="rotate-180" />
            </button>
            <div className="w-px bg-gray-200 mx-1"></div>
            <button
            onClick={() => setViewMode(ViewMode.EMPLOYEE)}
            className={`p-2 rounded-lg flex items-center justify-center space-x-0 md:space-x-2 text-xs font-bold transition-all duration-200 ${
                viewMode === ViewMode.EMPLOYEE 
                ? 'bg-[#1C81F2] text-white shadow-md scale-105' 
                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
            }`}
            title="Vista Colaborador"
            >
            <Smartphone size={16} />
            <span className="hidden md:inline">Colaborador</span>
            </button>
            <button
            onClick={() => setViewMode(ViewMode.B2B_ADMIN)}
            className={`p-2 rounded-lg flex items-center justify-center space-x-0 md:space-x-2 text-xs font-bold transition-all duration-200 ${
                viewMode === ViewMode.B2B_ADMIN 
                ? 'bg-[#1C81F2] text-white shadow-md scale-105' 
                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
            }`}
            title="Vista Empresa"
            >
            <LayoutDashboard size={16} />
            <span className="hidden md:inline">Empresa</span>
            </button>
            <button
            onClick={() => setViewMode(ViewMode.MERCHANT)}
            className={`p-2 rounded-lg flex items-center justify-center space-x-0 md:space-x-2 text-xs font-bold transition-all duration-200 ${
                viewMode === ViewMode.MERCHANT 
                ? 'bg-[#1C81F2] text-white shadow-md scale-105' 
                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
            }`}
            title="Vista Comercio"
            >
            <ShoppingBag size={16} />
            <span className="hidden md:inline">Comercio</span>
            </button>
        </div>
      )}

      {/* Main Content Area */}
      {viewMode === 'LANDING' && <LandingPage />}
      {viewMode === ViewMode.EMPLOYEE && <DashboardEmployee />}
      {viewMode === ViewMode.B2B_ADMIN && <DashboardB2B />}
      {viewMode === ViewMode.MERCHANT && <DashboardMerchant />}
    </div>
  );
};

export default App;