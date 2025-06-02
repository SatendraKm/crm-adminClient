// src/hooks/useGroupedRegionData.ts
import { useEffect, useState, useCallback } from 'react';
import axiosInstance from '../../../../lib/axios';

export interface Assignment {
  id: number;
  EmployeeId: string;
  EmployeeName: string;
  Project: string;
  role: string;
  RegionId: string;
  RegionName: string;
  StateId: string;
  StateName: string;
  is_active: string;
}

export interface GroupedEmployee {
  EmployeeId: string;
  EmployeeName: string;
  assignments: Assignment[];
}

const useGroupedRegionData = (search: string, regionId: string) => {
  const [data, setData] = useState<GroupedEmployee[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/api/admin/regions');
      if (res.data.success) {
        const raw: Assignment[] = res.data.data;

        // Filter
        const filtered = raw.filter((a) => {
          const matchSearch =
            a.EmployeeName.toLowerCase().includes(search.toLowerCase()) ||
            a.EmployeeId.includes(search);
          const matchRegion = regionId ? a.RegionId === regionId : true;
          return matchSearch && matchRegion;
        });

        // Group by EmployeeId
        const map = new Map<string, GroupedEmployee>();

        for (const row of filtered) {
          if (!map.has(row.EmployeeId)) {
            map.set(row.EmployeeId, {
              EmployeeId: row.EmployeeId,
              EmployeeName: row.EmployeeName,
              assignments: [],
            });
          }
          map.get(row.EmployeeId)?.assignments.push(row);
        }

        setData(Array.from(map.values()));
      }
    } catch (err) {
      console.error('Failed to fetch regions data', err);
    } finally {
      setLoading(false);
    }
  }, [search, regionId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, refetch: fetchData };
};

export default useGroupedRegionData;
