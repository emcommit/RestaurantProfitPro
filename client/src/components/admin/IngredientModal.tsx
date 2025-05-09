import React, { useState, useEffect } from 'react';

const INGREDIENT_CATEGORIES = [
  'Baking Supplies', 'Beverages', 'Canned Goods', 'Condiments', 'Dairy', 'Fruits', 'Grains', 'Herbs and Spices',
  'Miscellaneous', 'Nuts and Seeds', 'Oils and Vinegars', 'Proteins', 'Sauces', 'Sweeteners', 'Vegetables', 'Uncategorized'
];

const ALLOWED_UNITS = ['kg', 'L', 'unit'];

interface IngredientModalProps {
  onClose: () => void;
  ingredient?: any;
}

const IngredientModal: React.FC<IngredientModalProps> = ({ onClose, ingredient }) => {
  const [formData, setFormData] = useState({
    name: ingredient?.name || '',
    category: ingredient?.category || '',
    cost: ingredient?.cost || 0,
    unit: ingredient?.unit || 'kg'
  });
  const [isVisible, setIsVisible] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (formData.cost <= 0) newErrors.cost = 'Cost must be greater than 0';
    if (!ALLOWED_UNITS.includes(formData.unit)) newErrors.unit = 'Unit must be kg, L, or unit';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cost' ? Number(value) : value
    }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    // Convert cost to per base unit (g, ml, unit)
    const costPerBaseUnit = formData.unit === 'kg' || formData.unit === 'L' ? formData.cost / 1000 : formData.cost;
    // Convert unit to base unit for storage
    const baseUnit = formData.unit === 'kg' ? 'g' : formData.unit === 'L' ? 'ml' : 'unit';
    // Handle save logic (e.g., API call to update ingredient with base unit and cost)
    console.log('Saving ingredient:', {
      name: formData.name,
      category: formData.category,
      cost: costPerBaseUnit, // Cost per g, ml, or unit
      unit: baseUnit // Store as g, ml, or unit
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
          <h2 className="card-title text-navy text-2xl mb-6 font-bold tracking-tight">
            {ingredient ? 'Edit Ingredient' : 'Add Ingredient'}
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
                {INGREDIENT_CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="mb-5">
              <label className="label"><span className="label-text text-navy font-semibold">Cost (£ per {formData.unit})</span></label>
              <input
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                className={`input input-bordered w-full bg-white text-navy shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg focus:ring-2 focus:ring-accent-500 ${errors.cost ? 'border-red-500' : ''}`}
                step="0.01"
                required
              />
              {errors.cost && <p className="text-red-500 text-sm mt-1">{errors.cost}</p>}
            </div>
            <div className="mb-6">
              <label className="label"><span className="label-text text-navy font-semibold">Unit</span></label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className={`select select-bordered w-full bg-white text-navy shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg focus:ring-2 focus:ring-accent-500 ${errors.unit ? 'border-red-500' : ''}`}
                required
              >
                {ALLOWED_UNITS.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
              {errors.unit && <p className="text-red-500 text-sm mt-1">{errors.unit}</p>}
            </div>
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

export default IngredientModal;