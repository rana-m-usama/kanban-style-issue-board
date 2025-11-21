import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { BoardPage } from './pages/BoardPage';
import { IssuePage } from './pages/IssuePage';

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<BoardPage />} />
          <Route path="/issue/:id" element={<IssuePage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};
