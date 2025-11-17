import React, { Suspense } from 'react';

import { AppProvider } from '@/contexts/AppContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { AlertProvider } from '@/contexts/AlertContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { BudgetProvider } from '@/contexts/BudgetContext';  // Después de Auth y Alert
import { ExpensesProvider } from '@/contexts/ExpensesContext';
import Spinner from '@/components/ui/Spinner';

const MainApp = React.lazy(() => import('@/features/dashboard/MainApp'));

const PersonAppWrapper: React.FC = () => {
    return (
        <AppProvider>
            <Suspense fallback={
                      <div className="w-full h-screen flex items-center justify-center">
                          <Spinner />
                      </div>
                  }>
                      <MainApp />
                  </Suspense>
        </AppProvider>
    );
};

export default PersonAppWrapper;