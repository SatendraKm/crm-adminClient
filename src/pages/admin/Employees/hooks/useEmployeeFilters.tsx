import { useState, useEffect } from 'react';
import type { EmployeeFilters } from '../types/EmployeeTypes';

export const useEmployeeFilters = () => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterActive, setFilterActive] = useState<
    'All' | 'Active' | 'Inactive'
  >('All');
  const [filterRole, setFilterRole] = useState<string>('All');
  const [filterRegion, setFilterRegion] = useState<string>('All');
  const [page, setPage] = useState(1);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const resetFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setFilterActive('All');
    setFilterRole('All');
    setFilterRegion('All');
    setPage(1);
  };

  const filters: EmployeeFilters = {
    search: debouncedSearch,
    filterActive,
    filterRole,
    filterRegion,
    page,
  };

  return {
    search,
    setSearch,
    debouncedSearch,
    filterActive,
    setFilterActive,
    filterRole,
    setFilterRole,
    filterRegion,
    setFilterRegion,
    page,
    setPage,
    resetFilters,
    filters,
  };
};
