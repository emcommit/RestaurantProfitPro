
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
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

interface MenuItem {
  id: string;
  name: string;
  category: string;
  sellingPrice: number;
  hasRecipe?: boolean;
  buyingPrice?: number;
  ingredients?: Record<string, number>;
}

const fetchMenus = async (): Promise<MenusResponse> => {
  const { data } = await axios.get('/api/menus');
  if (!data.success) throw new Error('Failed to fetch menus');
  return data;
};

const AdminPage: React.FC = () => {
  const { selectedMenu, setSelectedMenu } = useAppStore();
  const queryClient = useQueryClient();
  const { data, error, isLoading } = useQuery('menus', fetchMenus, { retry: 1 });
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    id: '',
    name: '',
    category: '',
    sellingPrice: '',
    hasRecipe: true,
    buyingPrice: '',
    ingredients: {} as Record<string, number>
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const navigate = useNavigate();

  const menus = data?.data || { izMenu, bellFood: bellFoodMenu };
  const currentMenu = menus[selectedMenu] || { items: [], initialIngredients: {}, costMultiplier: 1.1, categories: [] };

  const addItemMutation = useMutation(
    (item: MenuItem) => axios.post(`/api/menus/${selectedMenu}/dishes`, item),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('menus');
        setIsAddItemModalOpen(false);
        setNewItem({ id: '', name: '', category: '', sellingPrice: '', hasRecipe: true, buyingPrice: '', ingredients: {} });
      },
      onError: (error: any) => {
        alert(`Error adding item: ${error.message}`);
      }
    }
  );

  const editItemMutation = useMutation(
    (item: MenuItem) => axios.put(`/api/menus/${selectedMenu}/dishes/${item.id}`, item),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('menus');
        setIsEditItemModalOpen(false);
        setNewItem({ id: '', name: '', category: '', sellingPrice: '', hasRecipe: true, buyingPrice: '', ingredients: {} });
      },
      onError: (error: any) => {
        alert(`Error editing item: ${error.message}`);
      }
    }
  );

  const deleteItemMutation = useMutation(
    (id: string) => axios.delete(`/api/menus/${selectedMenu}/dishes/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('menus');
      },
      onError: (error: any) => {
        alert(`Error deleting item: ${error.message}`);
      }
    }
  );

  const handleAddItem = () => {
    const itemToSave: MenuItem = {
      id: crypto.randomUUID(),
      name: newItem.name,
      category: newItem.category,
      sellingPrice: parseFloat(newItem.sellingPrice),
      hasRecipe: newItem.hasRecipe,
      buyingPrice: newItem.hasRecipe ? undefined : parseFloat(newItem.buyingPrice) || parseFloat(newItem.sellingPrice) * 0.7,
      ingredients: newItem.hasRecipe ? newItem.ingredients : {}
    };
    addItemMutation.mutate(itemToSave);
  };

  const handleEditItem = () => {
    const itemToSave: MenuItem = {
      id: newItem.id,
      name: newItem.name,
      category: newItem.category,
      sellingPrice: parseFloat(newItem.sellingPrice),
      hasRecipe: newItem.hasRecipe,
      buyingPrice: newItem.hasRecipe ? undefined : parseFloat(newItem.buyingPrice) || parseFloat(newItem.sellingPrice) * 0.7,
      ingredients: newItem.hasRecipe ? newItem.ingredients : {}
    };
    editItemMutation.mutate(itemToSave);
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteItemMutation.mutate(id);
    }
  };

  const handleAddIngredient = () => {
    setNewItem({
      ...newItem,
      ingredients: { ...newItem.ingredients, '': 0 }
    });
  };

  const handleUpdateIngredient = (oldName: string, newName: string, quantity: number) => {
    const newIngredients = { ...newItem.ingredients };
    if (newName && newName !== oldName) {
      newIngredients[newName] = quantity;
      delete newIngredients[oldName];
    } else if (newName) {
      newIngredients[newName] = quantity;
    }
    setNewItem({ ...newItem, ingredients: newIngredients });
  };

  const handleRemoveIngredient = (name: string) => {
    const newIngredients = { ...newItem.ingredients };
    delete newIngredients[name];
    setNewItem({ ...newItem, ingredients: newIngredients });
  };

  const filteredItems = useMemo(() => {
    let items = [...currentMenu.items];

    console.log('All items:', items); // Debug log

    if (searchQuery) {
      items = items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (filterCategory) {
      items = items.filter(item => item.category === filterCategory);
    }

    items.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'price') {
        return a.sellingPrice - b.sellingPrice;
      }
      return 0;
    });

    console.log('Filtered items:', items); // Debug log

    return items;
  }, [currentMenu.items, searchQuery, filterCategory, sortBy]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

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
            <div className="flex space-x-4 mb-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Search</span></label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name"
                  className="input input-bordered"
                />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Filter by Category</span></label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="select select-bordered"
                >
                  <option value="">All Categories</option>
                  {currentMenu.categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Sort By</span></label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="select select-bordered"
                >
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                </select>
              </div>
            </div>
            {filteredItems.length === 0 ? (
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
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item, index) => (
                      <tr key={item.id || `${item.name}-${item.category}-${index}`} className={item.hasRecipe ? '' : 'bg-base-200'}>
                        <td>{item.name}</td>
                        <td>{item.category}</td>
                        <td className="text-right">£{item.sellingPrice.toFixed(2)}</td>
                        <td>{item.hasRecipe ? 'Recipe' : 'Resale'}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline mr-2"
                            onClick={() => {
                              setNewItem({
                                id: item.id,
                                name: item.name,
                                category: item.category,
                                sellingPrice: item.sellingPrice.toString(),
                                hasRecipe: item.hasRecipe || true,
                                buyingPrice: item.buyingPrice?.toString() || '',
                                ingredients: item.ingredients || {}
                              });
                              setIsEditItemModalOpen(true);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-error"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Add Item Modal */}
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
            <select
              value={newItem.category}
              onChange={(e) => {
                const category = e.target.value;
                const isRecipe = ['Food', 'Cocktails', 'Liquor Coffees', 'Desserts'].includes(category);
                setNewItem({
                  ...newItem,
                  category,
                  hasRecipe: isRecipe,
                  ingredients: isRecipe ? newItem.ingredients : {},
                  buyingPrice: isRecipe ? '' : newItem.buyingPrice
                });
              }}
              className="select select-bordered"
            >
              <option value="">Select Category</option>
              <option value="Food">Food</option>
              <option value="Cocktails">Cocktails</option>
              <option value="Liquor Coffees">Liquor Coffees</option>
              <option value="Desserts">Desserts</option>
              <option value="Drinks">Drinks</option>
              <option value="Wines">Wines</option>
            </select>
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
                onChange={(e) => setNewItem({ ...newItem, hasRecipe: e.target.checked, ingredients: e.target.checked ? {} : {} })}
                className="checkbox"
                disabled // Controlled by category
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
          {newItem.hasRecipe && (
            <div className="form-control">
              <label className="label"><span className="label-text">Ingredients</span></label>
              {Object.entries(newItem.ingredients).map(([name, quantity]) => (
                <div key={name} className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleUpdateIngredient(name, e.target.value, quantity)}
                    placeholder="Ingredient name"
                    className="input input-bordered w-1/2"
                  />
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleUpdateIngredient(name, name, parseFloat(e.target.value) || 0)}
                    placeholder="Quantity"
                    className="input input-bordered w-1/4"
                  />
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => handleRemoveIngredient(name)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                className="btn btn-sm btn-outline mt-2"
                onClick={handleAddIngredient}
              >
                Add Ingredient
              </button>
            </div>
          )}
          <div className="modal-action">
            <button className="btn btn-ghost" onClick={() => setIsAddItemModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAddItem}>Add</button>
          </div>
        </div>
      </Modal>
      {/* Edit Item Modal */}
      <Modal isOpen={isEditItemModalOpen} onClose={() => setIsEditItemModalOpen(false)} title="Edit Item">
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
            <select
              value={newItem.category}
              onChange={(e) => {
                const category = e.target.value;
                const isRecipe = ['Food', 'Cocktails', 'Liquor Coffees', 'Desserts'].includes(category);
                setNewItem({
                  ...newItem,
                  category,
                  hasRecipe: isRecipe,
                  ingredients: isRecipe ? newItem.ingredients : {},
                  buyingPrice: isRecipe ? '' : newItem.buyingPrice
                });
              }}
              className="select select-bordered"
            >
              <option value="">Select Category</option>
              <option value="Food">Food</option>
              <option value="Cocktails">Cocktails</option>
              <option value="Liquor Coffees">Liquor Coffees</option>
              <option value="Desserts">Desserts</option>
              <option value="Drinks">Drinks</option>
              <option value="Wines">Wines</option>
            </select>
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
                onChange={(e) => setNewItem({ ...newItem, hasRecipe: e.target.checked, ingredients: e.target.checked ? newItem.ingredients : {} })}
                className="checkbox"
                disabled // Controlled by category
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
          {newItem.hasRecipe && (
            <div className="form-control">
              <label className="label"><span className="label-text">Ingredients</span></label>
              {Object.entries(newItem.ingredients).map(([name, quantity]) => (
                <div key={name} className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleUpdateIngredient(name, e.target.value, quantity)}
                    placeholder="Ingredient name"
                    className="input input-bordered w-1/2"
                  />
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleUpdateIngredient(name, name, parseFloat(e.target.value) || 0)}
                    placeholder="Quantity"
                    className="input input-bordered w-1/4"
                  />
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => handleRemoveIngredient(name)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                className="btn btn-sm btn-outline mt-2"
                onClick={handleAddIngredient}
              >
                Add Ingredient
              </button>
            </div>
          )}
          <div className="modal-action">
            <button className="btn btn-ghost" onClick={() => setIsEditItemModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleEditItem}>Save</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminPage;