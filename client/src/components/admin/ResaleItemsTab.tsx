import React, { useState } from 'react';
import ItemModal from './ItemModal';
import useMenuData from '../../hooks/useMenuData';

const CATEGORY_ORDER = [
  'Starters', 'Mains', 'Mains Grill', 'Mains Oven', 'Steaks', 'Pizzas', 'Pastas', 'Risottos', 'Orzotto', 'Side Dishes', 'Desserts',
  'Drinks', 'Soft Drinks', 'Beers & Ciders', 'White Wines', 'Red Wines', 'Rose Wines', 'Sparkling Wines', 'Cocktails', 'Hot Drinks', 'Liqueur Coffees',
  'Baking Supplies', 'Beverages', 'Canned Goods', 'Condiments', 'Dairy', 'Fruits', 'Grains', 'Herbs and Spices', 'Miscellaneous', 'Nuts and Seeds',
  'Oils and Vinegars', 'Proteins', 'Sauces', 'Sweeteners', 'Vegetables', 'Uncategorized'
];

const ResaleItemsTab: React.FC = () => {
  const { menus, currentMenu, isLoading, error } = useMenuData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | ''>('');

  const resaleItems = currentMenu.items.filter(item => !item.hasRecipe) || [];

  let filteredItems = resaleItems;

  if (searchTerm) {
    filteredItems = filteredItems.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (filterCategory) {
    filteredItems = filteredItems.filter(item => 
      item.category === filterCategory
    );
  }

  if (sortOrder) {
    filteredItems = [...filteredItems].sort((a, b) => {
      const costA = a.buyingPrice || 0;
      const costB = b.buyingPrice || 0;
      if (sortOrder === 'asc') {
        return costA - costB;
      } else {
        return costB - costA;
      }
    });
  }

  const itemsByCategory: Record<string, any[]> = {};
  filteredItems.forEach(item => {
    const category = item.category || 'Uncategorized';
    if (!itemsByCategory[category]) itemsByCategory[category] = [];
    itemsByCategory[category].push({ ...item, menuData: menus });
  });

  const sortedCategories = Object.keys(itemsByCategory).sort((a, b) => {
    const aIndex = CATEGORY_ORDER.indexOf(a);
    const bIndex = CATEGORY_ORDER.indexOf(b);
    const aPos = aIndex === -1 ? CATEGORY_ORDER.length : aIndex;
    const bPos = bIndex === -1 ? CATEGORY_ORDER.length : bIndex;
    return aPos - bPos;
  });

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-navy tracking-wide">Resale Items</h2>
        <button 
          className="btn btn-primary hover:scale-105 transition-transform duration-200" 
          onClick={() => { setSelectedItem(null); setIsModalOpen(true); }}
        >
          Add Resale Item
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
            {CATEGORY_ORDER.map(category => (
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
      ) : sortedCategories.length === 0 ? (
        <p className="text-center text-gray-500">No resale items found.</p>
      ) : (
        sortedCategories.map(category => (
          <div key={category} className="mb-8">
            <h3 className="text-lg font-semibold text-navy mb-3 tracking-wide">{category}</h3>
            <div className="overflow-x-auto">
              <table className="table w-full border-separate border-spacing-0">
                <thead>
                  <tr className="text-navy bg-gray-100">
                    <th className="w-2/5 text-left px-4 py-3 font-semibold border-b border-gray-200">Name</th>
                    <th className="w-2/5 text-left px-4 py-3 font-semibold border-b border-gray-200">Category</th>
                    <th className="w-1/5 text-right px-4 py-3 font-semibold border-b border-gray-200">Cost (£)</th>
                    <th className="w-1/5 text-right px-4 py-3 font-semibold border-b border-gray-200">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {itemsByCategory[category].map(item => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="text-gray-800 px-4 py-3 border-b border-gray-200 truncate">{item.name}</td>
                      <td className="text-gray-600 px-4 py-3 border-b border-gray-200 truncate">{item.category}</td>
                      <td className="text-right text-gray-800 px-4 py-3 border-b border-gray-200">£{(item.buyingPrice || 0).toFixed(2)}</td>
                      <td className="text-right px-4 py-3 border-b border-gray-200">
                        <button 
                          className="btn btn-ghost text-navy hover:bg-gray-200 hover:scale-105 transition-transform duration-200" 
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
      {isModalOpen && (
        <ItemModal 
          onClose={() => { setIsModalOpen(false); setSelectedItem(null); }} 
          item={selectedItem} 
        />
      )}
    </div>
  );
};

export default ResaleItemsTab;