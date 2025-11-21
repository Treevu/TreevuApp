import React from 'react';
import DashboardView from '@/views/DashboardView';
import { useStore } from '@/contexts/Store';
import { UserRole } from '@/types';

const PeoplePage: React.FC = () => {
  const { role, switchRole } = useStore();

  React.useEffect(() => {
    if (role !== UserRole.EMPLOYEE) {
      switchRole(UserRole.EMPLOYEE);
    }
  }, [role, switchRole]);

  return <DashboardView />;
};

export default PeoplePage;
