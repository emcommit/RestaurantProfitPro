import React from 'react';
import DataTable from '../common/DataTable';

interface CategoryTableProps {
  category: string;
  items: any[];
  onRowClick: (row: any) => void;
}

const CategoryTable: React.FC<CategoryTableProps> = React.memo(({ category, items, onRowClick }) => {
  return (
    <div className="mb-10">
      <h3 className="text-2xl font-semibold text-navy mb-4">{category}</h3>
      <DataTable
        columns={[
          { header: 'Name', accessor: 'name', tooltip: 'Item Name' },
          { header: 'Description', accessor: 'description', tooltip: 'Item Description (for recipe items)' },
          { header: 'Selling Price', accessor: 'sellingPrice', align: 'right', tooltip: 'Price at which the item is sold' },
          { header: 'Cost', accessor: 'cost', align: 'right', tooltip: 'Cost to produce or buy the item' },
          { header: 'Profit Margin', accessor: 'profitMargin', align: 'right', tooltip: 'Percentage of profit relative to selling price' }
        ]}
        data={items}
        onRowClick={onRowClick}
        tooltipAccessor="profitMargin"
      />
    </div>
  );
});

export default CategoryTable;