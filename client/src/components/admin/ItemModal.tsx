import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store';

const ITEM_CATEGORIES = [
  'Starters', 'Mains', 'Mains Grill', 'Mains Oven', 'Steaks', 'Pizzas', 'Pastas', 'Risottos', 'Orzotto', 'Side Dishes', 'Desserts',
  'Drinks', 'Soft Drinks', 'Beers & Ciders', 'White Wines', 'Red Wines', 'Rose Wines', 'Sparkling Wines', 'Cocktails', 'Hot Drinks', 'Liqueur Coffees'
];

interface ItemModalProps {
  onClose: () => void;
  item?: any;
  initialIngredients?: Record<string, { cost: number; unit: string; category: string }>;
  readOnly?: boolean;
}

const ItemModal: React.FC<ItemModalProps> = ({ onClose, item, initialIngredients = {}, readOnly = false }) => {
  const { selectedMenu, setMenus } = useAppStore();
  const [formData, setFormData] = useState({
    name: item?.name || '',
    category: item?.category || '',
    buyingPrice: item?.buyingPrice || 0,
    sellingPrice: item?.sellingPrice || 0,
    ingredients: item?.ingredients || {}
  });
  const [isVisible, setIsVisible] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (formData.buyingPrice <= 0) newErrors.buyingPrice = 'Buying price must be greater than 0';
    if (formData.sellingPrice <= 0) newErrors.sellingPrice = 'Selling price must be greater than 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'buyingPrice' || name === 'sellingPrice' ? Number(value) : value
    }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleIngredientChange = (ingName: string, field: 'name' | 'quantity', value: string) => {
    setFormData(prev => {
      const newIngredients = { ...prev.ingredients };
      if (field === 'name') {
        // Update ingredient name (rename key)
        const quantity = newIngredients[ingName];
        delete newIngredients[ingName];
        newIngredients[value] = quantity;
      } else {
        // Update quantity
        newIngredients[ingName] = Number(value);
      }
      return { ...prev, ingredients: newIngredients };
    });
  };

  const handleAddIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: {
        ...prev.ingredients,
        'New Ingredient': 0 // Default quantity
      }
    }));
  };

  const handleRemoveIngredient = (ingName: string) => {
    setFormData(prev => {
      const newIngredients = { ...prev.ingredients };
      delete newIngredients[ingName];
      return { ...prev, ingredients: newIngredients };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setMenus(prev => {
      const updatedItems = prev[selectedMenu].items.map(i =>
        i.name === item?.name ? { ...i, ...formData } : i
      );
      if (!item) updatedItems.push({ ...formData, hasRecipe: !!Object.keys(formData.ingredients).length });
      return {
        ...prev,
        [selectedMenu]: {
          ...prev[selectedMenu],
          items: updatedItems
        }
      };
    });
    onClose();
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
      <div 
        className={`card bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-2xl w-full max-w-md p-8 transform transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <div className="card-body">
          {readOnly ? (
            <div>
              <h2 className="card-title text-navy text-2xl mb-6 font-bold tracking-tight">
                Item Details
              </h2>
              <div className="mb-5">
                <p className="text-navy font-semibold">Name:</p>
                <p className="text-gray-800">{formData.name}</p>
              </div>
              <div className="mb-5">
                <p className="text-navy font-semibold">Category:</p>
                <p className="text-gray-800">{formData.category || 'N/A'}</p>
              </div>
              <div className="mb-5">
                <p className="text-navy font-semibold">Buying Price:</p>
                <p className="text-gray-800">£{formData.buyingPrice.toFixed(2)}</p>
              </div>
              <div className="mb-5">
                <p className="text-navy font-semibold">Selling Price:</p>
                <p className="text-gray-800">£{formData.sellingPrice.toFixed(2)}</p>
              </div>
              {item?.hasRecipe && Object.keys(formData.ingredients).length > 0 && (
                <div className="mb-5">
                  <p className="text-navy font-semibold">Ingredients:</p>
                  <ul className="list-disc list-inside text-gray-800">
                    {Object.entries(formData.ingredients).map(([ingName, quantity]) => {
                      const unit = initialIngredients[ingName]?.unit || 'g/ml';
                      return (
                        <li key={ingName}>{ingName}: {quantity}{unit}</li>
                      );
                    })}
                  </ul>
                </div>
              )}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="btn btn-ghost text-navy hover:bg-gray-200 hover:scale-105 transition-transform duration-200 rounded-lg px-6 py-2"
                  onClick={handleClose}
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2 className="card-title text-navy text-2xl mb-6 font-bold tracking-tight">
                {item ? 'Edit Item' : 'Add Item'}
              </h2>
              <div className="mb-5">
                <label className="label"><span className="label-text text-navy font-semibold">Name</span></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`input input-bordered w-full bg-white text-navy shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg focus:ring-2 focus:ring-accent-500 ${errors.name ? 'border-red-500' : ''}`}
                  required
                  disabled={!!item}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              <div className="mb-5">
                <label className="label"><span className="label-text text-navy font-semibold">Category</span></label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="select select-bordered w-full bg-white text-navy shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg focus:ring-2 focus:ring-accent-500"
                >
                  <option value="">Select Category</option>
                  {ITEM_CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="mb-5">
                <label className="label"><span className="label-text text-navy font-semibold">Buying Price (£)</span></label>
                <input
                  type="number"
                  name="buyingPrice"
                  value={formData.buyingPrice}
                  onChange={handleChange}
                  className={`input input-bordered w-full bg-white text-navy shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg focus:ring-2 focus:ring-accent-500 ${errors.buyingPrice ? 'border-red-500' : ''}`}
                  step="0.01"
                  required
                />
                {errors.buyingPrice && <p className="text-red-500 text-sm mt-1">{errors.buyingPrice}</p>}
              </div>
              <div className="mb-5">
                <label className="label"><span className="label-text text-navy font-semibold">Selling Price (£)</span></label>
                <input
                  type="number"
                  name="sellingPrice"
                  value={formData.sellingPrice}
                  onChange={handleChange}
                  className={`input input-bordered w-full bg-white text-navy shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg focus:ring-2 focus:ring-accent-500 ${errors.sellingPrice ? 'border-red-500' : ''}`}
                  step="0.01"
                  required
                />
                {errors.sellingPrice && <p className="text-red-500 text-sm mt-1">{errors.sellingPrice}</p>}
              </div>
              {(item?.hasRecipe || Object.keys(formData.ingredients).length > 0) && (
                <div className="mb-5">
                  <label className="label"><span className="label-text text-navy font-semibold">Ingredients</span></label>
                  <div className="space-y-4">
                    {Object.entries(formData.ingredients).map(([ingName, quantity]) => {
                      const unit = initialIngredients[ingName]?.unit || 'g/ml';
                      return (
                        <div key={ingName} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={ingName}
                            onChange={(e) => handleIngredientChange(ingName, 'name', e.target.value)}
                            className="input input-bordered w-1/2 bg-white text-navy shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg focus:ring-2 focus:ring-accent-500"
                            placeholder="Ingredient Name"
                          />
                          <div className="flex items-center space-x-1">
                            <input
                              type="number"
                              value={quantity}
                              onChange={(e) => handleIngredientChange(ingName, 'quantity', e.target.value)}
                              className="input input-bordered w-24 bg-white text-navy shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg focus:ring-2 focus:ring-accent-500"
                              placeholder="Quantity"
                              step="1"
                            />
                            <span className="text-gray-600">{unit}</span>
                          </div>
                          <button
                            type="button"
                            className="btn btn-ghost text-red-500 hover:bg-gray-200 rounded-lg px-2 py-1"
                            onClick={() => handleRemoveIngredient(ingName)}
                          >
                            Remove
                          </button>
                        </div>
                      );
                    })}
                    <button
                      type="button"
                      className="btn btn-ghost text-navy hover:bg-gray-200 rounded-lg px-4 py-2 mt-2"
                      onClick={handleAddIngredient}
                    >
                      Add Ingredient
                    </button>
                  </div>
                </div>
              )}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="btn btn-ghost text-navy hover:bg-gray-200 hover:scale-105 transition-transform duration-200 rounded-lg px-6 py-2"
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary hover:scale-105 transition-transform duration-200 rounded-lg px-6 py-2"
                >
                  Save
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemModal;