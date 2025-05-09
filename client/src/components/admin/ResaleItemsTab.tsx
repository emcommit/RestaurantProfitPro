import React from 'react';
import DataTable from '../common/DataTable';
import FilterBar from '../common/FilterBar';
import useSearchAndFilter from '../../hooks/useSearchAndFilter';

interface ResaleItemsTabProps {
  resaleItems: any[];
  onAdd: () => void;
  onEdit: (item: any) => void;
}

const ResaleItemsTab: React.FC<ResaleItemsTabProps> = React.memo(({ resaleItems, onAdd, onEdit }) => {
  const mappedResaleItems = resaleItems.map((item: any) => ({
    name: item.name,
    category: item.category || 'N/A',
    sellingPrice: `£${item.sellingPrice.toFixed(2)}`,
    actions: (
      <button
        onClick={() => onEdit(item)}
        className="btn btn-ghost text-navy hover:bg-gray-200 rounded-lg px-4 py-2"
      >
        Edit
      </button>
    )
  }));

  const { filteredItems, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, uniqueCategories } = useSearchAndFilter({
    items: mappedResaleItems,
    searchField: 'name',
    categoryField: 'category'
  });

  return (
    <div className="card bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
      <div className="card-body p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-navy">Resale Items</h2>
          <button
            onClick={onAdd}
            className="btn btn-primary hover:scale-105 transition-transform duration-200 rounded-lg px-6 py-2"
          >
            Add Item
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
            { header: 'Name', accessor: 'name', tooltip: 'Item Name' },
            { header: 'Category', accessor: 'category', tooltip: 'Item Category' },
            { header: 'Selling Price', accessor: 'sellingPrice', align: 'right', tooltip: 'Price at which the item is sold' },
            { header: 'Actions', accessor: 'actions', align: 'right', tooltip: 'Edit or delete the item' }
          ]}
          data={filteredItems}
        />
      </div>
    </div>
  );
});

export default ResaleItemsTab;