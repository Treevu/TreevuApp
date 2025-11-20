import React from 'react';
import { StoreProvider } from './contexts/Store';
import GlobalNetworkBackground from './components/Background';
import DashboardView from './views/DashboardView';

function App() {
  return (
    <StoreProvider>
      <GlobalNetworkBackground />
      <div className="relative min-h-screen text-white font-sans selection:bg-primary selection:text-black">
        <DashboardView />
      </div>
    </StoreProvider>
  );
}

export default App;