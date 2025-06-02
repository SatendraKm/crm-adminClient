import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../../lib/axios';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const CreateRegionModal: React.FC<Props> = ({ isOpen, onClose, onCreated }) => {
  const [form, setForm] = useState({
    EmployeeId: '',
    EmployeeName: '',
    RegionId: '',
    is_zonal_manager: '',
    is_bdm: '',
    Project: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // New state for dropdowns
  const [employees, setEmployees] = useState<
    { EmployeeId: string; EmployeeName: string; EmployeeRoleID: number }[]
  >([]);
  const [regions, setRegions] = useState<
    { RegionId: string; RegionName: string }[]
  >([]);

  useEffect(() => {
    if (!isOpen) return;
    // Fetch employees
    axiosInstance.get('/api/admin/employees/list').then((res) => {
      if (res.data.success) setEmployees(res.data.data);
    });
    // Fetch regions
    axiosInstance.get('/api/admin/regions-name').then((res) => {
      if (res.data.success) setRegions(res.data.data);
    });
  }, [isOpen]);

  // Helper to get role label
  const getRoleLabel = (roleId: number) => {
    if (roleId === 2) return 'BDM';
    if (roleId === 3) return 'Zonal Head';
    return '';
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEmployeeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const emp = employees.find((emp) => String(emp.EmployeeId) === selectedId);

    setForm({
      ...form,
      EmployeeId: selectedId,
      EmployeeName: emp?.EmployeeName || '',
      is_zonal_manager: emp?.EmployeeRoleID === 3 ? 'Yes' : 'No',
      is_bdm: emp?.EmployeeRoleID === 2 ? 'Yes' : 'No',
    });
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({
      ...form,
      RegionId: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await axiosInstance.post(
        '/api/admin/region-assignment',
        form,
      );
      if (res.data.success) {
        setSuccess(res.data.message);
        onCreated();
        setTimeout(() => {
          onClose();
          setSuccess(null);
        }, 1000);
      } else {
        setError(res.data.message || 'Region Mapping already available.');
      }
    } catch (err: any) {
      setError('Region Mapping already available.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md">
        <h3 className="font-bold text-lg mb-4">Create New Region Assignment</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Employee Dropdown */}
          <select
            className="select select-bordered w-full"
            name="EmployeeId"
            value={form.EmployeeId}
            onChange={handleEmployeeChange}
            required
            disabled={loading}
          >
            <option value="">Select Employee</option>
            {employees
              .filter(
                (emp) => emp.EmployeeRoleID === 2 || emp.EmployeeRoleID === 3,
              )
              .map((emp) => (
                <option key={emp.EmployeeId} value={emp.EmployeeId}>
                  {emp.EmployeeName} ({emp.EmployeeId}) -{' '}
                  {getRoleLabel(emp.EmployeeRoleID)}
                </option>
              ))}
          </select>
          {/* Region Dropdown */}
          <select
            className="select select-bordered w-full"
            name="RegionId"
            value={form.RegionId}
            onChange={handleRegionChange}
            required
            disabled={loading}
          >
            <option value="">Select Region</option>
            {regions.map((region) => (
              <option key={region.RegionId} value={region.RegionId}>
                {region.RegionName} ({region.RegionId})
              </option>
            ))}
          </select>
          {/* Project Dropdown */}
          <select
            className="select select-bordered w-full"
            name="Project"
            value={form.Project}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="">Select Project</option>
            <option value="Parivartan">Parivartan</option>
            <option value="Gen Nxt">Gen Nxt</option>
            <option value="Open Shed">Open Shed</option>
          </select>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
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
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRegionModal;
