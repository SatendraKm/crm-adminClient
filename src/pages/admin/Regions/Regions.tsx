// pages/RegionsPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import type { Region } from './types/RegionTypes';
import { regionService } from './services/regionService';
import RegionTable from './components/RegionTable';
import RegionFilters from './components/RegionFilters';
import Pagination from './components/Pagination';
import StatusEditModal from './components/StatusEditModal';
import CreateRegionModal from './components/CreateRegionModal';

export interface FilterState {
  EmployeeName: string;
  role: string;
  Project: string;
  is_active: string;
  RegionId: string;
}

export interface PaginationState {
  currentPage: number;
  limit: number;
  total: number;
  totalPages: number;
}

const Regions: React.FC = () => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Region | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    EmployeeName: '',
    role: '',
    Project: '',
    is_active: '',
    RegionId: '',
  });

  // Pagination state
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchRegions = useCallback(
    async (resetPagination = false) => {
      try {
        setLoading(true);
        setError(null);

        const queryParams = {
          page: resetPagination ? 1 : pagination.currentPage,
          limit: pagination.limit,
          ...Object.fromEntries(
            Object.entries(filters).filter(([, value]) => value !== ''),
          ),
        };

        const response = await regionService.getRegions(queryParams);

        if (response.success) {
          setRegions(response.data);
          setPagination((prev) => ({
            ...prev,
            currentPage: resetPagination ? 1 : prev.currentPage,
            total: response.total || 0,
            totalPages: response.totalPages || 0,
          }));
        } else {
          setError('Failed to fetch regions data');
        }
      } catch (err) {
        setError('Error loading regions data. Please try again.');
        console.error('Error fetching regions:', err);
      } finally {
        setLoading(false);
      }
    },
    [filters, pagination.currentPage, pagination.limit],
  );

  useEffect(() => {
    fetchRegions();
  }, [fetchRegions]);

  const handleRefresh = () => {
    fetchRegions();
  };

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleApplyFilters = () => {
    fetchRegions(true); // Reset to page 1 when applying filters
  };

  const handleClearFilters = () => {
    setFilters({
      EmployeeName: '',
      role: '',
      Project: '',
      is_active: '',
      RegionId: '',
    });
    // Fetch will be triggered by useEffect due to filters change
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handleLimitChange = (limit: number) => {
    setPagination((prev) => ({
      ...prev,
      limit,
      currentPage: 1, // Reset to first page when changing limit
    }));
  };

  // Status editing handlers
  const handleEditStatus = (employee: Region) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleConfirmStatusUpdate = async (
    employeeId: string,
    newStatus: 'Active' | 'Inactive',
  ) => {
    try {
      setIsUpdatingStatus(true);

      const response = await regionService.updateEmployeeStatus(
        employeeId,
        newStatus,
      );

      if (response.success) {
        // Update the region in the current list
        setRegions((prev) =>
          prev.map((region) =>
            region.EmployeeId === employeeId
              ? { ...region, is_active: newStatus }
              : region,
          ),
        );

        // Show success message (you can use toast notification here)
        setError(null);

        // Close modal
        handleCloseModal();

        // Optional: Show success toast
        console.log('Status updated successfully:', response.message);
      } else {
        setError(response.message || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update employee status. Please try again.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Get unique values for filter dropdowns
  const getUniqueProjects = () => {
    return [...new Set(regions.map((r) => r.Project))].filter(Boolean);
  };
  // Get unique region IDs for filter dropdown
  const getUniqueRegionIds = () => {
    return [...new Set(regions.map((r) => r.RegionId))].filter(Boolean);
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Regions Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and view regional assignments
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className="btn btn-success"
              onClick={() => setIsCreateModalOpen(true)}
              disabled={loading}
            >
              + Assign New Region
            </button>
            <button
              className="btn btn-primary"
              onClick={handleRefresh}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Loading...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Refresh
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="stat bg-base-100 rounded-box shadow">
            <div className="stat-title">Total Records</div>
            <div className="stat-value text-primary">{pagination.total}</div>
          </div>
          <div className="stat bg-base-100 rounded-box shadow">
            <div className="stat-title">Current Page</div>
            <div className="stat-value text-info">
              {pagination.currentPage} / {pagination.totalPages}
            </div>
          </div>
          <div className="stat bg-base-100 rounded-box shadow">
            <div className="stat-title">Active Regions</div>
            <div className="stat-value text-success">
              {regions.filter((r) => r.is_active === 'Active').length}
            </div>
          </div>
          <div className="stat bg-base-100 rounded-box shadow">
            <div className="stat-title">Projects</div>
            <div className="stat-value text-secondary">
              {getUniqueProjects().length}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <RegionFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        projects={getUniqueProjects()}
        regionIds={getUniqueRegionIds()}
        loading={loading}
      />

      {/* Error Alert */}
      {error && (
        <div className="alert alert-error mb-6">
          <svg
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
          <div>
            <button className="btn btn-sm btn-outline" onClick={handleRefresh}>
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Table Card */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title text-xl font-semibold">Regions Data</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show:</span>
              <select
                className="select select-bordered select-sm"
                value={pagination.limit}
                onChange={(e) => handleLimitChange(Number(e.target.value))}
                disabled={loading}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-600">per page</span>
            </div>
          </div>

          <RegionTable
            regions={regions}
            loading={loading}
            onEditStatus={handleEditStatus}
          />

          {/* Pagination */}
          {!loading && !error && pagination.totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
                total={pagination.total}
                limit={pagination.limit}
              />
            </div>
          )}
        </div>
      </div>

      {/* Status Edit Modal */}
      <StatusEditModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        employee={selectedEmployee}
        onConfirm={handleConfirmStatusUpdate}
        loading={isUpdatingStatus}
      />
      <CreateRegionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={fetchRegions}
      />
    </div>
  );
};

export default Regions;
