
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store';

const Home: React.FC = () => {
  const { selectedMenu, setSelectedMenu } = useAppStore();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-navy text-white py-4 shadow-md">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gold">Restaurant Analytics</h1>
          <nav className="flex space-x-2">
            <Link to="/" className="btn btn-ghost text-gold hover:bg-navy-700">Home</Link>
            <Link to="/analysis" className="btn btn-ghost text-white hover:bg-navy-700">Analysis</Link>
            <Link to="/admin" className="btn btn-ghost text-white hover:bg-navy-700">Admin</Link>
          </nav>
        </div>
      </header>
      <div className="container mx-auto p-6">
        <div className="card p-8 text-center">
          <h1 className="text-4xl font-bold text-navy mb-4">Welcome to Restaurant Analytics</h1>
          <p className="text-gray-600 mb-6">Analyze and optimize your restaurant's performance with ease.</p>
          <div className="flex justify-center mb-6">
            <div className="w-full max-w-md">
              <label className="label"><span className="label-text text-lg font-semibold text-navy">Select Restaurant Menu</span></label>
              <select
                value={selectedMenu}
                onChange={(e) => setSelectedMenu(e.target.value as 'izMenu' | 'bellFood')}
                className="select select-bordered w-full bg-white text-navy"
              >
                <option value="izMenu">IZ Menu</option>
                <option value="bellFood">Bell Menu</option>
              </select>
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            <Link to="/analysis" className="btn btn-primary">View Analysis</Link>
            <Link to="/admin" className="btn btn-ghost text-navy border-navy">Manage Menu</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;