import React, { useState, useEffect } from 'react';
import InputField from './InputField';
import SelectField from './SelectField';
import DataTable from './DataTable';

interface GenericModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  fields?: { name: string; label: string; type: string; options?: string[] }[];
  data?: any;
  onSubmit?: (data: any) => void;
  onDelete?: () => void;
  tableData?: any[];
  readOnly?: boolean;
  initialIngredients?: Record<string, { cost: number; unit: string; category: string }>;
}

const GenericModal: React.FC<GenericModalProps> = ({
  title,
  isOpen,
  onClose,
  fields = [],
  data = {},
  onSubmit,
  onDelete,
  tableData,
  readOnly = false,
  initialIngredients = {}
}) => {
  const [formData, setFormData] = useState({ ...data, ingredients: data?.ingredients || {} });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({ ...data, ingredients: data?.ingredients || {} });
      setErrors({});
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen, data]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    fields.forEach(field => {
      if (field.type === 'text' || field.type === 'number') {
        if (!formData[field.name]) {
          newErrors[field.name] = `${field.label} is required`;
        } else if (field.type === 'number' && formData[field.name] <= 0) {
          newErrors[field.name] = `${field.label} must be greater than 0`;
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Price') || name === 'cost' ? Number(value) : value
    }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleIngredientChange = (ingName: string, field: 'name' | 'quantity', value: string) => {
    setFormData(prev => {
      const newIngredients = { ...prev.ingredients };
      if (field === 'name') {
        const quantity = newIngredients[ingName];
        delete newIngredients[ingName];
        newIngredients[value] = quantity;
      } else {
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
        'New Ingredient': 0
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
    onSubmit?.(formData);
    onClose();
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div 
        className={`modal-content animate-scale-in ${isVisible ? '' : 'opacity-0 scale-95'}`}
      >
        <h2 className="text-xl font-semibold text-foreground mb-6">{title}</h2>
        {readOnly && tableData ? (
          <div>
            {tableData.length === 0 ? (
              <p className="text-muted-foreground">No data found.</p>
            ) : (
              <>
                <DataTable
                  columns={[
                    { header: 'Name', accessor: 'name', tooltip: 'Ingredient Name' },
                    { header: 'Quantity', accessor: 'quantity', tooltip: 'Quantity with unit' },
                    { header: 'Total Cost', accessor: 'totalCost', align: 'right', tooltip: 'Total cost for this quantity' }
                  ]}
                  data={tableData}
                />
                <div className="mt-4 text-right text-foreground font-semibold">
                  Total: £{tableData.reduce((sum: number, row: any) => sum + row.totalCost, 0).toFixed(2)}
                </div>
              </>
            )}
            <div className="flex justify-end mt-6">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {fields.map(field => (
              field.type === 'select' ? (
                <SelectField
                  key={field.name}
                  label={field.label}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  options={field.options || []}
                  error={errors[field.name]}
                />
              ) : (
                <InputField
                  key={field.name}
                  label={field.label}
                  name={field.name}
                  type={field.type}
                  value={field.type === 'number' ? Number(formData[field.name]).toFixed(2) : formData[field.name] || ''}
                  onChange={handleChange}
                  step={field.type === 'number' ? '0.01' : undefined}
                  error={errors[field.name]}
                  disabled={field.name === 'name' && !!data.name}
                />
              )
            ))}
            {formData.hasRecipe && (
              <div className="mb-5">
                <label className="label"><span className="label-text">Ingredients</span></label>
                <div className="space-y-4">
                  {Object.entries(formData.ingredients).map(([ingName, quantity]) => {
                    const unit = initialIngredients[ingName]?.unit || 'g/ml';
                    return (
                      <div key={ingName} className="flex items-center space-x-2">
                        <InputField
                          label=""
                          name={`ingredient-name-${ingName}`}
                          type="text"
                          value={ingName}
                          onChange={(e) => handleIngredientChange(ingName, 'name', e.target.value)}
                          error={undefined}
                        />
                        <div className="flex items-center space-x-1">
                          <InputField
                            label=""
                            name={`ingredient-quantity-${ingName}`}
                            type="number"
                            value={quantity}
                            onChange={(e) => handleIngredientChange(ingName, 'quantity', e.target.value)}
                            step="1"
                            error={undefined}
                          />
                          <span className="text-muted-foreground text-sm">{unit}</span>
                        </div>
                        <button
                          type="button"
                          className="btn btn-destructive text-sm"
                          onClick={() => handleRemoveIngredient(ingName)}
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                  <button
                    type="button"
                    className="btn btn-secondary text-sm mt-2"
                    onClick={handleAddIngredient}
                  >
                    Add Ingredient
                  </button>
                </div>
              </div>
            )}
            <div className="flex justify-between mt-6">
              {data && onDelete && (
                <button
                  type="button"
                  className="btn btn-destructive"
                  onClick={onDelete}
                >
                  Delete
                </button>
              )}
              <div className="flex space-x-3">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default GenericModal;