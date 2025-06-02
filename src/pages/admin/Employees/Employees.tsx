import React from 'react';
import type { Employee } from './types/EmployeeTypes';
import { useEmployeeFilters } from './hooks/useEmployeeFilters';
import { useEmployees } from './hooks/useEmployees';
import { EmployeeFilters } from './components/EmployeeFilters';
import { EmployeeTable } from './components/EmployeeTable';
import { Pagination } from './components/Pagination';
import { EmployeeEditModal } from './components/StatusEditModal';
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

  // const handleEditStatus = (employee: Employee) => {
  //   setSelectedEmployee(employee);
  //   setModalOpen(true);
  // };

  // // Handler to confirm status change
  // const handleConfirmStatus = async (newStatus: boolean) => {
  //   if (!selectedEmployee) return;
  //   setStatusLoading(true);
  //   try {
  //     const res = await axiosInstance.put(
  //       `/api/admin/employees/${selectedEmployee.EmployeeId}/status`,
  //       { is_active: newStatus },
  //     );
  //     if (res.data.success) {
  //       await refetch();
  //       toast.success(
  //         `Employee ${selectedEmployee.EmployeeName}'s status updated successfully!`,
  //       );
  //     } else {
  //       alert(res.data.message || 'Failed to update status');
  //     }
  //   } catch (err: any) {
  //     alert(
  //       err.response?.data?.message || err.message || 'Failed to update status',
  //     );
  //   } finally {
  //     setStatusLoading(false);
  //     setModalOpen(false);
  //     setSelectedEmployee(null);
  //   }
  // };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setModalOpen(true);
  };

  // Handler to confirm employee edit
  const handleConfirmEdit = async (updated: {
    EmployeeName: string;
    EmployeePhone: string;
    EmployeeMailId: string | null;
    is_active: boolean;
    EmployeeId: number;
    EmployeeRoleID?: number | string;
  }) => {
    if (!selectedEmployee) return;
    setStatusLoading(true);
    try {
      const res = await axiosInstance.put(
        `/api/admin/employees/${selectedEmployee.EmployeeId}/status`,
        {
          EmployeeName: updated.EmployeeName,
          EmployeePhone: updated.EmployeePhone,
          EmployeeMailId: updated.EmployeeMailId,
          is_active: updated.is_active,
          EmployeeId: updated.EmployeeId,
          EmployeeRoleID: updated.EmployeeRoleID,
        },
      );
      if (res.data.success) {
        await refetch();
        toast.success(
          `Employee ${updated.EmployeeName}'s details updated successfully!`,
        );
      } else {
        alert(res.data.message || 'Failed to update employee');
      }
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
          err.message ||
          'Failed to update employee',
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
          onEditStatus={handleEditEmployee}
        />
        <Pagination
          page={page}
          totalPages={totalPages}
          totalEmployees={totalEmployees}
          limit={limit}
          onPageChange={setPage}
        />
        <EmployeeEditModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          employee={selectedEmployee}
          onConfirm={handleConfirmEdit}
          loading={statusLoading}
        />
      </div>
    </div>
  );
};

export default Employees;
