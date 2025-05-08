import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import AdminPage from './pages/AdminPage';
import IzMenuPage from './pages/IzMenuPage';
import BellMenuPage from './pages/BellMenuPage';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/iz" element={<IzMenuPage />} />
          <Route path="/bell" element={<BellMenuPage />} />
          <Route path="/" element={<div>Home</div>} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;