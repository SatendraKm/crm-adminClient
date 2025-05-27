import React from 'react';
import { truncateText } from '../utils/employeeUtils';

interface EmployeeFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  filterActive: 'All' | 'Active' | 'Inactive';
  setFilterActive: (value: 'All' | 'Active' | 'Inactive') => void;
  filterRole: string;
  setFilterRole: (value: string) => void;
  filterRegion: string;
  setFilterRegion: (value: string) => void;
  setPage: (page: number) => void;
  availableRoles: string[];
  uniqueRegions: string[];
  resetFilters: () => void;
  totalEmployees: number;
}

export const EmployeeFilters: React.FC<EmployeeFiltersProps> = ({
  search,
  setSearch,
  filterActive,
  setFilterActive,
  filterRole,
  setFilterRole,
  filterRegion,
  setFilterRegion,
  setPage,
  availableRoles,
  uniqueRegions,
  resetFilters,
  totalEmployees,
}) => {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-base-content">
              Employee Management
            </h1>
            <p className="text-base-content/70 mt-1">
              {totalEmployees} employees found
            </p>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-outline btn-sm" onClick={resetFilters}>
              Reset Filters
            </button>
            <button className="btn btn-primary btn-sm">Add Employee</button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card bg-base-200 shadow-sm mb-6">
        <div className="card-body p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Search</span>
              </label>
              <input
                type="text"
                placeholder="Search by name or ID..."
                className="input input-bordered input-sm"
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
                }}
              />
            </div>

            {/* Status Filter */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Status</span>
              </label>
              <select
                className="select select-bordered select-sm"
                value={filterActive}
                onChange={(e) => {
                  setPage(1);
                  setFilterActive(
                    e.target.value as 'All' | 'Active' | 'Inactive',
                  );
                }}
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active Only</option>
                <option value="Inactive">Inactive/Null Only</option>
              </select>
            </div>

            {/* Role Filter */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Role</span>
              </label>
              <select
                className="select select-bordered select-sm"
                value={filterRole}
                onChange={(e) => {
                  setPage(1);
                  setFilterRole(e.target.value);
                }}
              >
                <option value="All">All Roles</option>
                {availableRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* Region Filter */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Region</span>
              </label>
              <select
                className="select select-bordered select-sm"
                value={filterRegion}
                onChange={(e) => {
                  setPage(1);
                  setFilterRegion(e.target.value);
                }}
              >
                <option value="All">All Regions</option>
                {uniqueRegions.map((region) => (
                  <option key={region} value={region}>
                    {truncateText(region, 25)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
