import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../../lib/axios';
import toast from 'react-hot-toast';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAssigned: () => void;
}

interface Employee {
  EmployeeId: number;
  EmployeeName: string;
  EmployeeRoleID: number;
}

interface Region {
  RegionId: string;
  RegionName: string;
}

const defaultForm = {
  EmployeeId: '',
  RegionId: '',
  Project: 'Parivartan',
  is_bdm: false,
  is_zonal_manager: false,
};

const AssignRegionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onAssigned,
}) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [form, setForm] = useState({ ...defaultForm });

  // Fetch options on open
  useEffect(() => {
    if (!isOpen) return;

    const fetchOptions = async () => {
      try {
        const [empRes, regRes] = await Promise.all([
          axiosInstance.get('/api/admin/employees/list'),
          axiosInstance.get('/api/admin/regions-name'),
        ]);
        if (empRes.data.success) setEmployees(empRes.data.data);
        if (regRes.data.success) setRegions(regRes.data.data);
      } catch {
        toast.error('Failed to load employees or regions');
      }
    };

    fetchOptions();
    setForm({ ...defaultForm }); // Reset form when modal opens
  }, [isOpen]);

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const selectedEmp = employees.find(
      (e) => String(e.EmployeeId) === form.EmployeeId,
    );
    if (!selectedEmp) return toast.error('Please select a valid employee');
    if (!form.RegionId) return toast.error('Please select a region');

    const payload = {
      EmployeeId: form.EmployeeId,
      EmployeeName: selectedEmp.EmployeeName,
      RegionId: form.RegionId,
      Project: form.Project,
      is_bdm: form.is_bdm ? 'Yes' : 'No',
      is_zonal_manager: form.is_zonal_manager ? 'Yes' : 'No',
    };

    try {
      const res = await axiosInstance.post(
        '/api/admin/region-assignment',
        payload,
      );
      if (res.data.success) {
        toast.success('Region assigned');
        onAssigned();
        onClose();
      } else {
        toast.error(res.data.message || 'Failed to assign region');
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || 'Something went wrong';
      toast.error(message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-base-100 p-6 rounded-xl shadow-lg w-full max-w-lg">
        <h2 className="text-lg font-semibold mb-4">Assign New Region</h2>

        <div className="form-control mb-3">
          <label className="label">Employee</label>
          <select
            className="select select-bordered"
            value={form.EmployeeId}
            onChange={(e) => handleChange('EmployeeId', e.target.value)}
          >
            <option value="">Select Employee</option>
            {employees
              .filter((emp) => [1, 2, 3].includes(emp.EmployeeRoleID))
              .map((emp) => (
                <option key={emp.EmployeeId} value={emp.EmployeeId}>
                  {emp.EmployeeName} ({emp.EmployeeId})
                </option>
              ))}
          </select>
        </div>

        <div className="form-control mb-3">
          <label className="label">Region</label>
          <select
            className="select select-bordered"
            value={form.RegionId}
            onChange={(e) => handleChange('RegionId', e.target.value)}
          >
            <option value="">Select Region</option>
            {regions.map((region) => (
              <option key={region.RegionId} value={region.RegionId}>
                {region.RegionName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control mb-3">
          <label className="label">Project</label>
          <select
            className="select select-bordered"
            value={form.Project}
            onChange={(e) => handleChange('Project', e.target.value)}
          >
            <option value="Parivartan">Parivartan</option>
            <option value="Gen Nxt">Gen Nxt</option>
            <option value="Open Shed">Open Shed</option>
          </select>
        </div>

        <div className="form-control mb-4">
          <label className="label">Roles</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="checkbox"
                checked={form.is_bdm}
                onChange={(e) => handleChange('is_bdm', e.target.checked)}
              />
              BDM
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="checkbox"
                checked={form.is_zonal_manager}
                onChange={(e) =>
                  handleChange('is_zonal_manager', e.target.checked)
                }
              />
              Zonal Manager
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Assign
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignRegionModal;
