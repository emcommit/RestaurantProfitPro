import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RecipeItemsTab from '../components/admin/RecipeItemsTab';
import ResaleItemsTab from '../components/admin/ResaleItemsTab';
import IngredientManagementTab from '../components/admin/IngredientManagementTab';
import { useAppStore } from '../store';

const AdminPage: React.FC = () => {
  const { selectedMenu, setSelectedMenu } = useAppStore();
  const [activeTab, setActiveTab] = useState('recipe');

  const tabs = [
    { id: 'recipe', label: 'Recipe Items', component: <RecipeItemsTab /> },
    { id: 'resale', label: 'Resale Items', component: <ResaleItemsTab /> },
    { id: 'ingredients', label: 'Ingredients', component: <IngredientManagementTab /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-navy text-white py-4 shadow-md fixed top-0 left-0 w-full z-50">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gold tracking-wide">Restaurant Analytics</h1>
          <nav className="flex space-x-3">
            <Link to="/" className="nav-btn hover:scale-105 transition-transform duration-200">Home</Link>
            <Link to="/analysis" className="nav-btn hover:scale-105 transition-transform duration-200">Analysis</Link>
            <Link to="/admin" className="nav-btn bg-navy-800 hover:scale-105 transition-transform duration-200">Admin</Link>
          </nav>
        </div>
      </header>
      <div className="container mx-auto p-6 pt-24">
        <h1 className="text-4xl font-bold text-navy text-center mb-10 tracking-tight">Admin Dashboard</h1>
        <div className="mb-8 flex justify-center">
          <div className="w-full max-w-sm">
            <label className="label"><span className="label-text text-lg font-semibold text-navy tracking-wide">Select Restaurant Menu</span></label>
            <select
              value={selectedMenu}
              onChange={(e) => setSelectedMenu(e.target.value as 'izMenu' | 'bellFood')}
              className="select select-bordered w-full bg-white text-navy shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg focus:ring-2 focus:ring-accent-500"
            >
              <option value="izMenu">IZ Menu</option>
              <option value="bellFood">Bell Menu</option>
            </select>
          </div>
        </div>
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-xl shadow-md bg-gray-200 p-2 space-x-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`px-6 py-2 text-lg font-semibold rounded-lg transition-all duration-200 ${
                  activeTab === tab.id ? 'bg-white text-navy shadow-lg border-b-4 border-accent-500' : 'text-gray-600 hover:bg-gray-300'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="card p-8 bg-gradient-to-b from-white to-gray-50 shadow-lg rounded-2xl">
          {tabs.find(tab => tab.id === activeTab)?.component}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;