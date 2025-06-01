import React from 'react';
import type { Employee } from '../types/EmployeeTypes';
import { EmployeeTableRow } from './EmployeeTableRow';

interface EmployeeTableProps {
  employees?: Employee[];
  loading: boolean;
  error: string | null;
  onEditStatus?: (employee: Employee) => void;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees = [],
  loading,
  error,
  onEditStatus,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body p-0">
        <div className="overflow-x-auto">
          <table className="overflow-x-auto table rounded-box border border-base bg-base-100 ">
            <thead>
              <tr className="bg-base-200">
                <th className="font-semibold">ID</th>
                <th className="font-semibold">Name</th>
                <th className="font-semibold">Phone</th>
                <th className="font-semibold">Email</th>
                <th className="font-semibold">Role</th>
                <th className="font-semibold">Status</th>
                <th className="font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-base-content/30"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <p className="text-base-content/70">No employees found</p>
                      <p className="text-sm text-base-content/50">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                employees.map((employee) => (
                  <EmployeeTableRow
                    key={employee.EmployeeId}
                    employee={employee}
                    onEditStatus={onEditStatus}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
