import React, { useState } from 'react';
import axiosInstance from '../../../../lib/axios';
import type { Employee } from '../types/CampaignTypes';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmDeleteModal from './confirmDeleteModal';

interface EmployeeTableProps {
  employees: Employee[];
  campaignId: number;
  onEmployeeRemoved?: (employeeId: number) => void;
  refetch?: () => Promise<void>;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  campaignId,
  onEmployeeRemoved,
  refetch,
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [deleting, setDeleting] = useState(false);

  const handleDeleteClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedEmployee) return;
    setDeleting(true);
    try {
      const res = await axiosInstance.delete(
        '/api/admin/campaigns/employee-campaign',
        {
          data: {
            EmployeeId: selectedEmployee.EmployeeId,
            CampaignId: campaignId,
          },
        },
      );
      if (res.data.success) {
        if (onEmployeeRemoved) onEmployeeRemoved(selectedEmployee.EmployeeId);
        toast.success('Employee removed successfully');
        if (refetch) await refetch();
      } else {
        alert(res.data.message || 'Failed to remove employee');
      }
    } catch (err) {
      alert('Error removing employee');
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
      setSelectedEmployee(null);
    }
  };
  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th className="text-left">Employee ID</th>
            <th className="text-left">Name</th>
            <th className="text-left">Phone</th>
            <th className="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.EmployeeId} className="hover">
              <td>
                <span className="font-mono text-sm bg-base-200 px-2 py-1 rounded">
                  {employee.EmployeeId}
                </span>
              </td>
              <td>
                <div className="font-medium">{employee.EmployeeName}</div>
              </td>
              <td>
                <a
                  href={`tel:${employee.EmployeePhone}`}
                  className="link link-primary hover:link-hover"
                >
                  {employee.EmployeePhone}
                </a>
              </td>
              <td>
                <button
                  className="btn btn-ghost btn-xs text-error"
                  onClick={() => handleDeleteClick(employee)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
          <ConfirmDeleteModal
            open={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={handleConfirmDelete}
            employeeName={selectedEmployee?.EmployeeName}
            loading={deleting}
          />
        </tbody>
      </table>

      {employees.length === 0 && (
        <div className="text-center py-8 text-base-content/50">
          <div className="text-4xl mb-2">👥</div>
          <p>No employees assigned to this campaign</p>
        </div>
      )}
    </div>
  );
};

export default EmployeeTable;
