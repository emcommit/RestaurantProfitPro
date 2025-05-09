import React, { useState } from 'react';
import IngredientModal from './IngredientModal';
import useMenuData from '../../hooks/useMenuData';

const INGREDIENT_CATEGORIES = [
  'Baking Supplies', 'Beverages', 'Canned Goods', 'Condiments', 'Dairy', 'Fruits', 'Grains', 'Herbs and Spices',
  'Miscellaneous', 'Nuts and Seeds', 'Oils and Vinegars', 'Proteins', 'Sauces', 'Sweeteners', 'Vegetables', 'Uncategorized'
];

const IngredientManagementTab: React.FC = () => {
  const { currentMenu, isLoading, error } = useMenuData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | ''>('');

  let ingredientList = Object.entries(currentMenu.initialIngredients || {}).map(([name, { cost, unit, category }]) => ({
    name,
    cost,
    unit,
    category
  }));

  if (searchTerm) {
    ingredientList = ingredientList.filter(ingredient => 
      ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (filterCategory) {
    ingredientList = ingredientList.filter(ingredient => 
      (ingredient.category || 'Uncategorized') === filterCategory
    );
  }

  if (sortOrder) {
    ingredientList = [...ingredientList].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.cost - b.cost;
      } else {
        return b.cost - a.cost;
      }
    });
  }

  const handleEdit = (ingredient: any) => {
    setSelectedIngredient(ingredient);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-navy tracking-wide">Ingredients Management</h2>
        <button 
          className="btn btn-primary hover:scale-105 transition-transform duration-200" 
          onClick={() => { setSelectedIngredient(null); setIsModalOpen(true); }}
        >
          Add Ingredient
        </button>
      </div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
        <div className="w-full sm:w-1/3">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full bg-white text-navy shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg focus:ring-2 focus:ring-accent-500"
          />
        </div>
        <div className="w-full sm:w-1/3">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="select select-bordered w-full bg-white text-navy shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg focus:ring-2 focus:ring-accent-500"
          >
            <option value="">All Categories</option>
            {INGREDIENT_CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div className="flex space-x-2">
          <button
            className={`btn btn-ghost text-navy hover:bg-gray-200 hover:scale-105 transition-transform duration-200 rounded-lg px-4 py-2 ${sortOrder === 'asc' ? 'bg-gray-200' : ''}`}
            onClick={() => setSortOrder(sortOrder === 'asc' ? '' : 'asc')}
          >
            Sort Cost ↑
          </button>
          <button
            className={`btn btn-ghost text-navy hover:bg-gray-200 hover:scale-105 transition-transform duration-200 rounded-lg px-4 py-2 ${sortOrder === 'desc' ? 'bg-gray-200' : ''}`}
            onClick={() => setSortOrder(sortOrder === 'desc' ? '' : 'desc')}
          >
            Sort Cost ↓
          </button>
        </div>
      </div>
      {isLoading ? (
        <div className="text-center text-navy">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">Error: {error}</div>
      ) : ingredientList.length === 0 ? (
        <p className="text-center text-gray-500">No ingredients found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full border-separate border-spacing-0">
            <thead>
              <tr className="text-navy bg-gray-100">
                <th className="w-2/6 text-left px-4 py-3 font-semibold border-b border-gray-200">Name</th>
                <th className="w-2/6 text-left px-4 py-3 font-semibold border-b border-gray-200">Category</th>
                <th className="w-1/6 text-right px-4 py-3 font-semibold border-b border-gray-200">Cost (£)</th>
                <th className="w-1/6 text-right px-4 py-3 font-semibold border-b border-gray-200">Unit</th>
                <th className="w-1/6 text-right px-4 py-3 font-semibold border-b border-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ingredientList.map((ingredient, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="text-gray-800 px-4 py-3 border-b border-gray-200 truncate">{ingredient.name}</td>
                  <td className="text-gray-600 px-4 py-3 border-b border-gray-200 truncate">{ingredient.category || 'N/A'}</td>
                  <td className="text-right text-gray-800 px-4 py-3 border-b border-gray-200">£{ingredient.cost.toFixed(2)}</td>
                  <td className="text-right text-gray-800 px-4 py-3 border-b border-gray-200">{ingredient.unit}</td>
                  <td className="text-right px-4 py-3 border-b border-gray-200">
                    <button 
                      className="btn btn-ghost text-navy hover:bg-gray-200 hover:scale-105 transition-transform duration-200" 
                      onClick={() => handleEdit(ingredient)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {isModalOpen && (
        <IngredientModal 
          onClose={() => { setIsModalOpen(false); setSelectedIngredient(null); }} 
          ingredient={selectedIngredient} 
        />
      )}
    </div>
  );
};

export default IngredientManagementTab;