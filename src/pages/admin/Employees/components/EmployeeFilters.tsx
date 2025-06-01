import React, { useState } from 'react';
import axiosInstance from '../../../../lib/axios';

interface EmployeeFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  filterActive: 'All' | 'Active' | 'Inactive';
  setFilterActive: (value: 'All' | 'Active' | 'Inactive') => void;
  filterRole: string;
  setFilterRole: (value: string) => void;
  setPage: (page: number) => void;
  availableRoles: string[];
  resetFilters: () => void;
  totalEmployees: number;
}

const roles = [
  { id: 1, name: 'Agent' },
  { id: 2, name: 'Business development manager' },
];

const AddEmployeeModal: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const [form, setForm] = useState({
    EmployeeId: '',
    EmployeePhone: '',
    EmployeeName: '',
    EmployeeRoleID: '',
    EmployeeMailId: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const res = await axiosInstance.post('/api/admin/employees', {
        EmployeeId: Number(form.EmployeeId),
        EmployeePhone: form.EmployeePhone,
        EmployeeName: form.EmployeeName,
        EmployeeRoleID: Number(form.EmployeeRoleID),
        EmployeeMailId: form.EmployeeMailId,
      });
      if (res.data.success) {
        setSuccessMsg(res.data.message || 'Employee created successfully');
        setTimeout(() => {
          onClose();
          setSuccessMsg('');
        }, 1000);
      } else {
        setError(res.data.message || 'Failed to create employee');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to create employee',
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Add New Employee</h3>
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={onClose}
            disabled={loading}
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="EmployeeId"
            type="number"
            className="input input-bordered w-full"
            placeholder="Employee ID"
            value={form.EmployeeId}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <input
            name="EmployeeName"
            type="text"
            className="input input-bordered w-full"
            placeholder="Employee Name"
            value={form.EmployeeName}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <input
            name="EmployeePhone"
            type="number"
            className="input input-bordered w-full"
            placeholder="Phone"
            value={form.EmployeePhone}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <select
            name="EmployeeRoleID"
            className="input input-bordered w-full"
            value={form.EmployeeRoleID}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
          <input
            name="EmployeeMailId"
            type="email"
            className="input input-bordered w-full"
            placeholder="Email"
            value={form.EmployeeMailId}
            onChange={handleChange}
            required
            disabled={loading}
          />
          {error && <div className="alert alert-error py-2">{error}</div>}
          {successMsg && (
            <div className="alert alert-success py-2">{successMsg}</div>
          )}
          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const EmployeeFilters: React.FC<EmployeeFiltersProps> = ({
  search,
  setSearch,
  filterActive,
  setFilterActive,
  filterRole,
  setFilterRole,
  setPage,
  availableRoles,
  resetFilters,
  totalEmployees,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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
        </div>
      </div>

      {/* Filters */}
      <div className="card bg-base-200 shadow-sm mb-6">
        <div className="card-body p-4 flex lg:flex-row flex-col items-center justify-between gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Search */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Search</span>
              </label>
              <input
                type="text"
                placeholder="Search by name or ID"
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
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
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
          </div>
          {/* Action Buttons */}
          <div className="flex gap-2">
            <button className="btn btn-outline btn-sm" onClick={resetFilters}>
              Reset Filters
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setIsAddModalOpen(true)}
            >
              Add Employee
            </button>
          </div>
        </div>
      </div>
      <AddEmployeeModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </>
  );
};
