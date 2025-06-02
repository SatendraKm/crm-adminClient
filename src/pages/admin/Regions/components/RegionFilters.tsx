import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../../lib/axios';

interface RegionFiltersProps {
  search: string;
  setSearch: (val: string) => void;
  selectedRegion: string;
  setSelectedRegion: (val: string) => void;
}

interface RegionOption {
  RegionId: string;
  RegionName: string;
}

const RegionFilters: React.FC<RegionFiltersProps> = ({
  search,
  setSearch,
  selectedRegion,
  setSelectedRegion,
}) => {
  const [regions, setRegions] = useState<RegionOption[]>([]);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await axiosInstance.get('/api/admin/regions-name');
        if (response.data.success) {
          setRegions(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch regions', error);
      }
    };

    fetchRegions();
  }, []);

  return (
    <div className="mb-4 flex flex-col sm:flex-row gap-4">
      <input
        type="text"
        placeholder="Search by name or ID"
        className="input input-bordered w-full sm:w-64"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        className="select select-bordered w-full sm:w-64"
        value={selectedRegion}
        onChange={(e) => setSelectedRegion(e.target.value)}
      >
        <option value="">All Regions</option>
        {regions.map((region) => (
          <option key={region.RegionId} value={region.RegionId}>
            {region.RegionName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RegionFilters;
