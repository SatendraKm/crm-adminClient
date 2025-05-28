import React from 'react';
import type { Employee } from '../types/CampaignTypes';

interface EmployeeTableProps {
  employees: Employee[];
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ employees }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th className="text-left">Employee ID</th>
            <th className="text-left">Name</th>
            <th className="text-left">Phone</th>
            <th className="text-left">Region</th>
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
                {employee.EmployeeRegion ? (
                  <span className="badge badge-outline badge-sm">
                    {employee.EmployeeRegion}
                  </span>
                ) : (
                  <span className="text-base-content/50 text-sm italic">
                    Not specified
                  </span>
                )}
              </td>
              <td>
                <div className="flex gap-1">
                  <button className="btn btn-ghost btn-xs">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                  <button className="btn btn-ghost btn-xs text-error">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
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
