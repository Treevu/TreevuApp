import React from 'react';
import DashboardView from '@/views/DashboardView';
import { useStore } from '@/contexts/Store';
import { UserRole } from '@/types';

const PartnersPage: React.FC = () => {
  const { role, switchRole } = useStore();

  React.useEffect(() => {
    if (role !== UserRole.MERCHANT) {
      switchRole(UserRole.MERCHANT);
    }
  }, [role, switchRole]);

  return <DashboardView />;
};

export default PartnersPage;
