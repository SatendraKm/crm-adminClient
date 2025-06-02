import React from 'react';
import type { GroupedEmployee } from '../hooks/useGroupedRegionData';
import RegionAssignmentTableRow from './RegionAssignmentTableRow';

interface Props {
  data: GroupedEmployee[];
  loading: boolean;
  refetch: () => void;
}

const RegionAssignmentTable: React.FC<Props> = ({ data, loading, refetch }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-10 text-lg text-gray-500 animate-pulse">
        Loading region assignments...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex justify-center items-center py-10 text-lg text-gray-500">
        No region assignments found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg shadow border border-base-300">
      <table className="table w-full">
        <thead className="bg-base-200 text-base-content">
          <tr>
            <th
              colSpan={6}
              className="text-left text-lg font-semibold px-4 py-3"
            >
              Employee Region Assignments
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((employee) => (
            <RegionAssignmentTableRow
              key={employee.EmployeeId}
              employeeId={employee.EmployeeId}
              assignments={employee.assignments}
              refetch={refetch}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RegionAssignmentTable;
