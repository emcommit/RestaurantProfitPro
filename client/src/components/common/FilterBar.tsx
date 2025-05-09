import React from 'react';

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  categories,
  selectedCategory,
  setSelectedCategory
}) => {
  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
      <div className="w-full sm:w-1/3">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input w-full"
        />
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`btn btn-sm ${selectedCategory === 'All' ? 'bg-gradient-navy text-primary-foreground' : 'btn-secondary'} hover:scale-105 transition-all duration-200`}
        >
          All
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`btn btn-sm ${selectedCategory === category ? 'bg-gradient-navy text-primary-foreground' : 'btn-secondary'} hover:scale-105 transition-all duration-200`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;