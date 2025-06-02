import React, { useState } from 'react';
import RegionFilters from './components/RegionFilters';
import RegionAssignmentTable from './components/RegionAssignmentTable';
import useGroupedRegionData from './hooks/useGroupedRegionData';
import AssignRegionModal from './components/AssignRegionModal';

const Regions = () => {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('');
  const { data, loading, refetch } = useGroupedRegionData(
    search,
    selectedRegion,
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Regions Management</h1>
          <p className="text-sm text-gray-500">
            Manage and view regional assignments
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          Assign New Regions
        </button>
      </div>

      {/* Filters */}
      <RegionFilters
        search={search}
        setSearch={setSearch}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
      />

      {/* Table */}
      <RegionAssignmentTable data={data} loading={loading} refetch={refetch} />

      <AssignRegionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAssigned={() => {
          refetch();
        }}
      />
    </div>
  );
};

export default Regions;
