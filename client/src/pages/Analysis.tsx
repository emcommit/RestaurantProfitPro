import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { API_URL } from '../config';
import { toast } from 'react-toastify';
import ToastProvider from '../components/common/ToastProvider';

// Placeholder imports (to be recreated or verified)
import GenericModal from '../components/common/GenericModal';
import SummarySection from '../components/analysis/SummarySection';
import CategoryTable from '../components/analysis/CategoryTable';
import { calculateRecipeCost, calculateProfitMargin, getProfitMarginColor } from '../utils/menuUtils';

interface MenusResponse {
  success: boolean;
  data: Record<string, any>;
}

const fetchMenus = async (): Promise<MenusResponse> => {
  console.log('Analysis - Starting fetch, URL:', API_URL);
  try {
    console.log('Analysis - Attempting fetch...');
    const { data } = await axios.get("http://localhost:3000/api/menus") ;
        console.log('Analysis - API Data:', data);
    if (!data.success) throw new Error('Failed to fetch menus');
    return data;
  } catch (error) {
    console.error('Analysis - Fetch Error:', error.message);
    console.error('Analysis - Error Details:', error.response || error);
    throw error;
  }
};

const CATEGORY_ORDER = [
  'Starters', 'Mains', 'Mains Grill', 'Mains Oven', 'Steaks', 'Pizzas', 'Pastas', 'Risottos', 'Orzotto', 'Side Dishes', 'Desserts',
  'Drinks', 'Soft Drinks', 'Beers & Ciders', 'White Wines', 'Red Wines', 'Rose Wines', 'Sparkling Wines', 'Cocktails', 'Hot Drinks', 'Liqueur Coffees',
  'Baking Supplies', 'Beverages', 'Canned Goods', 'Condiments', 'Dairy', 'Fruits', 'Grains', 'Herbs and Spices', 'Miscellaneous', 'Nuts and Seeds',
  'Oils and Vinegars', 'Proteins', 'Sauces', 'Sweeteners', 'Vegetables', 'Uncategorized'
];

const Analysis: React.FC = () => {
  const [isIngredientsModalOpen, setIsIngredientsModalOpen] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState<any[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<'izMenu' | 'bellFood'>('izMenu');

  const { isLoading, error, data } = useQuery('menus', fetchMenus, {
    retry: 1,
    onError: () => toast.error('Failed to fetch menus')
  });

  useEffect(() => {
    console.log('Analysis - Component re-rendered');
  });

  if (isLoading) return <div className="flex justify-center items-center h-screen text-foreground">Loading...</div>;
  if (error) return <div className="container mx-auto p-4 text-destructive text-center">Error: {(error as Error).message}</div>;

  console.log('Analysis - Fetched Data:', data);

  const currentMenu = data.data[selectedMenu] || { initialIngredients: {}, items: [], costMultiplier: 1 };
  console.log('Analysis - Current Menu:', currentMenu);

  const ingredientList = Object.entries(currentMenu.initialIngredients).map(([name, { cost, unit, category }]) => ({
    name,
    cost,
    unit,
    category
  }));

  const itemsWithMetrics = currentMenu.items.map((item: any) => {
    const cost = item.hasRecipe
      ? calculateRecipeCost(item.ingredients || {}, ingredientList, currentMenu.costMultiplier)
      : item.buyingPrice || 0;
    const profitMargin = item.hasRecipe
      ? calculateProfitMargin(item.sellingPrice, cost)
      : item.buyingPrice
        ? calculateProfitMargin(item.sellingPrice, item.buyingPrice)
        : '0.00';
    return {
      ...item,
      cost,
      profitMargin
    };
  });

  const recipeItems = itemsWithMetrics.filter((item: any) => item.hasRecipe);
  const resaleItems = itemsWithMetrics.filter((item: any) => !item.hasRecipe);

  const topRecipeItems = [...recipeItems]
    .sort((a, b) => parseFloat(b.profitMargin) - parseFloat(a.profitMargin))
    .slice(0, 3)
    .map(item => ({
      name: item.name,
      category: item.category,
      profitMargin: `${item.profitMargin}%`,
      tooltip: `${item.profitMargin}%`
    }));

  const bottomRecipeItems = [...recipeItems]
    .sort((a, b) => parseFloat(a.profitMargin) - parseFloat(b.profitMargin))
    .slice(0, 3)
    .map(item => ({
      name: item.name,
      category: item.category,
      profitMargin: `${item.profitMargin}%`,
      tooltip: `${item.profitMargin}%`
    }));

  const topResaleItems = [...resaleItems]
    .sort((a, b) => parseFloat(b.profitMargin) - parseFloat(a.profitMargin))
    .slice(0, 3)
    .map(item => ({
      name: item.name,
      category: item.category,
      profitMargin: `${item.profitMargin}%`,
      tooltip: `${item.profitMargin}%`
    }));

  const bottomResaleItems = [...resaleItems]
    .sort((a, b) => parseFloat(a.profitMargin) - parseFloat(b.profitMargin))
    .slice(0, 3)
    .map(item => ({
      name: item.name,
      category: item.category,
      profitMargin: `${item.profitMargin}%`,
      tooltip: `${item.profitMargin}%`
    }));

  const recipeStats = {
    totalItems: recipeItems.length,
    avgProfitMargin: recipeItems.length > 0 ? (recipeItems.reduce((sum: number, item: any) => sum + parseFloat(item.profitMargin), 0) / recipeItems.length).toFixed(2) : '0.00'
  };

  const resaleStats = {
    totalItems: resaleItems.length,
    avgProfitMargin: resaleItems.length > 0 ? (resaleItems.reduce((sum: number, item: any) => sum + parseFloat(item.profitMargin), 0) / resaleItems.length).toFixed(2) : '0.00'
  };

  const filteredItems = itemsWithMetrics; // Temporarily bypass filtering

  const uniqueCategories = ['All', ...Array.from(new Set(itemsWithMetrics.map((item: any) => item.category || 'Uncategorized')))];

  const itemsByCategory: Record<string, any[]> = {};
  filteredItems.forEach((item: any) => {
    const category = item.category || 'Uncategorized';
    if (!itemsByCategory[category]) itemsByCategory[category] = [];
    const profitMargin = parseFloat(item.profitMargin);
    itemsByCategory[category].push({
      name: item.name,
      description: item.hasRecipe ? (item.description || 'No description available') : '',
      sellingPrice: `£${item.sellingPrice.toFixed(2)}`,
      cost: `£${item.cost.toFixed(2)}`,
      profitMargin: (
        <div className="flex items-center justify-end">
          <div className="relative w-20 h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`absolute h-3 rounded-full ${getProfitMarginColor(profitMargin)}`}
              style={{ width: `${Math.min(profitMargin, 100)}%`, transition: 'width 0.3s ease' }}
            ></div>
          </div>
          <span className="ml-2 text-sm font-medium text-foreground">{item.profitMargin}%</span>
        </div>
      ),
      tooltip: `${item.profitMargin}%`
    });
  });

  const sortedCategories = Object.keys(itemsByCategory).sort((a, b) => {
    const aIndex = CATEGORY_ORDER.indexOf(a);
    const bIndex = CATEGORY_ORDER.indexOf(b);
    const aPos = aIndex === -1 ? CATEGORY_ORDER.length : aIndex;
    const bPos = bIndex === -1 ? CATEGORY_ORDER.length : bIndex;
    return aPos - bPos;
  });

  const handleItemClick = (item: any) => {
    const ingredientsArray = Object.entries(item.ingredients || {}).map(([name, quantity]) => {
      const details = currentMenu.initialIngredients[name] || {};
      const unit = details.unit || 'g/ml';
      let costPerBaseUnit = details.cost || 0;
      let baseUnit = unit;

      if (unit === 'kg') {
        costPerBaseUnit = details.cost / 1000;
        baseUnit = 'g';
      } else if (unit === 'L') {
        costPerBaseUnit = details.cost / 1000;
        baseUnit = 'ml';
      }

      return {
        name,
        quantity: `${quantity}${baseUnit}`,
        totalCost: (quantity as number) * costPerBaseUnit
      };
    });
    setSelectedIngredients(ingredientsArray);
    setIsIngredientsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <ToastProvider />
      <header className="bg-gradient-navy text-white py-5 shadow-lg">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-accent">Restaurant Analytics</h1>
          <nav className="flex space-x-3">
            <Link to="/" className="btn btn-ghost text-white hover:bg-primary-foreground/10">Home</Link>
            <Link to="/analysis" className="btn btn-ghost text-accent hover:bg-primary-foreground/10">Analysis</Link>
            <Link to="/admin" className="btn btn-ghost text-white hover:bg-primary-foreground/10">Admin</Link>
          </nav>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8">
        <>
          <h1 className="mb-8 animate-fade-in">Profit Analysis</h1>
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
          <div className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SummarySection
              title="Recipe Items Summary"
              stats={recipeStats}
              topItems={topRecipeItems}
              bottomItems={bottomRecipeItems}
              onRowClick={(row) => handleItemClick(recipeItems.find(item => item.name === row.name))}
            />
            <SummarySection
              title="Resale Items Summary"
              stats={resaleStats}
              topItems={topResaleItems}
              bottomItems={bottomResaleItems}
            />
          </div>
          <div className="card animate-fade-in delay-300">
            <div className="card-body">
              <h2 className="card-title">Menu Analysis</h2>
              {sortedCategories.length === 0 ? (
                <p className="text-muted-foreground">No items found for this menu.</p>
              ) : (
                sortedCategories.map(category => (
                  <CategoryTable
                    key={category}
                    category={category}
                    items={itemsByCategory[category]}
                    onRowClick={(row) => {
                      const item = itemsWithMetrics.find((i: any) => i.name === row.name);
                      if (item?.hasRecipe) handleItemClick(item);
                    }}
                  />
                ))
              )}
            </div>
          </div>
        </>
      </div>
      <GenericModal
        title="Ingredients for Recipe"
        isOpen={isIngredientsModalOpen}
        onClose={() => { setIsIngredientsModalOpen(false); setSelectedIngredients([]); }}
        tableData={selectedIngredients}
        readOnly={true}
      />
    </div>
  );
};

export default Analysis;