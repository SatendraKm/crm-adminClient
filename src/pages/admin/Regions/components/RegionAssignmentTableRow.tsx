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

  const handleToggleStatus = async (
    regionId: string,
    currentStatus: string,
  ) => {
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
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this region assignment?'))
      return;
    try {
      const res = await axiosInstance.delete(`/api/admin/parivartan-bdm/${id}`);
      if (res.data.success) {
        toast.success('Region assignment deleted');
        refetch();
      }
    } catch (err) {
      toast.error('Failed to delete assignment');
    }
  };

  return (
    <>
      <tr className="hover">
        <td colSpan={6}>
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div>
              <div className="font-semibold">
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
          <td colSpan={6}>
            <div className="bg-base-200 rounded-md p-4 mt-2">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Region</th>
                    <th>Project</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((a) => (
                    <tr key={a.id}>
                      <td>{a.RegionName}</td>
                      <td>{a.Project}</td>
                      <td>{a.role}</td>
                      <td>{a.is_active}</td>
                      <td>
                        <button
                          className="btn btn-xs btn-outline btn-info mr-2"
                          onClick={() =>
                            handleToggleStatus(a.RegionId, a.is_active)
                          }
                        >
                          {a.is_active === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          className="btn btn-xs btn-outline btn-error"
                          onClick={() => handleDelete(a.id)}
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
