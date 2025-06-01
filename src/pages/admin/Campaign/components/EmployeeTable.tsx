import React from 'react';
import axiosInstance from '../../../../lib/axios';
import type { Employee } from '../types/CampaignTypes';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface EmployeeTableProps {
  employees: Employee[];
  campaignId: number;
  onEmployeeRemoved?: (employeeId: number) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  campaignId,
  onEmployeeRemoved,
}) => {
  const handleDelete = async (employeeId: number) => {
    try {
      const res = await axiosInstance.delete(
        '/api/admin/campaigns/employee-campaign',
        {
          data: {
            EmployeeId: employeeId,
            CampaignId: campaignId,
          },
        },
      );
      if (res.data.success) {
        if (onEmployeeRemoved) onEmployeeRemoved(employeeId);
        toast.success('Employee removed successfully');
      } else {
        alert(res.data.message || 'Failed to remove employee');
      }
    } catch (err) {
      alert('Error removing employee');
    }
  };
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
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
                  onClick={() => handleDelete(employee.EmployeeId)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
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
