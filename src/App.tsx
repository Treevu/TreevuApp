import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { StoreProvider } from '@/contexts/Store';
import GlobalNetworkBackground from '@/components/Background';
import AppRoutes from '@/routes';

function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <GlobalNetworkBackground />
        <div className="relative min-h-screen text-white font-sans selection:bg-primary selection:text-black">
          <AppRoutes />
        </div>
      </StoreProvider>
    </BrowserRouter>
  );
}

export default App;