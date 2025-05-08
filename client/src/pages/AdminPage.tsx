
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import Modal from '../components/Modal';
import { MenuInterface, izMenu, bellFoodMenu } from '../components/MenuData';
import create from 'zustand';

interface AppState {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

const useAppStore = create<AppState>((set) => ({
  selectedTab: 'recipe',
  setSelectedTab: (tab) => set({ selectedTab: tab })
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
  menuSource: 'izMenu' | 'bellFood';
}

interface Ingredient {
  name: string;
  cost: number;
  unit: string;
}

const fetchMenus = async (): Promise<MenusResponse> => {
  const { data } = await axios.get('/api/menus');
  if (!data.success) throw new Error('Failed to fetch menus');
  return data;
};

const AdminPage: React.FC = () => {
  const { selectedTab, setSelectedTab } = useAppStore();
  const queryClient = useQueryClient();
  const { data, error, isLoading } = useQuery('menus', fetchMenus, { retry: 1 });
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false);
  const [isAddIngredientModalOpen, setIsAddIngredientModalOpen] = useState(false);
  const [isEditIngredientModalOpen, setIsEditIngredientModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    id: '',
    name: '',
    category: '',
    sellingPrice: '',
    hasRecipe: true,
    buyingPrice: '',
    ingredients: {} as Record<string, number>,
    menuSource: 'izMenu' as 'izMenu' | 'bellFood'
  });
  const [newIngredient, setNewIngredient] = useState({ name: '', cost: '', unit: '' });
  const [recipeSearch, setRecipeSearch] = useState('');
  const [resaleSearch, setResaleSearch] = useState('');
  const [ingredientSearch, setIngredientSearch] = useState('');
  const [recipeCategoryFilter, setRecipeCategoryFilter] = useState('');
  const [resaleCategoryFilter, setResaleCategoryFilter] = useState('');
  const [recipeMenuFilter, setRecipeMenuFilter] = useState('all');
  const [resaleMenuFilter, setResaleMenuFilter] = useState('all');
  const navigate = useNavigate();

  const menus = data?.data || { izMenu, bellFood: bellFoodMenu };
  const allItems = [
    ...menus.izMenu.items.map(item => ({ ...item, menuSource: 'izMenu' as const })),
    ...menus.bellFood.items.map(item => ({ ...item, menuSource: 'bellFood' as const }))
  ];
  const recipeItems = allItems.filter(item => item.hasRecipe);
  const resaleItems = allItems.filter(item => !item.hasRecipe);
  const initialIngredients = { ...menus.izMenu.initialIngredients, ...menus.bellFood.initialIngredients };
  const ingredientList = Object.entries(initialIngredients).map(([name, { cost, unit }]) => ({ name, cost, unit }));

  const recipeCategories = Array.from(new Set(recipeItems.map(item => item.category)));
  const resaleCategories = Array.from(new Set(resaleItems.map(item => item.category)));

  const addItemMutation = useMutation(
    (item: MenuItem) => axios.post(`/api/menus/${item.menuSource}/dishes`, item),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('menus');
        setIsAddItemModalOpen(false);
        setNewItem({ id: '', name: '', category: '', sellingPrice: '', hasRecipe: true, buyingPrice: '', ingredients: {}, menuSource: 'izMenu' });
      },
      onError: (error: any) => {
        alert(`Error adding item: ${error.message}`);
      }
    }
  );

  const editItemMutation = useMutation(
    (item: MenuItem) => axios.put(`/api/menus/${item.menuSource}/dishes/${item.id}`, item),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('menus');
        setIsEditItemModalOpen(false);
        setNewItem({ id: '', name: '', category: '', sellingPrice: '', hasRecipe: true, buyingPrice: '', ingredients: {}, menuSource: 'izMenu' });
      },
      onError: (error: any) => {
        alert(`Error editing item: ${error.message}`);
      }
    }
  );

  const deleteItemMutation = useMutation(
    ({ id, menuSource }: { id: string; menuSource: 'izMenu' | 'bellFood' }) => axios.delete(`/api/menus/${menuSource}/dishes/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('menus');
      },
      onError: (error: any) => {
        alert(`Error deleting item: ${error.message}`);
      }
    }
  );

  const addIngredientMutation = useMutation(
    (ingredient: Ingredient) => axios.post('/api/ingredients', ingredient),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('menus');
        setIsAddIngredientModalOpen(false);
        setNewIngredient({ name: '', cost: '', unit: '' });
      },
      onError: (error: any) => {
        alert(`Error adding ingredient: ${error.message}`);
      }
    }
  );

  const editIngredientMutation = useMutation(
    (ingredient: Ingredient) => axios.put(`/api/ingredients/${ingredient.name}`, ingredient),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('menus');
        setIsEditIngredientModalOpen(false);
        setNewIngredient({ name: '', cost: '', unit: '' });
      },
      onError: (error: any) => {
        alert(`Error editing ingredient: ${error.message}`);
      }
    }
  );

  const deleteIngredientMutation = useMutation(
    (name: string) => axios.delete(`/api/ingredients/${name}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('menus');
      },
      onError: (error: any) => {
        alert(`Error deleting ingredient: ${error.message}`);
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
      ingredients: newItem.hasRecipe ? newItem.ingredients : {},
      menuSource: newItem.menuSource
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
      ingredients: newItem.hasRecipe ? newItem.ingredients : {},
      menuSource: newItem.menuSource
    };
    editItemMutation.mutate(itemToSave);
  };

  const handleDeleteItem = (id: string, menuSource: 'izMenu' | 'bellFood') => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteItemMutation.mutate({ id, menuSource });
    }
  };

  const handleAddIngredient = () => {
    const ingredientToSave: Ingredient = {
      name: newIngredient.name,
      cost: parseFloat(newIngredient.cost),
      unit: newIngredient.unit
    };
    addIngredientMutation.mutate(ingredientToSave);
  };

  const handleEditIngredient = () => {
    const ingredientToSave: Ingredient = {
      name: newIngredient.name,
      cost: parseFloat(newIngredient.cost),
      unit: newIngredient.unit
    };
    editIngredientMutation.mutate(ingredientToSave);
  };

  const handleDeleteIngredient = (name: string) => {
    if (window.confirm('Are you sure you want to delete this ingredient?')) {
      deleteIngredientMutation.mutate(name);
    }
  };

  const handleAddItemIngredient = () => {
    setNewItem({
      ...newItem,
      ingredients: { ...newItem.ingredients, '': 0 }
    });
  };

  const handleUpdateItemIngredient = (oldName: string, newName: string, quantity: number) => {
    const newIngredients = { ...newItem.ingredients };
    if (newName && newName !== oldName) {
      newIngredients[newName] = quantity;
      delete newIngredients[oldName];
    } else if (newName) {
      newIngredients[newName] = quantity;
    }
    setNewItem({ ...newItem, ingredients: newIngredients });
  };

  const handleRemoveItemIngredient = (name: string) => {
    const newIngredients = { ...newItem.ingredients };
    delete newIngredients[name];
    setNewItem({ ...newItem, ingredients: newIngredients });
  };

  const filteredRecipeItems = useMemo(() => {
    let items = recipeItems;
    if (recipeSearch) {
      items = items.filter(item => item.name.toLowerCase().includes(recipeSearch.toLowerCase()));
    }
    if (recipeCategoryFilter) {
      items = items.filter(item => item.category === recipeCategoryFilter);
    }
    if (recipeMenuFilter !== 'all') {
      items = items.filter(item => item.menuSource === recipeMenuFilter);
    }
    return items;
  }, [recipeItems, recipeSearch, recipeCategoryFilter, recipeMenuFilter]);

  const filteredResaleItems = useMemo(() => {
    let items = resaleItems;
    if (resaleSearch) {
      items = items.filter(item => item.name.toLowerCase().includes(resaleSearch.toLowerCase()));
    }
    if (resaleCategoryFilter) {
      items = items.filter(item => item.category === resaleCategoryFilter);
    }
    if (resaleMenuFilter !== 'all') {
      items = items.filter(item => item.menuSource === resaleMenuFilter);
    }
    return items;
  }, [resaleItems, resaleSearch, resaleCategoryFilter, resaleMenuFilter]);

  const filteredIngredients = useMemo(() => {
    let ingredients = ingredientList;
    if (ingredientSearch) {
      ingredients = ingredients.filter(ing => ing.name.toLowerCase().includes(ingredientSearch.toLowerCase()));
    }
    return ingredients;
  }, [ingredientList, ingredientSearch]);

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
        <div className="tabs tabs-boxed mb-4">
          <a className={`tab ${selectedTab === 'recipe' ? 'tab-active' : ''}`} onClick={() => setSelectedTab('recipe')}>
            Recipe Items
          </a>
          <a className={`tab ${selectedTab === 'resale' ? 'tab-active' : ''}`} onClick={() => setSelectedTab('resale')}>
            Resale Items
          </a>
          <a className={`tab ${selectedTab === 'ingredients' ? 'tab-active' : ''}`} onClick={() => setSelectedTab('ingredients')}>
            Ingredient Management
          </a>
        </div>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            {selectedTab === 'recipe' && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="card-title text-navy">Recipe Items</h2>
                  <button className="btn btn-primary" onClick={() => {
                    setNewItem({ ...newItem, hasRecipe: true });
                    setIsAddItemModalOpen(true);
                  }}>Add Recipe Item</button>
                </div>
                <div className="flex space-x-4 mb-4">
                  <div className="form-control">
                    <label className="label"><span className="label-text">Search</span></label>
                    <input
                      type="text"
                      value={recipeSearch}
                      onChange={(e) => setRecipeSearch(e.target.value)}
                      placeholder="Search by name"
                      className="input input-bordered"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label"><span className="label-text">Menu</span></label>
                    <select
                      value={recipeMenuFilter}
                      onChange={(e) => setRecipeMenuFilter(e.target.value)}
                      className="select select-bordered"
                    >
                      <option value="all">All Menus</option>
                      <option value="izMenu">IZ Menu</option>
                      <option value="bellFood">Bell Menu</option>
                    </select>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className={`btn btn-sm ${recipeCategoryFilter === '' ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => setRecipeCategoryFilter('')}
                    >
                      All
                    </button>
                    {recipeCategories.map(category => (
                      <button
                        key={category}
                        className={`btn btn-sm ${recipeCategoryFilter === category ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setRecipeCategoryFilter(category)}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
                {filteredRecipeItems.length === 0 ? (
                  <p className="text-gray-500">No recipe items found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="table w-full">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Category</th>
                          <th>Menu</th>
                          <th className="text-right">Price (£)</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRecipeItems.map((item, index) => (
                          <tr key={item.id || `${item.name}-${item.category}-${index}`}>
                            <td>{item.name}</td>
                            <td>{item.category}</td>
                            <td>{item.menuSource === 'izMenu' ? 'IZ Menu' : 'Bell Menu'}</td>
                            <td className="text-right">£{item.sellingPrice.toFixed(2)}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-outline mr-2"
                                onClick={() => {
                                  setNewItem({
                                    id: item.id,
                                    name: item.name,
                                    category: item.category,
                                    sellingPrice: item.sellingPrice.toString(),
                                    hasRecipe: true,
                                    buyingPrice: '',
                                    ingredients: item.ingredients || {},
                                    menuSource: item.menuSource
                                  });
                                  setIsEditItemModalOpen(true);
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-sm btn-error"
                                onClick={() => handleDeleteItem(item.id, item.menuSource)}
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
              </>
            )}
            {selectedTab === 'resale' && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="card-title text-navy">Resale Items</h2>
                  <button className="btn btn-primary" onClick={() => {
                    setNewItem({ ...newItem, hasRecipe: false });
                    setIsAddItemModalOpen(true);
                  }}>Add Resale Item</button>
                </div>
                <div className="flex space-x-4 mb-4">
                  <div className="form-control">
                    <label className="label"><span className="label-text">Search</span></label>
                    <input
                      type="text"
                      value={resaleSearch}
                      onChange={(e) => setResaleSearch(e.target.value)}
                      placeholder="Search by name"
                      className="input input-bordered"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label"><span className="label-text">Menu</span></label>
                    <select
                      value={resaleMenuFilter}
                      onChange={(e) => setResaleMenuFilter(e.target.value)}
                      className="select select-bordered"
                    >
                      <option value="all">All Menus</option>
                      <option value="izMenu">IZ Menu</option>
                      <option value="bellFood">Bell Menu</option>
                    </select>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className={`btn btn-sm ${resaleCategoryFilter === '' ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => setResaleCategoryFilter('')}
                    >
                      All
                    </button>
                    {resaleCategories.map(category => (
                      <button
                        key={category}
                        className={`btn btn-sm ${resaleCategoryFilter === category ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setResaleCategoryFilter(category)}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
                {filteredResaleItems.length === 0 ? (
                  <p className="text-gray-500">No resale items found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="table w-full">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Category</th>
                          <th>Menu</th>
                          <th className="text-right">Price (£)</th>
                          <th className="text-right">Buying Price (£)</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredResaleItems.map((item, index) => (
                          <tr key={item.id || `${item.name}-${item.category}-${index}`}>
                            <td>{item.name}</td>
                            <td>{item.category}</td>
                            <td>{item.menuSource === 'izMenu' ? 'IZ Menu' : 'Bell Menu'}</td>
                            <td className="text-right">£{item.sellingPrice.toFixed(2)}</td>
                            <td className="text-right">£{item.buyingPrice?.toFixed(2)}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-outline mr-2"
                                onClick={() => {
                                  setNewItem({
                                    id: item.id,
                                    name: item.name,
                                    category: item.category,
                                    sellingPrice: item.sellingPrice.toString(),
                                    hasRecipe: false,
                                    buyingPrice: item.buyingPrice?.toString() || '',
                                    ingredients: {},
                                    menuSource: item.menuSource
                                  });
                                  setIsEditItemModalOpen(true);
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-sm btn-error"
                                onClick={() => handleDeleteItem(item.id, item.menuSource)}
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
              </>
            )}
            {selectedTab === 'ingredients' && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="card-title text-navy">Ingredient Management</h2>
                  <button className="btn btn-primary" onClick={() => setIsAddIngredientModalOpen(true)}>Add Ingredient</button>
                </div>
                <div className="flex space-x-4 mb-4">
                  <div className="form-control">
                    <label className="label"><span className="label-text">Search</span></label>
                    <input
                      type="text"
                      value={ingredientSearch}
                      onChange={(e) => setIngredientSearch(e.target.value)}
                      placeholder="Search by name"
                      className="input input-bordered"
                    />
                  </div>
                </div>
                {filteredIngredients.length === 0 ? (
                  <p className="text-gray-500">No ingredients found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="table w-full">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Cost (£)</th>
                          <th>Unit</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredIngredients.map((ingredient, index) => (
                          <tr key={ingredient.name || index}>
                            <td>{ingredient.name}</td>
                            <td>£{ingredient.cost.toFixed(2)}</td>
                            <td>{ingredient.unit}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-outline mr-2"
                                onClick={() => {
                                  setNewIngredient({
                                    name: ingredient.name,
                                    cost: ingredient.cost.toString(),
                                    unit: ingredient.unit
                                  });
                                  setIsEditIngredientModalOpen(true);
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-sm btn-error"
                                onClick={() => handleDeleteIngredient(ingredient.name)}
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
              </>
            )}
          </div>
        </div>
      </div>
      {/* Add Item Modal */}
      <Modal isOpen={isAddItemModalOpen} onClose={() => setIsAddItemModalOpen(false)} title={newItem.hasRecipe ? 'Add Recipe Item' : 'Add Resale Item'}>
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
            <label className="label"><span className="label-text">Menu</span></label>
            <select
              value={newItem.menuSource}
              onChange={(e) => setNewItem({ ...newItem, menuSource: e.target.value as 'izMenu' | 'bellFood' })}
              className="select select-bordered"
            >
              <option value="izMenu">IZ Menu</option>
              <option value="bellFood">Bell Menu</option>
            </select>
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text">Category</span></label>
            <select
              value={newItem.category}
              onChange={(e) => {
                const category = e.target.value;
                setNewItem({
                  ...newItem,
                  category,
                  ingredients: newItem.hasRecipe ? newItem.ingredients : {},
                  buyingPrice: newItem.hasRecipe ? '' : newItem.buyingPrice
                });
              }}
              className="select select-bordered"
            >
              <option value="">Select Category</option>
              {newItem.hasRecipe ? recipeCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              )) : resaleCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
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
                    onChange={(e) => handleUpdateItemIngredient(name, e.target.value, quantity)}
                    placeholder="Ingredient name"
                    className="input input-bordered w-1/2"
                  />
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleUpdateItemIngredient(name, name, parseFloat(e.target.value) || 0)}
                    placeholder="Quantity"
                    className="input input-bordered w-1/4"
                  />
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => handleRemoveItemIngredient(name)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                className="btn btn-sm btn-outline mt-2"
                onClick={handleAddItemIngredient}
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
      <Modal isOpen={isEditItemModalOpen} onClose={() => setIsEditItemModalOpen(false)} title={newItem.hasRecipe ? 'Edit Recipe Item' : 'Edit Resale Item'}>
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
            <label className="label"><span className="label-text">Menu</span></label>
            <select
              value={newItem.menuSource}
              onChange={(e) => setNewItem({ ...newItem, menuSource: e.target.value as 'izMenu' | 'bellFood' })}
              className="select select-bordered"
            >
              <option value="izMenu">IZ Menu</option>
              <option value="bellFood">Bell Menu</option>
            </select>
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text">Category</span></label>
            <select
              value={newItem.category}
              onChange={(e) => {
                const category = e.target.value;
                setNewItem({
                  ...newItem,
                  category,
                  ingredients: newItem.hasRecipe ? newItem.ingredients : {},
                  buyingPrice: newItem.hasRecipe ? '' : newItem.buyingPrice
                });
              }}
              className="select select-bordered"
            >
              <option value="">Select Category</option>
              {newItem.hasRecipe ? recipeCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              )) : resaleCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
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
                    onChange={(e) => handleUpdateItemIngredient(name, e.target.value, quantity)}
                    placeholder="Ingredient name"
                    className="input input-bordered w-1/2"
                  />
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleUpdateItemIngredient(name, name, parseFloat(e.target.value) || 0)}
                    placeholder="Quantity"
                    className="input input-bordered w-1/4"
                  />
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => handleRemoveItemIngredient(name)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                className="btn btn-sm btn-outline mt-2"
                onClick={handleAddItemIngredient}
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
      {/* Add Ingredient Modal */}
      <Modal isOpen={isAddIngredientModalOpen} onClose={() => setIsAddIngredientModalOpen(false)} title="Add Ingredient">
        <div className="space-y-4">
          <div className="form-control">
            <label className="label"><span className="label-text">Name</span></label>
            <input
              type="text"
              value={newIngredient.name}
              onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
              className="input input-bordered w-full"
            />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text">Cost (£)</span></label>
            <input
              type="number"
              step="0.01"
              value={newIngredient.cost}
              onChange={(e) => setNewIngredient({ ...newIngredient, cost: e.target.value })}
              className="input input-bordered w-full"
            />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text">Unit</span></label>
            <input
              type="text"
              value={newIngredient.unit}
              onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}
              className="input input-bordered w-full"
            />
          </div>
          <div className="modal-action">
            <button className="btn btn-ghost" onClick={() => setIsAddIngredientModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAddIngredient}>Add</button>
          </div>
        </div>
      </Modal>
      {/* Edit Ingredient Modal */}
      <Modal isOpen={isEditIngredientModalOpen} onClose={() => setIsEditIngredientModalOpen(false)} title="Edit Ingredient">
        <div className="space-y-4">
          <div className="form-control">
            <label className="label"><span className="label-text">Name</span></label>
            <input
              type="text"
              value={newIngredient.name}
              disabled
              className="input input-bordered w-full"
            />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text">Cost (£)</span></label>
            <input
              type="number"
              step="0.01"
              value={newIngredient.cost}
              onChange={(e) => setNewIngredient({ ...newIngredient, cost: e.target.value })}
              className="input input-bordered w-full"
            />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text">Unit</span></label>
            <input
              type="text"
              value={newIngredient.unit}
              onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}
              className="input input-bordered w-full"
            />
          </div>
          <div className="modal-action">
            <button className="btn btn-ghost" onClick={() => setIsEditIngredientModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleEditIngredient}>Save</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminPage;