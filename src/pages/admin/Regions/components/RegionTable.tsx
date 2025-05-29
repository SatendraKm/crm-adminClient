// components/RegionTable.tsx
import React from 'react';
import type { Region } from '../types/RegionTypes';

interface RegionTableProps {
  regions: Region[];
  loading: boolean;
  onEditStatus: (employee: Region) => void;
}

const RegionTable: React.FC<RegionTableProps> = ({
  regions,
  loading,
  onEditStatus,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (regions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">No regions data available</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th className="text-left">Employee ID</th>
            <th className="text-left">Employee Name</th>
            <th className="text-left">Project</th>
            <th className="text-left">Role</th>
            <th className="text-left">Region ID</th>
            <th className="text-left">Region Name</th>
            <th className="text-left">Status</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {regions.map((region, index) => (
            <tr key={`${region.RegionId}-${index}`} className="hover">
              <td className="font-mono text-sm">{region.EmployeeId}</td>
              <td className="font-medium">{region.EmployeeName}</td>
              <td>
                <span className="badge badge-outline badge-primary">
                  {region.Project}
                </span>
              </td>
              <td>
                <span className="badge badge-secondary">{region.role}</span>
              </td>
              <td className="font-mono text-sm">{region.RegionId}</td>
              <td className="font-medium">{region.RegionName}</td>
              <td>
                <span
                  className={`badge ${
                    region.is_active === 'Active'
                      ? 'badge-success'
                      : 'badge-error'
                  }`}
                >
                  {region.is_active}
                </span>
              </td>
              <td className="text-center">
                <div className="flex justify-center gap-2">
                  <button
                    className="btn btn-sm btn-outline btn-primary"
                    onClick={() => onEditStatus(region)}
                    title="Edit Status"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit Status
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RegionTable;
