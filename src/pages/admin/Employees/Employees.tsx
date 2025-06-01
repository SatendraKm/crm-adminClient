import React from 'react';
import type { Employee } from './types/EmployeeTypes';
import { useEmployeeFilters } from './hooks/useEmployeeFilters';
import { useEmployees } from './hooks/useEmployees';
import { EmployeeFilters } from './components/EmployeeFilters';
import { EmployeeTable } from './components/EmployeeTable';
import { Pagination } from './components/Pagination';
import { StatusEditModal } from './components/StatusEditModal';
import axiosInstance from '../../../lib/axios';
import toast from 'react-hot-toast';

const Employees: React.FC = () => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedEmployee, setSelectedEmployee] =
    React.useState<Employee | null>(null);
  const [statusLoading, setStatusLoading] = React.useState(false);

  const {
    search,
    setSearch,
    filterActive,
    setFilterActive,
    filterRole,
    setFilterRole,
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
    limit,
    refetch,
  } = useEmployees(filters);

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
        await refetch();
        toast.success(
          `Employee ${selectedEmployee.EmployeeName}'s status updated successfully!`,
        );
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
          setPage={setPage}
          availableRoles={availableRoles}
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
