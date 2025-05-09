import React, { useState, useMemo } from 'react';

interface DataTableProps {
  columns: { header: string; accessor: string; align?: 'left' | 'right'; tooltip?: string; sortable?: boolean }[];
  data: any[];
  onRowClick?: (row: any) => void;
  tooltipAccessor?: string;
  rowTooltipAccessor?: string;
}

const DataTable: React.FC<DataTableProps> = ({ columns, data, onRowClick, tooltipAccessor, rowTooltipAccessor }) => {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const handleSort = (key: string, sortable: boolean | undefined) => {
    if (!sortable) return;
    setSortConfig(prev => {
      if (prev && prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;
    const { key, direction } = sortConfig;
    const sorted = [...data];
    sorted.sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });
    return sorted;
  }, [data, sortConfig]);

  return (
    <div className="overflow-x-auto">
      <table className="table w-full table-zebra">
        <thead>
          <tr className="text-navy bg-gray-100">
            {columns.map((col, index) => (
              <th
                key={index}
                className={`px-4 py-3 font-semibold border-b border-gray-200 text-${col.align || 'left'} relative group ${col.sortable ? 'cursor-pointer' : ''}`}
                onClick={() => handleSort(col.accessor, col.sortable)}
              >
                <div className="flex items-center">
                  {col.header}
                  {col.sortable && (
                    <span className="ml-1">
                      {sortConfig?.key === col.accessor ? (
                        sortConfig.direction === 'asc' ? '↑' : '↓'
                      ) : '↕'}
                    </span>
                  )}
                  {col.tooltip && (
                    <span className="absolute hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2 -mt-8 left-1/2 transform -translate-x-1/2 z-50">
                      {col.tooltip}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`hover:bg-gray-50 transition-colors duration-200 ${onRowClick ? 'cursor-pointer' : ''}`}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((col, colIndex) => (
                <td
                  key={colIndex}
                  className={`text-gray-800 px-4 py-3 border-b border-gray-200 text-${col.align || 'left'} relative group`}
                >
                  {col.accessor === tooltipAccessor ? (
                    <>
                      {row[col.accessor]}
                      <span className="absolute hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2 -mt-8 left-1/2 transform -translate-x-1/2 z-50">
                        {row.tooltip || `${row.profitMargin}%`}
                      </span>
                    </>
                  ) : (
                    <>
                      {row[col.accessor]}
                      {rowTooltipAccessor && row[rowTooltipAccessor] && colIndex === 0 && (
                        <span className="absolute hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2 top-1/2 left-full ml-2 transform -translate-y-1/2 z-50 whitespace-pre">
                          {row[rowTooltipAccessor]}
                        </span>
                      )}
                    </>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;