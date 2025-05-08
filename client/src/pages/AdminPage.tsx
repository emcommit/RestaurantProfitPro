import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import Modal from '../components/Modal';
import { MenuInterface, izMenu, bellFoodMenu } from '../components/MenuData';
import create from 'zustand';

interface AppState {
  selectedMenu: string;
  setSelectedMenu: (menu: string) => void;
}

const useAppStore = create<AppState>((set) => ({
  selectedMenu: 'izMenu',
  setSelectedMenu: (menu) => set({ selectedMenu: menu })
}));

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
  const { selectedMenu, setSelectedMenu } = useAppStore();
  const { data: menus = { izMenu, bellFood: bellFoodMenu }, error } = useQuery('menus', fetchMenus, { retry: 1 });
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', category: '', sellingPrice: '', hasRecipe: true, buyingPrice: '' });
  const navigate = useNavigate();

  const handleAddItem = async () => {
    try {
      const itemToSave = {
        ...newItem,
        sellingPrice: parseFloat(newItem.sellingPrice),
        buyingPrice: newItem.hasRecipe ? undefined : parseFloat(newItem.buyingPrice) || parseFloat(newItem.sellingPrice) * 0.7,
        ingredients: newItem.hasRecipe ? {} : {},
        id: crypto.randomUUID() // Add unique ID for new items
      };
      await axios.post(`/api/menus/${selectedMenu}/dishes`, itemToSave);
      setIsAddItemModalOpen(false);
      setNewItem({ name: '', category: '', sellingPrice: '', hasRecipe: true, buyingPrice: '' });
      navigate(0); // Refresh data
    } catch (error: any) {
      alert(`Error adding item: ${error.message}`);
    }
  };

  const currentMenu = menus[selectedMenu];

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
        {error && <div className="alert alert-error">{(error as Error).message}</div>}
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="card-title text-navy">Menu Items</h2>
              <button className="btn btn-primary" onClick={() => setIsAddItemModalOpen(true)}>Add Item</button>
            </div>
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
                      <tr key={item.id || `${item.name}-${item.category}-${index}`}>
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
      <Modal isOpen={isAddItemModalOpen} onClose={() => setIsAddItemModalOpen(false)} title="Add New Item">
        <div className="space-y-4">
          <div className="form-control">
            <label className="label"><span className="label-text">Name</span></label>
            <input
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="input input-bordered w-full"
            />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text">Category</span></label>
            <input
              type="text"
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              className="input input-bordered w-full"
            />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text">Selling Price (£)</span></label>
            <input
              type="number"
              step="0.01"
              value={newItem.sellingPrice}
              onChange={(e) => setNewItem({ ...newItem, sellingPrice: e.target.value })}
              className="input input-bordered w-full"
            />
          </div>
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Has Recipe</span>
              <input
                type="checkbox"
                checked={newItem.hasRecipe}
                onChange={(e) => setNewItem({ ...newItem, hasRecipe: e.target.checked })}
                className="checkbox"
              />
            </label>
          </div>
          {!newItem.hasRecipe && (
            <div className="form-control">
              <label className="label"><span className="label-text">Buying Price (£)</span></label>
              <input
                type="number"
                step="0.01"
                value={newItem.buyingPrice}
                onChange={(e) => setNewItem({ ...newItem, buyingPrice: e.target.value })}
                className="input input-bordered w-full"
              />
            </div>
          )}
          <div className="modal-action">
            <button className="btn btn-ghost" onClick={() => setIsAddItemModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAddItem}>Add</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminPage;