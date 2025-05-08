import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { MenuInterface } from '../components/MenuData';

interface MenusResponse {
  success: boolean;
  data: { izMenu: MenuInterface; bellFood: MenuInterface };
}

const fetchMenus = async (): Promise<MenusResponse> => {
  const { data } = await axios.get('/api/menus');
  if (!data.success) throw new Error('Failed to fetch menus');
  return data;
};

const AdminPage: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState('izMenu');
  const { data, error, isLoading } = useQuery('menus', fetchMenus);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  const currentMenu = data?.data[selectedMenu];

  return (
    <div className="min-h-screen bg-base-200">
      <header className="bg-navy text-white py-5 shadow-lg">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gold">Restaurant Analytics</h1>
          <nav className="flex space-x-2">
            <Link to="/" className="btn btn-ghost text-white">Home</Link>
            <Link to="/iz" className="btn btn-ghost text-white">IZ Menu</Link>
            <Link to="/bell" className="btn btn-ghost text-white">Bell Menu</Link>
            <Link to="/admin" className="btn btn-ghost text-gold">Admin</Link>
          </nav>
        </div>
      </header>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center my-6 text-navy">Menu Management Dashboard</h1>
        <div className="tabs tabs-boxed mb-4">
          <a className={`tab ${selectedMenu === 'izMenu' ? 'tab-active' : ''}`} onClick={() => setSelectedMenu('izMenu')}>
            IZ Menu
          </a>
          <a className={`tab ${selectedMenu === 'bellFood' ? 'tab-active' : ''}`} onClick={() => setSelectedMenu('bellFood')}>
            Bell Food
          </a>
        </div>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-navy">Menu Items</h2>
            {currentMenu.items.length === 0 ? (
              <p className="text-gray-500">No items found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th className="text-right">Price (£)</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentMenu.items.map((item, index) => (
                      <tr key={`${item.name}-${item.category}-${index}`}>
                        <td>{item.name}</td>
                        <td>{item.category}</td>
                        <td className="text-right">£{item.sellingPrice.toFixed(2)}</td>
                        <td>{item.hasRecipe ? 'Recipe' : 'Resale'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;