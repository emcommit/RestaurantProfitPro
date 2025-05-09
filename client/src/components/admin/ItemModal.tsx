import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../../store';
import { calculateRecipeCost } from '../../utils/menuUtils';
import useMenuData from '../../hooks/useMenuData';

const CATEGORY_ORDER = [
  'Starters', 'Mains', 'Mains Grill', 'Mains Oven', 'Steaks', 'Pizzas', 'Pastas', 'Risottos', 'Orzotto', 'Side Dishes', 'Desserts',
  'Drinks', 'Soft Drinks', 'Beers & Ciders', 'White Wines', 'Red Wines', 'Rose Wines', 'Sparkling Wines', 'Cocktails', 'Hot Drinks', 'Liqueur Coffees',
  'Baking Supplies', 'Beverages', 'Canned Goods', 'Condiments', 'Dairy', 'Fruits', 'Grains', 'Herbs and Spices', 'Miscellaneous', 'Nuts and Seeds',
  'Oils and Vinegars', 'Proteins', 'Sauces', 'Sweeteners', 'Vegetables', 'Uncategorized'
];

interface ItemModalProps {
  onClose: () => void;
  item?: any;
}

const ItemModal: React.FC<ItemModalProps> = ({ onClose, item }) => {
  const { selectedMenu } = useAppStore();
  const { currentMenu } = useMenuData();
  const [formData, setFormData] = useState({
    name: item?.name || '',
    category: item?.category || '',
    sellingPrice: item?.sellingPrice || 0,
    buyingPrice: item?.buyingPrice || 0,
    description: item?.description || '',
    ingredients: item?.ingredients || {}
  });
  const [isVisible, setIsVisible] = useState(false);
  const [newIngredientName, setNewIngredientName] = useState('');
  const [newIngredientDisplay, setNewIngredientDisplay] = useState('');
  const [newIngredientQuantity, setNewIngredientQuantity] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Debug logs
  useEffect(() => {
    console.log('ItemModal - Selected Menu:', selectedMenu);
    console.log('ItemModal - Item:', item);
    console.log('ItemModal - Available Ingredients:', availableIngredients);
  }, [selectedMenu, item]);

  // Handle clicks outside the autocomplete to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Utility to convert legacy units to base units
  const convertToBaseUnit = (unit: string): string => {
    if (unit === 'kg') return 'g';
    if (unit === 'L') return 'ml';
    return unit; // 'unit' or already base unit
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (formData.sellingPrice <= 0) newErrors.sellingPrice = 'Selling price must be greater than 0';
    if (!isRecipeItem && formData.buyingPrice <= 0) newErrors.buyingPrice = 'Buying price must be greater than 0';
    if (newIngredientQuantity && Number(newIngredientQuantity) <= 0) newErrors.newIngredientQuantity = 'Quantity must be greater than 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'sellingPrice' || name === 'buyingPrice' ? Number(value) : value
    }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleIngredientChange = (ingredientName: string, quantity: string) => {
    const numericQuantity = Number(quantity);
    if (numericQuantity <= 0) {
      setErrors(prev => ({ ...prev, [ingredientName]: 'Quantity must be greater than 0' }));
      return;
    }
    setFormData(prev => ({
      ...prev,
      ingredients: {
        ...prev.ingredients,
        [ingredientName]: numericQuantity
      }
    }));
    setErrors(prev => ({ ...prev, [ingredientName]: '' }));
  };

  const handleAutocompleteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewIngredientDisplay(value);

    // Extract the ingredient name (without the unit) for filtering
    const ingredientName = value.split(' (')[0];
    setNewIngredientName(ingredientName);

    if (value.trim() === '') {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filteredSuggestions = availableIngredients
      .filter(ingredient => ingredient.name.toLowerCase().includes(ingredientName.toLowerCase()))
      .map(ingredient => {
        const displayUnit = convertToBaseUnit(ingredient.unit || 'units');
        return `${ingredient.name} (${displayUnit})`;
      });
    setSuggestions(filteredSuggestions);
    setShowSuggestions(true);
  };

  const handleSuggestionSelect = (suggestion: string) => {
    const ingredientName = suggestion.split(' (')[0];
    setNewIngredientName(ingredientName);
    setNewIngredientDisplay(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleAddIngredient = () => {
    if (!newIngredientName || !newIngredientQuantity) return;
    if (!availableIngredients.some(ingredient => ingredient.name === newIngredientName)) {
      setErrors(prev => ({ ...prev, newIngredientName: 'Ingredient must be selected from the list' }));
      return;
    }
    const numericQuantity = Number(newIngredientQuantity);
    if (numericQuantity <= 0) {
      setErrors(prev => ({ ...prev, newIngredientQuantity: 'Quantity must be greater than 0' }));
      return;
    }
    setFormData(prev => ({
      ...prev,
      ingredients: {
        ...prev.ingredients,
        [newIngredientName]: numericQuantity
      }
    }));
    setNewIngredientName('');
    setNewIngredientDisplay('');
    setNewIngredientQuantity('');
    setErrors(prev => ({ ...prev, newIngredientName: '', newIngredientQuantity: '' }));
    setShowSuggestions(false);
  };

  const handleRemoveIngredient = (ingredientName: string) => {
    const updatedIngredients = { ...formData.ingredients };
    delete updatedIngredients[ingredientName];
    setFormData(prev => ({
      ...prev,
      ingredients: updatedIngredients
    }));
    setErrors(prev => ({ ...prev, [ingredientName]: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    // Handle save logic (e.g., API call to update item with new ingredients)
    onClose();
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  let recipeCost = 0;
  let availableIngredients: { name: string; cost: number; unit: string; category: string }[] = [];
  const isRecipeItem = item === null || item?.hasRecipe;
  if (isRecipeItem) {
    availableIngredients = Object.entries(currentMenu.initialIngredients || {}).map(([name, { cost, unit, category }]) => ({
      name,
      cost,
      unit,
      category
    }));
    recipeCost = calculateRecipeCost(formData.ingredients || {}, availableIngredients, currentMenu.costMultiplier);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
      <div 
        className={`card bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-2xl w-full max-w-lg p-8 transform transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <div className="card-body">
          <h2 className="card-title text-navy text-2xl mb-6 font-bold tracking-tight">
            {item ? 'Edit Item' : 'Add Item'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="label"><span className="label-text text-navy font-semibold">Name</span></label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`input input-bordered w-full bg-white text-navy shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg focus:ring-2 focus:ring-accent-500 ${errors.name ? 'border-red-500' : ''}`}
                required
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
                {CATEGORY_ORDER.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="mb-5">
              <label className="label"><span className="label-text text-navy font-semibold">{isRecipeItem ? 'Selling Price (£)' : 'Menu Price (£)'}</span></label>
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
            {!isRecipeItem && (
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
            )}
            {isRecipeItem && (
              <>
                <div className="mb-5">
                  <label className="label"><span className="label-text text-navy font-semibold">Calculated Cost (£)</span></label>
                  <input
                    type="text"
                    value={`£${recipeCost.toFixed(2)}`}
                    className="input input-bordered w-full bg-gray-100 text-navy shadow-sm rounded-lg"
                    disabled
                  />
                </div>
                <div className="mb-5">
                  <label className="label"><span className="label-text text-navy font-semibold">Ingredients</span></label>
                  {Object.entries(formData.ingredients || {}).length === 0 ? (
                    <p className="text-gray-500">No ingredients specified.</p>
                  ) : (
                    <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                      {Object.entries(formData.ingredients || {}).map(([ingredientName, quantity]) => {
                        const ingredientData = availableIngredients.find(ing => ing.name.toLowerCase() === ingredientName.toLowerCase());
                        const unit = ingredientData ? convertToBaseUnit(ingredientData.unit || 'units') : 'units';
                        return (
                          <div key={ingredientName} className="flex justify-between items-center mb-2">
                            <span className="text-gray-800">{ingredientName}</span>
                            <div className="flex items-center space-x-2">
                              <input
                                type="number"
                                value={quantity}
                                onChange={(e) => handleIngredientChange(ingredientName, e.target.value)}
                                className={`w-20 input input-bordered bg-white text-navy shadow-sm rounded-lg focus:ring-2 focus:ring-accent-500 ${errors[ingredientName] ? 'border-red-500' : ''}`}
                                step="1"
                              />
                              <span className="text-gray-600">{unit}</span>
                              <button
                                type="button"
                                className="text-red-500 hover:text-red-700 transition-colors duration-200"
                                onClick={() => handleRemoveIngredient(ingredientName)}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div className="mb-5">
                  <label className="label"><span className="label-text text-navy font-semibold">Add New Ingredient</span></label>
                  <div className="flex space-x-2 items-center">
                    <div className="relative w-1/2" ref={autocompleteRef}>
                      <input
                        type="text"
                        value={newIngredientDisplay}
                        onChange={handleAutocompleteChange}
                        onFocus={() => setShowSuggestions(true)}
                        placeholder="Type to search ingredients..."
                        className={`input input-bordered w-full bg-white text-navy shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg focus:ring-2 focus:ring-accent-500 ${errors.newIngredientName ? 'border-red-500' : ''}`}
                      />
                      {showSuggestions && suggestions.length > 0 && (
                        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                          {suggestions.map(suggestion => (
                            <li
                              key={suggestion}
                              className="px-4 py-2 text-navy hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleSuggestionSelect(suggestion)}
                            >
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <input
                      type="number"
                      value={newIngredientQuantity}
                      onChange={(e) => setNewIngredientQuantity(e.target.value)}
                      placeholder="Quantity (g, ml, unit)"
                      className={`input input-bordered w-1/4 bg-white text-navy shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg focus:ring-2 focus:ring-accent-500 ${errors.newIngredientQuantity ? 'border-red-500' : ''}`}
                      step="1"
                    />
                    <button
                      type="button"
                      className="btn btn-primary hover:scale-105 transition-transform duration-200 rounded-lg px-4 py-2"
                      onClick={handleAddIngredient}
                      disabled={!newIngredientName || !newIngredientQuantity}
                    >
                      Add
                    </button>
                  </div>
                  {errors.newIngredientName && <p className="text-red-500 text-sm mt-1">{errors.newIngredientName}</p>}
                  {errors.newIngredientQuantity && <p className="text-red-500 text-sm mt-1">{errors.newIngredientQuantity}</p>}
                </div>
                <div className="mb-6">
                  <label className="label"><span className="label-text text-navy font-semibold">Description</span></label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="input input-bordered w-full bg-white text-navy shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg focus:ring-2 focus:ring-accent-500"
                  />
                </div>
              </>
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
        </div>
      </div>
    </div>
  );
};

export default ItemModal;