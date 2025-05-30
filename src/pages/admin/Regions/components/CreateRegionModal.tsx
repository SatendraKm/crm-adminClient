import React, { useState } from 'react';
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
    is_zonal_manager: 'No',
    is_bdm: 'Yes',
    Project: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
        setError(res.data.message || 'Failed to create region');
      }
    } catch (err: any) {
      setError('Failed to create region');
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
          <input
            className="input input-bordered w-full"
            name="EmployeeId"
            placeholder="Employee ID"
            value={form.EmployeeId}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <input
            className="input input-bordered w-full"
            name="EmployeeName"
            placeholder="Employee Name"
            value={form.EmployeeName}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <input
            className="input input-bordered w-full"
            name="RegionId"
            placeholder="Region ID"
            value={form.RegionId}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <input
            className="input input-bordered w-full"
            name="Project"
            placeholder="Project"
            value={form.Project}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <div className="flex gap-2">
            <label className="label cursor-pointer">
              <span className="label-text">Zonal Manager</span>
              <input
                type="radio"
                name="is_zonal_manager"
                value="Yes"
                checked={form.is_zonal_manager === 'Yes'}
                onChange={handleChange}
                disabled={loading}
              />
              Yes
              <input
                type="radio"
                name="is_zonal_manager"
                value="No"
                checked={form.is_zonal_manager === 'No'}
                onChange={handleChange}
                disabled={loading}
              />
              No
            </label>
            <label className="label cursor-pointer">
              <span className="label-text">BDM</span>
              <input
                type="radio"
                name="is_bdm"
                value="Yes"
                checked={form.is_bdm === 'Yes'}
                onChange={handleChange}
                disabled={loading}
              />
              Yes
              <input
                type="radio"
                name="is_bdm"
                value="No"
                checked={form.is_bdm === 'No'}
                onChange={handleChange}
                disabled={loading}
              />
              No
            </label>
          </div>
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
