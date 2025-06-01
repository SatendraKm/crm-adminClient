import { useState, useEffect } from 'react';
import axiosInstance from '../../../../lib/axios';
import type {
  Employee,
  FilterOptions,
  EmployeeFilters,
  EmployeeResponse,
} from '../types/EmployeeTypes';

export const useEmployees = (filters: EmployeeFilters) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);

  const limit = 10;

  // Fetch filter options from dedicated endpoint
  const fetchFilterOptions = async () => {
    try {
      const res = await axiosInstance.get<{
        success: boolean;
        data: FilterOptions;
      }>('/api/admin/employees/filters');
      if (res.data.success) {
        setAvailableRoles(res.data.data.roles || []);
      }
    } catch (err) {
      console.error('Error fetching filter options:', err);
      setAvailableRoles([]);
    }
  };

  // Fetch employees with filters
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: filters.page.toString(),
        limit: limit.toString(),
        search: filters.search,
      });

      if (filters.filterActive !== 'All') {
        params.append(
          'is_active',
          filters.filterActive === 'Active' ? 'true' : 'false',
        );
      }

      if (filters.filterRole !== 'All') {
        params.append('role', filters.filterRole);
      }

      const res = await axiosInstance.get<EmployeeResponse>(
        `/api/admin/employees?${params}`,
      );
      console.log(res);

      if (res.data.success) {
        // Corrected data extraction based on actual API response structure
        setEmployees(res.data.data); // data is directly the array of employees
        setTotalPages(res.data.pagination.totalPages); // pagination is at root level
        setTotalEmployees(res.data.pagination.total); // total is in pagination object
      } else {
        setError('Failed to fetch employees');
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Failed to fetch employees. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [filters.search, filters.filterActive, filters.filterRole, filters.page]);

  return {
    employees,
    loading,
    error,
    totalPages,
    totalEmployees,
    availableRoles,
    limit,
    refetch: fetchEmployees,
  };
};
