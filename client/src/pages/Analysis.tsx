import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAppStore } from '../store';
import FilterBar from '../components/common/FilterBar';
import GenericModal from '../components/common/GenericModal';
import ToastProvider from '../components/common/ToastProvider';
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
    onSuccess: (data) => setMenus(data.data),
    onError: () => toast.error('Failed to fetch menus')
  });

  const currentMenu = menus[selectedMenu] || { initialIngredients: {}, items: [], costMultiplier: 1 };

  const ingredientList = useMemo(() => {
    return Object.entries(currentMenu.initialIngredients).map(([name, { cost, unit, category }]) => ({
      name,
      cost,
      unit,
      category
    }));
  }, [currentMenu.initialIngredients]);

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
        <div className="relative w-20 h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`absolute h-3 rounded-full ${getProfitMarginColor(parseFloat(item.hasRecipe ? calculateProfitMargin(item.sellingPrice, calculateRecipeCost(item.ingredients || {}, ingredientList, currentMenu.costMultiplier)) : item.buyingPrice ? calculateProfitMargin(item.sellingPrice, item.buyingPrice) : '0.00'))}`}
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
            <span className="ml-2 text-sm font-medium text-foreground">{item.profitMargin}%</span>
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
        {isLoading ? (
          <div className="flex justify-center items-center h-[calc(100vh-5rem)] text-foreground">Loading...</div>
        ) : error ? (
          <div className="container mx-auto p-4 text-destructive text-center">Error: {(error as Error).message}</div>
        ) : (
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
                <FilterBar
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  categories={uniqueCategories}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                />
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
        )}
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