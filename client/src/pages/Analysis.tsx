import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { API_URL } from '../config';
import { toast } from 'react-toastify';
import { useAppStore } from '../store';
import ToastProvider from '../components/common/ToastProvider';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  hasRecipe?: boolean;
}

interface MenuData {
  items: MenuItem[];
  initialIngredients: Record<string, any>;
  costMultiplier?: number;
}

interface MenusResponse {
  success: boolean;
  data: MenuItem[];
}

const fetchMenus = async (): Promise<MenusResponse> => {
  console.log('Analysis - Starting fetch, URL:', API_URL);
  try {
    console.log('Analysis - Attempting fetch...');
    const { data } = await axios.get(API_URL);
    console.log('Analysis - API Data:', data);
    if (!data.success) throw new Error('Failed to fetch menus');
    return data;
  } catch (error) {
    console.error('Analysis - Fetch Error:', error.message);
    console.error('Analysis - Error Details:', error.response || error);
    throw error;
  }
};

const Analysis: React.FC = () => {
  const { menus, selectedMenu, setMenus, clearStore } = useAppStore();

  useEffect(() => {
    clearStore();
  }, [clearStore]);

  const { isLoading, error } = useQuery('menus', fetchMenus, {
    retry: 1,
    onSuccess: (data) => {
      const menuData = {
        items: data.data,
        initialIngredients: {},
        costMultiplier: 1
      };
      setMenus({ [selectedMenu]: menuData });
    },
    onError: () => toast.error('Failed to fetch menus')
  });

  if (isLoading) return <div className="flex justify-center items-center h-screen text-foreground">Loading...</div>;
  if (error) return <div className="container mx-auto p-4 text-destructive text-center">Error: {(error as Error).message}</div>;

  const currentMenu = menus[selectedMenu] || { items: [], initialIngredients: {}, costMultiplier: 1 };
  const totalItems = currentMenu.items.length;
  const recipeItems = currentMenu.items.filter((item: any) => item.hasRecipe);
  const resaleItems = currentMenu.items.filter((item: any) => !item.hasRecipe);

  return (
    <div className="min-h-screen bg-background">
      <ToastProvider />
      <header className="bg-gradient-navy text-white py-5 shadow-lg">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-accent">Analysis Dashboard</h1>
          <nav className="flex space-x-3">
            <Link to="/" className="btn btn-ghost text-white hover:bg-primary-foreground/10">Home</Link>
            <Link to="/analysis" className="btn btn-ghost text-accent hover:bg-primary-foreground/10">Analysis</Link>
            <Link to="/admin" className="btn btn-ghost text-white hover:bg-primary-foreground/10">Admin</Link>
          </nav>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 animate-fade-in">Analysis Panel</h1>
        <div className="mb-8 flex justify-center">
          <div className="w-full max-w-md animate-fade-in delay-100">
            <label className="label"><span className="label-text">Selected Restaurant Menu</span></label>
            <input
              type="text"
              value={selectedMenu === 'izMenu' ? 'IZ Menu' : 'Bell Menu'}
              readOnly
              className="input w-full"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Menu Summary</h2>
              <p>Total Items: {totalItems}</p>
              <p>Recipe Items: {recipeItems.length}</p>
              <p>Resale Items: {resaleItems.length}</p>
            </div>
          </div>
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Ingredients Overview</h2>
              <p>Total Ingredients: {Object.keys(currentMenu.initialIngredients).length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;