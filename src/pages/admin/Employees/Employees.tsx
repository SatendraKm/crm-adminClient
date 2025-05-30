import React from 'react';
import { useEmployeeFilters } from './hooks/useEmployeeFilters';
import { useEmployees } from './hooks/useEmployees';
import { EmployeeFilters } from './components/EmployeeFilters';
import { EmployeeTable } from './components/EmployeeTable';
import { Pagination } from './components/Pagination';
import { StatusEditModal } from './components/StatusEditModal';
import axiosInstance from '../../../lib/axios';

const Employees: React.FC = () => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedEmployee, setSelectedEmployee] =
    React.useState<Employee | null>(null);
  const [statusLoading, setStatusLoading] = React.useState(false);

  const handleEditStatus = (employee: Employee) => {
    setSelectedEmployee(employee);
    setModalOpen(true);
  };

  // Handler to confirm status change
  const handleConfirmStatus = async (newStatus: boolean) => {
    if (!selectedEmployee) return;
    setStatusLoading(true);
    try {
      const res = await axiosInstance.put(
        `/api/admin/employees/${selectedEmployee.EmployeeId}/status`,
        { is_active: newStatus },
      );
      if (res.data.success) {
        // Option 1: Refetch all employees
        // await refetch();
        // Option 2: Or update in-place if you want
        // setEmployees((prev) =>
        //   prev.map((emp) =>
        //     emp.EmployeeId === selectedEmployee.EmployeeId
        //       ? { ...emp, is_active: newStatus }
        //       : emp,
        //   ),
        // );
      } else {
        alert(res.data.message || 'Failed to update status');
      }
    } catch (err: any) {
      alert(
        err.response?.data?.message || err.message || 'Failed to update status',
      );
    } finally {
      setStatusLoading(false);
      setModalOpen(false);
      setSelectedEmployee(null);
    }
  };

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
        <EmployeeTable
          employees={employees}
          loading={loading}
          error={error}
          onEditStatus={handleEditStatus}
        />
        <Pagination
          page={page}
          totalPages={totalPages}
          totalEmployees={totalEmployees}
          limit={limit}
          onPageChange={setPage}
        />
        <StatusEditModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          employeeName={selectedEmployee?.EmployeeName || ''}
          currentStatus={selectedEmployee?.is_active ?? null}
          onConfirm={handleConfirmStatus}
          loading={statusLoading}
        />
      </div>
    </div>
  );
};

export default Employees;
