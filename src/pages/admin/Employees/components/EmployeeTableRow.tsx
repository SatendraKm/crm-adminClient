import React from 'react';
import type { Employee } from '../types/employee';
import { truncateText, getStatusBadge } from '../utils/employeeUtils';

interface EmployeeTableRowProps {
  employee: Employee;
}

export const EmployeeTableRow: React.FC<EmployeeTableRowProps> = ({
  employee,
}) => {
  // console.log(employee);
  return (
    <tr className="hover">
      <td className="font-mono text-sm">{employee.EmployeeId}</td>
      <td>
        <div className="font-medium">{employee.EmployeeName}</div>
      </td>
      <td className="font-mono text-sm">{employee.EmployeePhone}</td>
      <td>
        <div className="max-w-xs">
          {employee.EmployeeMailId ? (
            <a
              href={`mailto:${employee.EmployeeMailId}`}
              className="link link-primary text-sm"
            >
              {truncateText(employee.EmployeeMailId, 25)}
            </a>
          ) : (
            <span className="text-base-content/50">-</span>
          )}
        </div>
      </td>
      <td>
        <div className="max-w-xs">
          <span className="text-sm" title={employee.RegionName || ''}>
            {truncateText(employee.RegionName, 20)}
          </span>
        </div>
      </td>
      <td>
        <div className="max-w-xs">
          <span className="text-sm" title={employee.role?.RoleName || ''}>
            {truncateText(employee.role?.RoleName, 20)}
          </span>
        </div>
      </td>
      <td>{getStatusBadge(employee.is_active)}</td>
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
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>
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
                strokeWidth="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
};
