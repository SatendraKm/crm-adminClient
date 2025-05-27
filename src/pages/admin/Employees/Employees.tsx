import React from 'react';
import { useEmployeeFilters } from './hooks/useEmployeeFilters';
import { useEmployees } from './hooks/useEmployees';
import { EmployeeFilters } from './components/EmployeeFilters';
import { EmployeeTable } from './components/EmployeeTable';
import { Pagination } from './components/Pagination';

const Employees: React.FC = () => {
  const {
    search,
    setSearch,
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
  } = useEmployeeFilters();

  const {
    employees,
    loading,
    error,
    totalPages,
    totalEmployees,
    availableRoles,
    uniqueRegions,
    limit,
  } = useEmployees(filters);

  return (
    <div className="min-h-screen bg-base-100 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <EmployeeFilters
          search={search}
          setSearch={setSearch}
          filterActive={filterActive}
          setFilterActive={setFilterActive}
          filterRole={filterRole}
          setFilterRole={setFilterRole}
          filterRegion={filterRegion}
          setFilterRegion={setFilterRegion}
          setPage={setPage}
          availableRoles={availableRoles}
          uniqueRegions={uniqueRegions}
          resetFilters={resetFilters}
          totalEmployees={totalEmployees}
        />
        <EmployeeTable employees={employees} loading={loading} error={error} />
        <Pagination
          page={page}
          totalPages={totalPages}
          totalEmployees={totalEmployees}
          limit={limit}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default Employees;
