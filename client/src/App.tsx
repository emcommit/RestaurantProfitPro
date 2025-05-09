import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Analysis from './pages/Analysis';
import AdminPage from './pages/AdminPage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/analysis" element={<Analysis />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
};

export default App;