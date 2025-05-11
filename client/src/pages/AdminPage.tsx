import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { API_URL } from '../config';
import { toast } from 'react-toastify';
import { useAppStore } from '../store';
import GenericModal from '../components/common/GenericModal';
import ToastProvider from '../components/common/ToastProvider';
import IngredientTab from '../components/admin/IngredientTab';
import RecipeItemsTab from '../components/admin/RecipeItemsTab';
import ResaleItemsTab from '../components/admin/ResaleItemsTab';

interface MenusResponse {
  success: boolean;
  data: Record<string, any>;
}

const fetchMenus = async (): Promise<MenusResponse> => {
  console.log('AdminPage - Starting fetch, URL:', API_URL);
  try {
    console.log('AdminPage - Attempting fetch...');
    const { data } = await axios.get(API_URL);
    console.log('AdminPage - API Data:', data);
    if (!data.success) throw new Error('Failed to fetch menus');
    return data;
  } catch (error) {
    console.error('AdminPage - Fetch Error:', error.message);
    console.error('AdminPage - Error Details:', error.response || error);
    throw error;
  }
};

const updateMenus = async (updatedMenus: Record<string, any>) => {
  const response = await axios.post(API_URL, updatedMenus);
  if (!response.data.success) throw new Error('Failed to update menus');
  return response.data;
};

const INGREDIENT_CATEGORIES = [
  'Baking Supplies', 'Beverages', 'Canned Goods', 'Condiments', 'Dairy', 'Fruits', 'Grains', 'Herbs and Spices',
  'Miscellaneous', 'Nuts and Seeds', 'Oils and Vinegars', 'Proteins', 'Sauces', 'Sweeteners', 'Vegetables', 'Uncategorized'
];

const ITEM_CATEGORIES = [
  'Starters', 'Mains', 'Mains Grill', 'Mains Oven', 'Steaks', 'Pizzas', 'Pastas', 'Risottos', 'Orzotto', 'Side Dishes', 'Desserts',
  'Drinks', 'Soft Drinks', 'Beers & Ciders', 'White Wines', 'Red Wines', 'Rose Wines', 'Sparkling Wines', 'Cocktails', 'Hot Drinks', 'Liqueur Coffees'
];

const AdminPage: React.FC = () => {
  const { menus, selectedMenu, setMenus, setSelectedMenu } = useAppStore();
  const [activeTab, setActiveTab] = useState<'ingredients' | 'recipeItems' | 'resaleItems'>('ingredients');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'ingredient' | 'item'>('ingredient');
  const [modalData, setModalData] = useState<any>(null);

  const { isLoading, error, data } = useQuery('menus', fetchMenus, {
    retry: 1,
    onSuccess: (data) => {
      console.log('AdminPage - onSuccess - Fetched Data:', data);
      setMenus(data.data);
    },
    onError: () => toast.error('Failed to fetch menus')
  });

  if (isLoading) return <div className="flex justify-center items-center h-screen text-foreground">Loading...</div>;
  if (error) return <div className="container mx-auto p-4 text-destructive text-center">Error: {(error as Error).message}</div>;

  console.log('AdminPage - Current Menus State:', menus);
  console.log('AdminPage - Selected Menu:', selectedMenu);

  const currentMenu = menus[selectedMenu] || { initialIngredients: {}, items: [], costMultiplier: 1, categories: [] };
  console.log('AdminPage - Current Menu:', currentMenu);

  const handleEditIngredient = (ingredient: any) => {
    setModalType('ingredient');
    setModalData(ingredient);
    setIsModalOpen(true);
  };

  const handleAddIngredient = () => {
    setModalType('ingredient');
    setModalData(null);
    setIsModalOpen(true);
  };

  const handleEditItem = (item: any) => {
    setModalType('item');
    setModalData(item);
    setIsModalOpen(true);
  };

  const handleAddItem = (isRecipe: boolean) => {
    setModalType('item');
    setModalData({ hasRecipe: isRecipe });
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      const updatedMenus = { ...menus };
      if (modalType === 'ingredient') {
        const updatedIngredients = { ...updatedMenus[selectedMenu].initialIngredients };
        if (modalData?.name) {
          delete updatedIngredients[modalData.name];
          toast.success(`Ingredient "${modalData.name}" deleted successfully`);
        }
        updatedMenus[selectedMenu] = {
          ...updatedMenus[selectedMenu],
          initialIngredients: updatedIngredients
        };
      } else {
        const updatedItems = updatedMenus[selectedMenu].items.filter((item: any) => item.name !== modalData?.name);
        toast.success(`Item "${modalData.name}" deleted successfully`);
        updatedMenus[selectedMenu] = {
          ...updatedMenus[selectedMenu],
          items: updatedItems
        };
      }
      await updateMenus(updatedMenus);
      setMenus(updatedMenus);
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to delete item');
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      const updatedMenus = { ...menus };
      if (modalType === 'ingredient') {
        const updatedIngredients = { ...updatedMenus[selectedMenu].initialIngredients };
        if (modalData?.name && modalData.name !== data.name) {
          delete updatedIngredients[modalData.name];
        }
        updatedIngredients[data.name] = {
          cost: data.unit === 'kg' || data.unit === 'L' ? data.cost / 1000 : data.cost,
          unit: data.unit === 'kg' ? 'g' : data.unit === 'L' ? 'ml' : 'unit',
          category: data.category
        };
        toast.success(`Ingredient "${data.name}" ${modalData ? 'updated' : 'added'} successfully`);
        updatedMenus[selectedMenu] = {
          ...updatedMenus[selectedMenu],
          initialIngredients: updatedIngredients
        };
      } else {
        const updatedItems = updatedMenus[selectedMenu].items.map((item: any) =>
          item.name === modalData?.name ? { ...item, ...data } : item
        );
        if (!modalData) updatedItems.push({ ...data, hasRecipe: !!data.ingredients });
        toast.success(`Item "${data.name}" ${modalData ? 'updated' : 'added'} successfully`);
        updatedMenus[selectedMenu] = {
          ...updatedMenus[selectedMenu],
          items: updatedItems
        };
      }
      await updateMenus(updatedMenus);
      setMenus(updatedMenus);
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to save changes');
    }
  };

  const ingredientFields = [
    { name: 'name', label: 'Name', type: 'text' },
    { name: 'category', label: 'Category', type: 'select', options: INGREDIENT_CATEGORIES },
    { name: 'cost', label: 'Cost (£ per unit)', type: 'number' },
    { name: 'unit', label: 'Unit', type: 'select', options: ['kg', 'L', 'unit'] }
  ];

  const itemFields = [
    { name: 'name', label: 'Name', type: 'text' },
    { name: 'category', label: 'Category', type: 'select', options: ITEM_CATEGORIES },
    { name: 'buyingPrice', label: 'Buying Price (£)', type: 'number' },
    { name: 'sellingPrice', label: 'Selling Price (£)', type: 'number' }
  ];

  const recipeItems = currentMenu.items.filter((item: any) => item.hasRecipe);
  const resaleItems = currentMenu.items.filter((item: any) => !item.hasRecipe);

  return (
    <div className="min-h-screen bg-background">
      <ToastProvider />
      <header className="bg-gradient-navy text-white py-5 shadow-lg">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-accent">Admin Dashboard</h1>
          <nav className="flex space-x-3">
            <Link to="/" className="btn btn-ghost text-white hover:bg-primary-foreground/10">Home</Link>
            <Link to="/analysis" className="btn btn-ghost text-white hover:bg-primary-foreground/10">Analysis</Link>
            <Link to="/admin" className="btn btn-ghost text-accent hover:bg-primary-foreground/10">Admin</Link>
          </nav>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 animate-fade-in">Admin Panel</h1>
        <div className="mb-8 flex justify-center">
          <div className="w-full max-w-md animate-fade-in delay-100">
            <label className="label"><span className="label-text">Select Restaurant Menu</span></label>
            <select
              value={selectedMenu}
              onChange={(e) => setSelectedMenu(e.target.value as 'izMenu' | 'bellFood')}
              className="select w-full"
            >
              <option value="izMenu">IZ Menu</option>
              <option value="bellFood">Bell Menu</option>
            </select>
          </div>
        </div>
        <div className="tabs mb-8 border-b border-border">
          <button
            className={`tab tab-bordered px-4 py-2 text-sm font-medium ${activeTab === 'ingredients' ? 'border-b-2 border-accent text-accent' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('ingredients')}
          >
            Ingredients
          </button>
          <button
            className={`tab tab-bordered px-4 py-2 text-sm font-medium ${activeTab === 'recipeItems' ? 'border-b-2 border-accent text-accent' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('recipeItems')}
          >
            Recipe Items
          </button>
          <button
            className={`tab tab-bordered px-4 py-2 text-sm font-medium ${activeTab === 'resaleItems' ? 'border-b-2 border-accent text-accent' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('resaleItems')}
          >
            Resale Items
          </button>
        </div>
        {activeTab === 'ingredients' && (
          <IngredientTab
            ingredients={currentMenu.initialIngredients}
            items={currentMenu.items}
            onAdd={handleAddIngredient}
            onEdit={handleEditIngredient}
          />
        )}
        {activeTab === 'recipeItems' && (
          <RecipeItemsTab
            recipeItems={recipeItems}
            onAdd={() => handleAddItem(true)}
            onEdit={handleEditItem}
          />
        )}
        {activeTab === 'resaleItems' && (
          <ResaleItemsTab
            resaleItems={resaleItems}
            onAdd={() => handleAddItem(false)}
            onEdit={handleEditItem}
          />
        )}
      </div>
      <GenericModal
        title={modalType === 'ingredient' ? (modalData ? 'Edit Ingredient' : 'Add Ingredient') : (modalData ? 'Edit Item' : 'Add Item')}
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setModalData(null); }}
        fields={modalType === 'ingredient' ? ingredientFields : itemFields}
        data={modalData}
        onSubmit={handleSubmit}
        onDelete={modalData ? handleDelete : undefined}
        initialIngredients={currentMenu.initialIngredients}
      />
    </div>
  );
};

export default AdminPage;