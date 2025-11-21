import React from 'react';
import DashboardView from '@/views/DashboardView';
import { useStore } from '@/contexts/Store';
import { UserRole } from '@/types';

const CompaniesPage: React.FC = () => {
  const { role, switchRole } = useStore();

  React.useEffect(() => {
    if (role !== UserRole.EMPLOYER) {
      switchRole(UserRole.EMPLOYER);
    }
  }, [role, switchRole]);

  return <DashboardView />;
};

export default CompaniesPage;
