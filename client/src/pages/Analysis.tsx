import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useAppStore } from '../store';
import FilterBar from '../components/common/FilterBar';
import GenericModal from '../components/common/GenericModal';
import SummarySection from '../components/analysis/SummarySection';
import CategoryTable from '../components/analysis/CategoryTable';
import useSearchAndFilter from '../hooks/useSearchAndFilter';
import { calculateRecipeCost, calculateProfitMargin, getProfitMarginColor } from '../utils/menuUtils';

interface MenusResponse {
  success: boolean;
  data: Record<string, any>;
}

const fetchMenus = async (): Promise<MenusResponse> => {
  const { data } = await axios.get('http://localhost:3000/api/menus');
  if (!data.success) throw new Error('Failed to fetch menus');
  return data;
};

const CATEGORY_ORDER = [
  'Starters', 'Mains', 'Mains Grill', 'Mains Oven', 'Steaks', 'Pizzas', 'Pastas', 'Risottos', 'Orzotto', 'Side Dishes', 'Desserts',
  'Drinks', 'Soft Drinks', 'Beers & Ciders', 'White Wines', 'Red Wines', 'Rose Wines', 'Sparkling Wines', 'Cocktails', 'Hot Drinks', 'Liqueur Coffees',
  'Baking Supplies', 'Beverages', 'Canned Goods', 'Condiments', 'Dairy', 'Fruits', 'Grains', 'Herbs and Spices', 'Miscellaneous', 'Nuts and Seeds',
  'Oils and Vinegars', 'Proteins', 'Sauces', 'Sweeteners', 'Vegetables', 'Uncategorized'
];

const Analysis: React.FC = () => {
  const { menus, selectedMenu, setMenus, setSelectedMenu } = useAppStore();
  const [isIngredientsModalOpen, setIsIngredientsModalOpen] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState<any[]>([]);

  const { isLoading, error } = useQuery('menus', fetchMenus, {
    retry: 1,
    onSuccess: (data) => setMenus(data.data)
  });

  if (isLoading) return <div className="flex justify-center items-center h-screen text-navy">Loading...</div>;
  if (error) return <div className="container mx-auto p-4 text-red-500 text-center">Error: {(error as Error).message}</div>;

  const currentMenu = menus[selectedMenu];

  // Memoize ingredientList to prevent recomputation
  const ingredientList = useMemo(() => {
    return Object.entries(currentMenu.initialIngredients).map(([name, { cost, unit, category }]) => ({
      name,
      cost,
      unit,
      category
    }));
  }, [currentMenu.initialIngredients]);

  // Memoize itemsWithMetrics
  const itemsWithMetrics = useMemo(() => {
    return currentMenu.items.map((item: any) => ({
      ...item,
      cost: item.hasRecipe
        ? calculateRecipeCost(item.ingredients || {}, ingredientList, currentMenu.costMultiplier)
        : item.buyingPrice || 0,
      profitMargin: item.hasRecipe
        ? calculateProfitMargin(item.sellingPrice, calculateRecipeCost(item.ingredients || {}, ingredientList, currentMenu.costMultiplier))
        : item.buyingPrice
          ? calculateProfitMargin(item.sellingPrice, item.buyingPrice)
          : '0.00',
      profitMarginBar: (
        <div className="relative w-20 h-3 bg-gray-200 rounded shadow-sm">
          <div
            className={`absolute h-3 rounded ${getProfitMarginColor(parseFloat(item.hasRecipe ? calculateProfitMargin(item.sellingPrice, calculateRecipeCost(item.ingredients || {}, ingredientList, currentMenu.costMultiplier)) : item.buyingPrice ? calculateProfitMargin(item.sellingPrice, item.buyingPrice) : '0.00'))}`}
            style={{ width: `${Math.min(parseFloat(item.hasRecipe ? calculateProfitMargin(item.sellingPrice, calculateRecipeCost(item.ingredients || {}, ingredientList, currentMenu.costMultiplier)) : item.buyingPrice ? calculateProfitMargin(item.sellingPrice, item.buyingPrice) : '0.00'), 100)}%`, transition: 'width 0.3s ease' }}
          ></div>
        </div>
      )
    }));
  }, [currentMenu.items, ingredientList, currentMenu.costMultiplier]);

  const recipeItems = useMemo(() => itemsWithMetrics.filter((item: any) => item.hasRecipe), [itemsWithMetrics]);
  const resaleItems = useMemo(() => itemsWithMetrics.filter((item: any) => !item.hasRecipe), [itemsWithMetrics]);

  const topRecipeItems = useMemo(() =>
    [...recipeItems]
      .sort((a, b) => parseFloat(b.profitMargin) - parseFloat(a.profitMargin))
      .slice(0, 3)
      .map(item => ({
        name: item.name,
        category: item.category,
        profitMargin: `${item.profitMargin}%`,
        profitMarginBar: item.profitMarginBar,
        tooltip: `${item.profitMargin}%`
      })), [recipeItems]
  );

  const bottomRecipeItems = useMemo(() =>
    [...recipeItems]
      .sort((a, b) => parseFloat(a.profitMargin) - parseFloat(b.profitMargin))
      .slice(0, 3)
      .map(item => ({
        name: item.name,
        category: item.category,
        profitMargin: `${item.profitMargin}%`,
        profitMarginBar: item.profitMarginBar,
        tooltip: `${item.profitMargin}%`
      })), [recipeItems]
  );

  const topResaleItems = useMemo(() =>
    [...resaleItems]
      .sort((a, b) => parseFloat(b.profitMargin) - parseFloat(a.profitMargin))
      .slice(0, 3)
      .map(item => ({
        name: item.name,
        category: item.category,
        profitMargin: `${item.profitMargin}%`,
        profitMarginBar: item.profitMarginBar,
        tooltip: `${item.profitMargin}%`
      })), [resaleItems]
  );

  const bottomResaleItems = useMemo(() =>
    [...resaleItems]
      .sort((a, b) => parseFloat(a.profitMargin) - parseFloat(b.profitMargin))
      .slice(0, 3)
      .map(item => ({
        name: item.name,
        category: item.category,
        profitMargin: `${item.profitMargin}%`,
        profitMarginBar: item.profitMarginBar,
        tooltip: `${item.profitMargin}%`
      })), [resaleItems]
  );

  const recipeStats = useMemo(() => ({
    totalItems: recipeItems.length,
    avgProfitMargin: recipeItems.length > 0 ? (recipeItems.reduce((sum: number, item: any) => sum + parseFloat(item.profitMargin), 0) / recipeItems.length).toFixed(2) : '0.00'
  }), [recipeItems]);

  const resaleStats = useMemo(() => ({
    totalItems: resaleItems.length,
    avgProfitMargin: resaleItems.length > 0 ? (resaleItems.reduce((sum: number, item: any) => sum + parseFloat(item.profitMargin), 0) / resaleItems.length).toFixed(2) : '0.00'
  }), [resaleItems]);

  const { filteredItems, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, uniqueCategories } = useSearchAndFilter({
    items: itemsWithMetrics,
    searchField: 'name',
    categoryField: 'category'
  });

  const itemsByCategory = useMemo(() => {
    const grouped: Record<string, any[]> = {};
    filteredItems.forEach((item: any) => {
      const category = item.category || 'Uncategorized';
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push({
        name: item.name,
        description: item.hasRecipe ? (item.description || 'No description available') : '',
        sellingPrice: `£${item.sellingPrice.toFixed(2)}`,
        cost: `£${item.cost.toFixed(2)}`,
        profitMargin: (
          <div className="flex items-center justify-end">
            {item.profitMarginBar}
            <span className="ml-2 text-sm font-medium text-gray-800">{item.profitMargin}%</span>
          </div>
        ),
        tooltip: `${item.profitMargin}%`
      });
    });
    return grouped;
  }, [filteredItems]);

  const sortedCategories = useMemo(() => {
    return Object.keys(itemsByCategory).sort((a, b) => {
      const aIndex = CATEGORY_ORDER.indexOf(a);
      const bIndex = CATEGORY_ORDER.indexOf(b);
      const aPos = aIndex === -1 ? CATEGORY_ORDER.length : aIndex;
      const bPos = bIndex === -1 ? CATEGORY_ORDER.length : bIndex;
      return aPos - bPos;
    });
  }, [itemsByCategory]);

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
    <div className="min-h-screen bg-gray-100">
      <header className="bg-navy text-white py-4 shadow-md">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gold">Restaurant Analytics</h1>
          <nav className="flex space-x-2">
            <Link to="/" className="btn btn-ghost text-white hover:bg-navy-700">Home</Link>
            <Link to="/analysis" className="btn btn-ghost text-gold hover:bg-navy-700">Analysis</Link>
            <Link to="/admin" className="btn btn-ghost text-white hover:bg-navy-700">Admin</Link>
          </nav>
        </div>
      </header>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-navy text-center mb-8">Profit Analysis</h1>
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
        <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <div className="card bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
          <div className="card-body p-6">
            <h2 className="card-title text-navy text-xl">Menu Analysis</h2>
            <FilterBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              categories={uniqueCategories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
            {sortedCategories.length === 0 ? (
              <p className="text-gray-500">No items found for this menu.</p>
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