import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import Home from './pages/Home';
import Analysis from './pages/Analysis';
import AdminPage from './pages/AdminPage';

const queryClient = new QueryClient();

const DebugRouter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  console.log('DebugRouter: Current location:', location.pathname);
  return <>{children}</>;
};

const App: React.FC = () => {
  console.log('App: Rendering routes');
  try {
    return (
      <QueryClientProvider client={queryClient}>
        <Router future={{ v7_startTransition: true }}>
          <DebugRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/analysis" element={<Analysis />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<div>404: Page Not Found</div>} />
            </Routes>
          </DebugRouter>
        </Router>
      </QueryClientProvider>
    );
  } catch (error) {
    console.error('App: Routing error:', error);
    return <div>Error rendering routes: {(error as Error).message}</div>;
  }
};

export default App;