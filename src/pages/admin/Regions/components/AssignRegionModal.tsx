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
}

interface Region {
  RegionId: string;
  RegionName: string;
}

const AssignRegionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onAssigned,
}) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [form, setForm] = useState({
    EmployeeId: '',
    EmployeeName: '',
    RegionId: '',
    Project: 'Parivartan',
    is_bdm: false,
    is_zonal_manager: false,
  });

  // Fetch employees and regions
  useEffect(() => {
    if (!isOpen) return;
    const fetchData = async () => {
      try {
        const [empRes, regRes] = await Promise.all([
          axiosInstance.get('/api/admin/employees/list'),
          axiosInstance.get('/api/admin/regions-name'),
        ]);
        if (empRes.data.success) setEmployees(empRes.data.data);
        if (regRes.data.success) setRegions(regRes.data.data);
      } catch (err) {
        toast.error('Failed to load data');
      }
    };
    fetchData();
  }, [isOpen]);

  const handleSubmit = async () => {
    const selectedEmp = employees.find(
      (e) => String(e.EmployeeId) === form.EmployeeId,
    );
    if (!selectedEmp) return toast.error('Invalid employee selected');

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
        toast.success('Region assigned successfully');
        onAssigned();
        onClose();
      } else {
        toast.error(res.data.message || 'Failed to assign region');
      }
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-base-100 p-6 rounded-lg shadow-lg w-full max-w-lg space-y-4">
        <h2 className="text-lg font-semibold">Assign New Region</h2>

        {/* Employee Dropdown */}
        <select
          className="select select-bordered w-full"
          value={form.EmployeeId}
          onChange={(e) => handleChange('EmployeeId', e.target.value)}
        >
          <option value="">Select Employee</option>
          {employees.map((emp) => (
            <option key={emp.EmployeeId} value={emp.EmployeeId}>
              {emp.EmployeeName} ({emp.EmployeeId})
            </option>
          ))}
        </select>

        {/* Region Dropdown */}
        <select
          className="select select-bordered w-full"
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

        {/* Project Dropdown */}
        <select
          className="select select-bordered w-full"
          value={form.Project}
          onChange={(e) => handleChange('Project', e.target.value)}
        >
          <option value="Parivartan">Parivartan</option>
          <option value="Gen Nxt">Gen Nxt</option>
          <option value="Open Shed">Open Shed</option>
        </select>

        {/* Role Checkboxes */}
        <div className="flex gap-4">
          <label className="label cursor-pointer">
            <input
              type="checkbox"
              className="checkbox checkbox-sm mr-2"
              checked={form.is_bdm}
              onChange={(e) => handleChange('is_bdm', e.target.checked)}
            />
            BDM
          </label>
          <label className="label cursor-pointer">
            <input
              type="checkbox"
              className="checkbox checkbox-sm mr-2"
              checked={form.is_zonal_manager}
              onChange={(e) =>
                handleChange('is_zonal_manager', e.target.checked)
              }
            />
            Zonal Manager
          </label>
        </div>

        {/* Actions */}
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
