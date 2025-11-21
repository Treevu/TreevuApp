import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import PeoplePage from '@/pages/PeoplePage';
import CompaniesPage from '@/pages/CompaniesPage';
import PartnersPage from '@/pages/PartnersPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/people" element={<PeoplePage />} />
      <Route path="/companies" element={<CompaniesPage />} />
      <Route path="/partners" element={<PartnersPage />} />
    </Routes>
  );
};

export default AppRoutes;
