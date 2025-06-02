import React, { useState } from 'react';
import axiosInstance from '../../../../lib/axios';
import toast from 'react-hot-toast';
import type { Assignment } from '../hooks/useGroupedRegionData';

interface Props {
  employeeId: string;
  assignments: Assignment[];
  refetch: () => void;
}

const RegionAssignmentTableRow: React.FC<Props> = ({
  employeeId,
  assignments,
  refetch,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleStatus = async (regionId: string, currentStatus: string) => {
    try {
      const payload = {
        RegionId: regionId,
        is_active: currentStatus === 'Active' ? 'Inactive' : 'Active',
      };
      const res = await axiosInstance.put(
        `/api/admin/regions/${employeeId}/status`,
        payload,
      );
      if (res.data.success) {
        toast.success('Status updated');
        refetch();
      }
    } catch {
      toast.error('Failed to update status');
    }
  };

  const deleteAssignment = async (id: number) => {
    const confirmed = window.confirm('Delete this region assignment?');
    if (!confirmed) return;

    try {
      const res = await axiosInstance.delete(`/api/admin/parivartan-bdm/${id}`);
      if (res.data.success) {
        toast.success('Assignment deleted');
        refetch();
      }
    } catch {
      toast.error('Failed to delete assignment');
    }
  };

  return (
    <>
      <tr
        className="hover cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <td colSpan={6} className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold text-base">
                {assignments[0]?.EmployeeName}
              </div>
              <div className="text-sm text-gray-500">
                ID: {assignments[0]?.EmployeeId}
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Total Regions: {assignments.length}
            </div>
          </div>
        </td>
      </tr>

      {isExpanded && (
        <tr>
          <td colSpan={6} className="p-0">
            <div className="bg-base-200 rounded-b-lg p-4 border-t border-base-300 animate-fade-in">
              <table className="table w-full text-sm">
                <thead>
                  <tr>
                    <th>Region</th>
                    <th>Project</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((a) => (
                    <tr key={a.id}>
                      <td>{a.RegionName}</td>
                      <td>{a.Project}</td>
                      <td>{a.role}</td>
                      <td>
                        <span
                          className={`badge ${
                            a.is_active === 'Active'
                              ? 'badge-success'
                              : 'badge-ghost'
                          }`}
                        >
                          {a.is_active}
                        </span>
                      </td>
                      <td className="text-right space-x-2">
                        <button
                          className="btn btn-xs btn-outline btn-info"
                          onClick={() => toggleStatus(a.RegionId, a.is_active)}
                        >
                          {a.is_active === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          className="btn btn-xs btn-outline btn-error"
                          onClick={() => deleteAssignment(a.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default RegionAssignmentTableRow;
