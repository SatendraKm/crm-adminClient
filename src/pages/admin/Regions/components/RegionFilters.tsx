// components/RegionFilters.tsx
import React from 'react';
import type { FilterState } from '../RegionsPage';

interface RegionFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  projects: string[];
  loading: boolean;
}

const RegionFilters: React.FC<RegionFiltersProps> = ({
  filters,
  onFilterChange,
  onApplyFilters,
  onClearFilters,
  projects,
  loading,
}) => {
  const roles = ['BDM', 'Zonal Manager'];
  const statusOptions = ['Active', 'Inactive'];

  const hasActiveFilters = Object.values(filters).some((value) => value !== '');

  return (
    <div className="card bg-base-100 shadow-lg mb-6">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <h3 className="card-title text-lg">Filters</h3>
          {hasActiveFilters && (
            <div className="badge badge-primary">
              {Object.values(filters).filter((v) => v !== '').length} active
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Employee Name Filter */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Employee Name</span>
            </label>
            <input
              type="text"
              placeholder="Search by name..."
              className="input input-bordered"
              value={filters.EmployeeName}
              onChange={(e) => onFilterChange({ EmployeeName: e.target.value })}
              disabled={loading}
            />
          </div>

          {/* Role Filter */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Role</span>
            </label>
            <select
              className="select select-bordered"
              value={filters.role}
              onChange={(e) => onFilterChange({ role: e.target.value })}
              disabled={loading}
            >
              <option value="">All Roles</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/* Project Filter */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Project</span>
            </label>
            <select
              className="select select-bordered"
              value={filters.Project}
              onChange={(e) => onFilterChange({ Project: e.target.value })}
              disabled={loading}
            >
              <option value="">All Projects</option>
              {projects.map((project) => (
                <option key={project} value={project}>
                  {project}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Status</span>
            </label>
            <select
              className="select select-bordered"
              value={filters.is_active}
              onChange={(e) => onFilterChange({ is_active: e.target.value })}
              disabled={loading}
            >
              <option value="">All Status</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 justify-end">
          <button
            className="btn btn-outline"
            onClick={onClearFilters}
            disabled={loading || !hasActiveFilters}
          >
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Clear Filters
          </button>
          <button
            className="btn btn-primary"
            onClick={onApplyFilters}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Applying...
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
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
                  />
                </svg>
                Apply Filters
              </>
            )}
          </button>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-base-300">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-600">
                Active filters:
              </span>
              {Object.entries(filters).map(([key, value]) => {
                if (!value) return null;
                return (
                  <div key={key} className="badge badge-ghost gap-2">
                    <span className="font-medium">
                      {key === 'EmployeeName'
                        ? 'Name'
                        : key === 'is_active'
                        ? 'Status'
                        : key}
                      :
                    </span>
                    <span>{value}</span>
                    <button
                      className="btn btn-ghost btn-xs"
                      onClick={() =>
                        onFilterChange({ [key]: '' } as Partial<FilterState>)
                      }
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegionFilters;
