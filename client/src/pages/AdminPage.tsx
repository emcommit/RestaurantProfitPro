import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useAppStore } from '../store';
import GenericModal from '../components/common/GenericModal';
import IngredientTab from '../components/admin/IngredientTab';
import RecipeItemsTab from '../components/admin/RecipeItemsTab';
import ResaleItemsTab from '../components/admin/ResaleItemsTab';

interface MenusResponse {
  success: boolean;
  data: Record<string, any>;
}

const fetchMenus = async (): Promise<MenusResponse> => {
  const { data } = await axios.get('http://localhost:3000/api/menus');
  if (!data.success) throw new Error('Failed to fetch menus');
  return data;
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

  const { isLoading, error } = useQuery('menus', fetchMenus, {
    retry: 1,
    onSuccess: (data) => setMenus(data.data)
  });

  if (isLoading) return <div className="flex justify-center items-center h-screen text-navy">Loading...</div>;
  if (error) return <div className="container mx-auto p-4 text-red-500 text-center">Error: {(error as Error).message}</div>;

  const currentMenu = menus[selectedMenu];

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

  const handleDelete = () => {
    setMenus(prev => {
      if (modalType === 'ingredient') {
        const updatedIngredients = { ...prev[selectedMenu].initialIngredients };
        if (modalData?.name) {
          delete updatedIngredients[modalData.name];
        }
        return {
          ...prev,
          [selectedMenu]: {
            ...prev[selectedMenu],
            initialIngredients: updatedIngredients
          }
        };
      } else {
        const updatedItems = prev[selectedMenu].items.filter((item: any) => item.name !== modalData?.name);
        return {
          ...prev,
          [selectedMenu]: {
            ...prev[selectedMenu],
            items: updatedItems
          }
        };
      }
    });
    setIsModalOpen(false);
  };

  const handleSubmit = (data: any) => {
    setMenus(prev => {
      if (modalType === 'ingredient') {
        const updatedIngredients = { ...prev[selectedMenu].initialIngredients };
        if (modalData?.name && modalData.name !== data.name) {
          delete updatedIngredients[modalData.name];
        }
        updatedIngredients[data.name] = {
          cost: data.unit === 'kg' || data.unit === 'L' ? data.cost / 1000 : data.cost,
          unit: data.unit === 'kg' ? 'g' : data.unit === 'L' ? 'ml' : 'unit',
          category: data.category
        };
        return {
          ...prev,
          [selectedMenu]: {
            ...prev[selectedMenu],
            initialIngredients: updatedIngredients
          }
        };
      } else {
        const updatedItems = prev[selectedMenu].items.map((item: any) =>
          item.name === modalData?.name ? { ...item, ...data } : item
        );
        if (!modalData) updatedItems.push({ ...data, hasRecipe: !!data.ingredients });
        return {
          ...prev,
          [selectedMenu]: {
            ...prev[selectedMenu],
            items: updatedItems
          }
        };
      }
    });
    setIsModalOpen(false);
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
    <div className="min-h-screen bg-gray-100">
      <header className="bg-navy text-white py-4 shadow-md">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gold">Admin Dashboard</h1>
          <nav className="flex space-x-2">
            <Link to="/" className="btn btn-ghost text-white hover:bg-navy-700">Home</Link>
            <Link to="/analysis" className="btn btn-ghost text-white hover:bg-navy-700">Analysis</Link>
            <Link to="/admin" className="btn btn-ghost text-gold hover:bg-navy-700">Admin</Link>
          </nav>
        </div>
      </header>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-navy text-center mb-8">Admin Panel</h1>
        <div className="mb-6 flex justify-center">
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
        <div className="tabs mb-6">
          <button
            className={`tab tab-bordered ${activeTab === 'ingredients' ? 'tab-active text-navy' : 'text-gray-500'}`}
            onClick={() => setActiveTab('ingredients')}
          >
            Ingredients
          </button>
          <button
            className={`tab tab-bordered ${activeTab === 'recipeItems' ? 'tab-active text-navy' : 'text-gray-500'}`}
            onClick={() => setActiveTab('recipeItems')}
          >
            Recipe Items
          </button>
          <button
            className={`tab tab-bordered ${activeTab === 'resaleItems' ? 'tab-active text-navy' : 'text-gray-500'}`}
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