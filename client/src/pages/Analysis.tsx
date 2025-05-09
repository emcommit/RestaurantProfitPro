
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { MenusResponse, MenuInterface } from '../types/menu';
import { calculateRecipeCost } from '../utils/menuUtils';
import { useAppStore } from '../store';

// Custom category order: Recipe items first, resale items last
const CATEGORY_ORDER = [
  'Starters', 'Mains', 'Mains Grill', 'Mains Oven', 'Steaks', 'Pizzas', 'Pastas', 'Risottos', 'Orzotto', 'Side Dishes', 'Desserts',
  'Drinks', 'Soft Drinks', 'Beers & Ciders', 'White Wines', 'Red Wines', 'Rose Wines', 'Sparkling Wines', 'Cocktails', 'Hot Drinks', 'Liqueur Coffees',
  'Baking Supplies', 'Beverages', 'Canned Goods', 'Condiments', 'Dairy', 'Fruits', 'Grains', 'Herbs and Spices', 'Miscellaneous', 'Nuts and Seeds',
  'Oils and Vinegars', 'Proteins', 'Sauces', 'Sweeteners', 'Vegetables', 'Uncategorized'
];

// Determine progress bar color based on profit margin
const getProfitMarginColor = (profitMargin: number): string => {
  if (profitMargin < 60) return 'bg-red-500';
  if (profitMargin <= 70) return 'bg-orange-500';
  if (profitMargin <= 80) return 'bg-yellow-500';
  return 'bg-green-500';
};

const fetchMenus = async (): Promise<MenusResponse> => {
  const { data } = await axios.get('http://localhost:3000/api/menus');
  if (!data.success) throw new Error('Failed to fetch menus');
  return data;
};

const Analysis: React.FC = () => {
  const { selectedMenu, setSelectedMenu } = useAppStore();
  const { data, error, isLoading } = useQuery('menus', fetchMenus, { retry: 1 });

  if (isLoading) return <div className="flex justify-center items-center h-screen text-navy">Loading...</div>;
  if (error) return <div className="container mx-auto p-4 text-red-500 text-center">Error: {(error as Error).message}</div>;

  const menus = data?.data || { 
    izMenu: { items: [], initialIngredients: {}, costMultiplier: 1 }, 
    bellFood: { items: [], initialIngredients: {}, costMultiplier: 1 } 
  };
  const currentMenu: MenuInterface = menus[selectedMenu];

  const ingredientList = Object.entries(currentMenu.initialIngredients).map(([name, { cost, unit, category }]) => ({
    name,
    cost,
    unit,
    category
  }));

  // Calculate items with cost and profit margin
  const itemsWithMetrics = currentMenu.items.map(item => ({
    ...item,
    cost: item.hasRecipe 
      ? calculateRecipeCost(item.ingredients || {}, ingredientList, currentMenu.costMultiplier)
      : item.buyingPrice || 0,
    profitMargin: item.hasRecipe 
      ? ((item.sellingPrice - calculateRecipeCost(item.ingredients || {}, ingredientList, currentMenu.costMultiplier)) / item.sellingPrice * 100).toFixed(2)
      : item.buyingPrice ? ((item.sellingPrice - item.buyingPrice) / item.sellingPrice * 100).toFixed(2) : '0.00'
  }));

  // Get top and bottom 3 recipe and resale items by profit margin
  const recipeItems = itemsWithMetrics.filter(item => item.hasRecipe);
  const resaleItems = itemsWithMetrics.filter(item => !item.hasRecipe);
  const topRecipeItems = recipeItems.sort((a, b) => parseFloat(b.profitMargin) - parseFloat(a.profitMargin)).slice(0, 3);
  const bottomRecipeItems = recipeItems.sort((a, b) => parseFloat(a.profitMargin) - parseFloat(b.profitMargin)).slice(0, 3);
  const topResaleItems = resaleItems.sort((a, b) => parseFloat(b.profitMargin) - parseFloat(a.profitMargin)).slice(0, 3);
  const bottomResaleItems = resaleItems.sort((a, b) => parseFloat(a.profitMargin) - parseFloat(b.profitMargin)).slice(0, 3);

  // Summary statistics
  const recipeStats = {
    totalItems: recipeItems.length,
    avgProfitMargin: recipeItems.length > 0 ? (recipeItems.reduce((sum, item) => sum + parseFloat(item.profitMargin), 0) / recipeItems.length).toFixed(2) : '0.00'
  };
  const resaleStats = {
    totalItems: resaleItems.length,
    avgProfitMargin: resaleItems.length > 0 ? (resaleItems.reduce((sum, item) => sum + parseFloat(item.profitMargin), 0) / resaleItems.length).toFixed(2) : '0.00'
  };

  // Group items by category
  const itemsByCategory: Record<string, any[]> = {};
  itemsWithMetrics.forEach(item => {
    const category = item.category || 'Uncategorized';
    if (!itemsByCategory[category]) itemsByCategory[category] = [];
    itemsByCategory[category].push(item);
  });

  // Sort categories based on CATEGORY_ORDER
  const sortedCategories = Object.keys(itemsByCategory).sort((a, b) => {
    const aIndex = CATEGORY_ORDER.indexOf(a);
    const bIndex = CATEGORY_ORDER.indexOf(b);
    const aPos = aIndex === -1 ? CATEGORY_ORDER.length : aIndex;
    const bPos = bIndex === -1 ? CATEGORY_ORDER.length : bIndex;
    return aPos - bPos;
  });

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
        {/* Dashboard Section */}
        <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
            <div className="card-body p-6">
              <h2 className="card-title text-navy text-xl">Recipe Items Summary</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-navy mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h10m0 0v10m0-10l-6 6" /></svg>
                  <p className="text-gray-700">Total Items: <span className="font-semibold">{recipeStats.totalItems}</span></p>
                </div>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-navy mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" /></svg>
                  <p className="text-gray-700">Avg Profit Margin: <span className="font-semibold">{recipeStats.avgProfitMargin}%</span></p>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-navy mt-4">Top 3 Performers</h3>
              {topRecipeItems.length === 0 ? (
                <p className="text-gray-500">No recipe items found.</p>
              ) : (
                <ul>
                  {topRecipeItems.map(item => (
                    <li key={item.id || item.name} className="mb-3 flex justify-between items-center hover:bg-gray-50 p-2 rounded transition-colors duration-200">
                      <span className="text-gray-800">{item.name} <span className="text-sm text-gray-500">({item.category})</span></span>
                      <div className="flex items-center">
                        <div className="relative w-20 h-3 bg-gray-200 rounded shadow-sm">
                          <div 
                            className={`absolute h-3 rounded ${getProfitMarginColor(parseFloat(item.profitMargin))}`} 
                            style={{ width: `${Math.min(parseFloat(item.profitMargin), 100)}%`, transition: 'width 0.3s ease' }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-800">{item.profitMargin}%</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <h3 className="text-lg font-semibold text-navy mt-4">Bottom 3 Performers</h3>
              {bottomRecipeItems.length === 0 ? (
                <p className="text-gray-500">No recipe items found.</p>
              ) : (
                <ul>
                  {bottomRecipeItems.map(item => (
                    <li key={item.id || item.name} className="mb-3 flex justify-between items-center hover:bg-gray-50 p-2 rounded transition-colors duration-200">
                      <span className="text-gray-800">{item.name} <span className="text-sm text-gray-500">({item.category})</span></span>
                      <div className="flex items-center">
                        <div className="relative w-20 h-3 bg-gray-200 rounded shadow-sm">
                          <div 
                            className={`absolute h-3 rounded ${getProfitMarginColor(parseFloat(item.profitMargin))}`} 
                            style={{ width: `${Math.min(parseFloat(item.profitMargin), 100)}%`, transition: 'width 0.3s ease' }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-800">{item.profitMargin}%</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="card bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
            <div className="card-body p-6">
              <h2 className="card-title text-navy text-xl">Resale Items Summary</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-navy mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h10m0 0v10m0-10l-6 6" /></svg>
                  <p className="text-gray-700">Total Items: <span className="font-semibold">{resaleStats.totalItems}</span></p>
                </div>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-navy mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" /></svg>
                  <p className="text-gray-700">Avg Profit Margin: <span className="font-semibold">{resaleStats.avgProfitMargin}%</span></p>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-navy mt-4">Top 3 Performers</h3>
              {topResaleItems.length === 0 ? (
                <p className="text-gray-500">No resale items found.</p>
              ) : (
                <ul>
                  {topResaleItems.map(item => (
                    <li key={item.id || item.name} className="mb-3 flex justify-between items-center hover:bg-gray-50 p-2 rounded transition-colors duration-200">
                      <span className="text-gray-800">{item.name} <span className="text-sm text-gray-500">({item.category})</span></span>
                      <div className="flex items-center">
                        <div className="relative w-20 h-3 bg-gray-200 rounded shadow-sm">
                          <div 
                            className={`absolute h-3 rounded ${getProfitMarginColor(parseFloat(item.profitMargin))}`} 
                            style={{ width: `${Math.min(parseFloat(item.profitMargin), 100)}%`, transition: 'width 0.3s ease' }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-800">{item.profitMargin}%</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <h3 className="text-lg font-semibold text-navy mt-4">Bottom 3 Performers</h3>
              {bottomResaleItems.length === 0 ? (
                <p className="text-gray-500">No resale items found.</p>
              ) : (
                <ul>
                  {bottomResaleItems.map(item => (
                    <li key={item.id || item.name} className="mb-3 flex justify-between items-center hover:bg-gray-50 p-2 rounded transition-colors duration-200">
                      <span className="text-gray-800">{item.name} <span className="text-sm text-gray-500">({item.category})</span></span>
                      <div className="flex items-center">
                        <div className="relative w-20 h-3 bg-gray-200 rounded shadow-sm">
                          <div 
                            className={`absolute h-3 rounded ${getProfitMarginColor(parseFloat(item.profitMargin))}`} 
                            style={{ width: `${Math.min(parseFloat(item.profitMargin), 100)}%`, transition: 'width 0.3s ease' }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-800">{item.profitMargin}%</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        {/* Category Tables */}
        <div className="card bg-white shadow-lg rounded-lg">
          <div className="card-body p-6">
            <h2 className="card-title text-navy text-xl">Menu Analysis</h2>
            {sortedCategories.length === 0 ? (
              <p className="text-gray-500">No items found for this menu.</p>
            ) : (
              sortedCategories.map(category => (
                <div key={category} className="mb-10">
                  <h3 className="text-2xl font-semibold text-navy mb-4">{category}</h3>
                  <div className="overflow-x-auto">
                    <table className="table w-full table-zebra">
                      <thead>
                        <tr className="text-navy">
                          <th className="text-left">Name</th>
                          <th className="text-left">Description</th>
                          <th className="text-right">Selling Price (£)</th>
                          <th className="text-right">Cost (£)</th>
                          <th className="text-right">Profit Margin (%)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {itemsByCategory[category].map((item, index) => (
                          <tr key={item.id || `${item.name}-${item.category}-${index}`} className="hover:bg-gray-50 transition-colors duration-200">
                            <td className="text-gray-800">{item.name}</td>
                            <td className="text-gray-600">{item.hasRecipe ? (item.description || 'No description available') : ''}</td>
                            <td className="text-right text-gray-800">£{item.sellingPrice.toFixed(2)}</td>
                            <td className="text-right text-gray-800">£{item.cost.toFixed(2)}</td>
                            <td className="text-right">
                              <div className="flex items-center justify-end">
                                <div className="relative w-20 h-3 bg-gray-200 rounded shadow-sm">
                                  <div 
                                    className={`absolute h-3 rounded ${getProfitMarginColor(parseFloat(item.profitMargin))}`} 
                                    style={{ width: `${Math.min(parseFloat(item.profitMargin), 100)}%`, transition: 'width 0.3s ease' }}
                                  ></div>
                                </div>
                                <span className="ml-2 text-sm font-medium text-gray-800">{item.profitMargin}%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;