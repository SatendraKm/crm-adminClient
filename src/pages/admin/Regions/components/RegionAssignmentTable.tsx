// src/components/RegionAssignmentTable.tsx
import React from 'react';
import type { GroupedEmployee } from '../hooks/useGroupedRegionData';
import RegionAssignmentTableRow from './RegionAssignmentTableRow';

interface Props {
  data: GroupedEmployee[];
  loading: boolean;
  refetch: () => void;
}

const RegionAssignmentTable: React.FC<Props> = ({ data, loading, refetch }) => {
  if (loading) return <div className="text-center py-6">Loading...</div>;
  if (data.length === 0)
    return <div className="text-center py-6">No data found</div>;

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th colSpan={6} className="text-left">
              Employee Assignments
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((emp) => (
            <RegionAssignmentTableRow
              key={emp.EmployeeId}
              employeeId={emp.EmployeeId}
              assignments={emp.assignments}
              refetch={refetch}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RegionAssignmentTable;
