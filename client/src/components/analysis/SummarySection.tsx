import React from 'react';
import DataTable from '../common/DataTable';

interface SummarySectionProps {
  title: string;
  stats: { totalItems: number; avgProfitMargin: string };
  topItems: any[];
  bottomItems: any[];
  onRowClick?: (row: any) => void;
}

const SummarySection: React.FC<SummarySectionProps> = React.memo(
  ({ title, stats, topItems, bottomItems, onRowClick }) => {
    return (
      <div className="card bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
        <div className="card-body p-6">
          <h2 className="card-title text-navy text-xl">{title}</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-navy mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h10m0 0v10m0-10l-6 6" />
              </svg>
              <p className="text-gray-700">Total Items: <span className="font-semibold">{stats.totalItems}</span></p>
            </div>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-navy mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
              </svg>
              <p className="text-gray-700">Avg Profit Margin: <span className="font-semibold">{stats.avgProfitMargin}%</span></p>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-navy mt-4">Top 3 Performers</h3>
          <DataTable
            columns={[
              { header: 'Name', accessor: 'name', tooltip: 'Item Name' },
              { header: 'Category', accessor: 'category', tooltip: 'Item Category' },
              { header: 'Profit Margin', accessor: 'profitMargin', align: 'right', tooltip: 'Percentage of profit relative to selling price' },
              { header: '', accessor: 'profitMarginBar', align: 'right' }
            ]}
            data={topItems}
            onRowClick={onRowClick}
            tooltipAccessor="profitMarginBar"
          />
          <h3 className="text-lg font-semibold text-navy mt-4">Bottom 3 Performers</h3>
          <DataTable
            columns={[
              { header: 'Name', accessor: 'name', tooltip: 'Item Name' },
              { header: 'Category', accessor: 'category', tooltip: 'Item Category' },
              { header: 'Profit Margin', accessor: 'profitMargin', align: 'right', tooltip: 'Percentage of profit relative to selling price' },
              { header: '', accessor: 'profitMarginBar', align: 'right' }
            ]}
            data={bottomItems}
            onRowClick={onRowClick}
            tooltipAccessor="profitMarginBar"
          />
        </div>
      </div>
    );
  }
);

export default SummarySection;