import { useState, useMemo } from 'react';

interface UseSearchAndFilterProps<T> {
  items: T[];
  searchField: keyof T;
  categoryField: keyof T;
}

const useSearchAndFilter = <T>({ items, searchField, categoryField }: UseSearchAndFilterProps<T>) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(items.map(item => String(item[categoryField])))).sort();
  }, [items, categoryField]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = String(item[searchField]).toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || String(item[categoryField]) === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, selectedCategory, searchField, categoryField]);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    uniqueCategories,
    filteredItems
  };
};

export default useSearchAndFilter;