import React from 'react';
import DataTable from '../common/DataTable';
import FilterBar from '../common/FilterBar';
import useSearchAndFilter from '../../hooks/useSearchAndFilter';

interface IngredientTabProps {
  ingredients: Record<string, { cost: number; unit: string; category: string }>;
  items: any[];
  onAdd: () => void;
  onEdit: (ingredient: any) => void;
}

const IngredientTab: React.FC<IngredientTabProps> = React.memo(({ ingredients, items, onAdd, onEdit }) => {
  const ingredientList = Object.entries(ingredients).map(([name, { cost, unit, category }]) => {
    const menuItemsUsingIngredient = items
      .filter((item: any) => item.hasRecipe && item.ingredients && item.ingredients[name])
      .map((item: any) => item.name);
    const menuItemsTooltip = menuItemsUsingIngredient.length > 0 
      ? `Used in:\n${menuItemsUsingIngredient.join('\n')}`
      : 'Not used in any menu items';

    return {
      name,
      category,
      cost: cost,
      costDisplay: `£${cost.toFixed(2)}`,
      unit,
      menuItems: menuItemsTooltip,
      actions: (
        <button
          onClick={() => onEdit({ name, cost, unit, category })}
          className="btn btn-ghost text-navy hover:bg-gray-200 rounded-lg px-4 py-2"
        >
          Edit
        </button>
      )
    };
  });

  const { filteredItems, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, uniqueCategories } = useSearchAndFilter({
    items: ingredientList,
    searchField: 'name',
    categoryField: 'category'
  });

  return (
    <div className="card bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
      <div className="card-body p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-navy">Ingredients</h2>
          <button
            onClick={onAdd}
            className="btn btn-primary hover:scale-105 transition-transform duration-200 rounded-lg px-6 py-2"
          >
            Add Ingredient
          </button>
        </div>
        <FilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          categories={uniqueCategories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <DataTable
          columns={[
            { header: 'Name', accessor: 'name', tooltip: 'Ingredient Name' },
            { header: 'Category', accessor: 'category', tooltip: 'Ingredient Category' },
            { header: 'Cost', accessor: 'costDisplay', tooltip: 'Cost per unit' },
            { header: 'Unit', accessor: 'unit', tooltip: 'Unit of measurement' },
            { header: 'Actions', accessor: 'actions', align: 'right', tooltip: 'Edit or delete the ingredient' }
          ]}
          data={filteredItems}
          rowTooltipAccessor="menuItems"
        />
      </div>
    </div>
  );
});

export default IngredientTab;