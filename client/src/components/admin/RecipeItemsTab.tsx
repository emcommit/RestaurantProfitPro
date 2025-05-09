import React, { useState } from 'react';
import useMenuData from '../../hooks/useMenuData';
import ItemModal from './ItemModal';

const RecipeItemsTab: React.FC = () => {
  const { currentMenu } = useMenuData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const recipeItems = currentMenu.items.filter(item => item.hasRecipe);

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-navy">Recipe Items</h2>
        <button
          onClick={handleAdd}
          className="btn btn-primary hover:scale-105 transition-transform duration-200 rounded-lg px-6 py-2"
        >
          Add Item
        </button>
      </div>
      {recipeItems.length === 0 ? (
        <p className="text-gray-500">No recipe items found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full table-zebra">
            <thead>
              <tr className="text-navy">
                <th className="text-left">Name</th>
                <th className="text-left">Category</th>
                <th className="text-right">Selling Price (£)</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recipeItems.map(item => (
                <tr key={item.name} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="text-gray-800">{item.name}</td>
                  <td className="text-gray-600">{item.category || 'N/A'}</td>
                  <td className="text-right text-gray-800">£{item.sellingPrice.toFixed(2)}</td>
                  <td className="text-right">
                    <button
                      onClick={() => handleEdit(item)}
                      className="btn btn-ghost text-navy hover:bg-gray-200 rounded-lg px-4 py-2"
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
        <ItemModal
          onClose={() => { setIsModalOpen(false); setSelectedItem(null); }}
          item={selectedItem}
          initialIngredients={currentMenu.initialIngredients}
          readOnly={false}
        />
      )}
    </div>
  );
};

export default RecipeItemsTab;