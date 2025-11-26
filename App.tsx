import React, { useState } from 'react';
import { DashboardEmployee } from './components/DashboardEmployee';
import { DashboardB2B } from './components/DashboardB2B';
import { DashboardMerchant } from './components/DashboardMerchant';
import { ViewMode } from './types';
import { LayoutDashboard, Smartphone, ShoppingBag } from 'lucide-react';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.EMPLOYEE);

  return (
    <div className="min-h-screen bg-[#F6FAFE]">
      {/* Demo Switcher - In production this would be handled by auth roles */}
      <div className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-sm p-1 rounded-lg shadow-lg border border-gray-200 flex space-x-1">
        <button
          onClick={() => setViewMode(ViewMode.EMPLOYEE)}
          className={`p-2 rounded-md flex items-center space-x-2 text-xs font-bold transition-all ${
            viewMode === ViewMode.EMPLOYEE 
              ? 'bg-[#1C81F2] text-white shadow-sm' 
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          <Smartphone size={14} />
          <span>App View</span>
        </button>
        <button
          onClick={() => setViewMode(ViewMode.B2B_ADMIN)}
          className={`p-2 rounded-md flex items-center space-x-2 text-xs font-bold transition-all ${
            viewMode === ViewMode.B2B_ADMIN 
              ? 'bg-[#1C81F2] text-white shadow-sm' 
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          <LayoutDashboard size={14} />
          <span>HR View</span>
        </button>
        <button
          onClick={() => setViewMode(ViewMode.MERCHANT)}
          className={`p-2 rounded-md flex items-center space-x-2 text-xs font-bold transition-all ${
            viewMode === ViewMode.MERCHANT 
              ? 'bg-[#1C81F2] text-white shadow-sm' 
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          <ShoppingBag size={14} />
          <span>Merchant</span>
        </button>
      </div>

      {/* Main Content Area */}
      {viewMode === ViewMode.EMPLOYEE && <DashboardEmployee />}
      {viewMode === ViewMode.B2B_ADMIN && <DashboardB2B />}
      {viewMode === ViewMode.MERCHANT && <DashboardMerchant />}
    </div>
  );
};

export default App;