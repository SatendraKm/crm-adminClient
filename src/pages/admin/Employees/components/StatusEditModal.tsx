import React from 'react';

interface EmployeeEditModalProps {
  open: boolean;
  onClose: () => void;
  employee: {
    EmployeeId: number;
    EmployeeName: string;
    EmployeePhone: string;
    EmployeeMailId: string | null;
    is_active: boolean | null;
    EmployeeRoleID?: number | string;
  } | null;
  onConfirm: (updated: {
    EmployeeId: number;
    EmployeeName: string;
    EmployeePhone: string;
    EmployeeMailId: string | null;
    is_active: boolean;
    EmployeeRoleID?: number | string;
  }) => void;
  loading: boolean;
}

const roleOptions = [
  { id: 1, name: 'Agent' },
  { id: 2, name: 'Bussiness development manger' },
  { id: 3, name: 'Zonal Head Parivartan' },
];

export const EmployeeEditModal: React.FC<EmployeeEditModalProps> = ({
  open,
  onClose,
  employee,
  onConfirm,
  loading,
}) => {
  const [form, setForm] = React.useState({
    EmployeeId: 0,
    EmployeeName: '',
    EmployeePhone: '',
    EmployeeMailId: '',
    is_active: true,
    EmployeeRoleID: '',
  });

  React.useEffect(() => {
    if (employee) {
      setForm({
        EmployeeId: employee.EmployeeId || 0,
        EmployeeName: employee.EmployeeName || '',
        EmployeePhone: employee.EmployeePhone || '',
        EmployeeMailId: employee.EmployeeMailId || '',
        is_active: employee.is_active ?? true,
        EmployeeRoleID: employee.EmployeeRoleID?.toString() ?? '',
      });
    }
  }, [employee, open]);

  if (!open || !employee) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-sm">
        <h3 className="font-bold text-lg mb-4">Edit Employee</h3>
        <div className="mb-4 space-y-2">
          {/* Employee ID */}
          <label className="block text-sm font-medium mb-1">Employee ID</label>
          <input
            className="input input-bordered w-full"
            type="number"
            placeholder="Employee ID"
            value={form.EmployeeId}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                EmployeeId: Number(e.target.value),
              }))
            }
            disabled={loading}
          />

          {/* Name */}
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            className="input input-bordered w-full"
            placeholder="Name"
            value={form.EmployeeName}
            onChange={(e) =>
              setForm((f) => ({ ...f, EmployeeName: e.target.value }))
            }
            disabled={loading}
          />

          {/* Phone */}
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            className="input input-bordered w-full"
            placeholder="Phone"
            value={form.EmployeePhone}
            onChange={(e) =>
              setForm((f) => ({ ...f, EmployeePhone: e.target.value }))
            }
            disabled={loading}
          />

          {/* Email */}
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            className="input input-bordered w-full"
            placeholder="Email"
            value={form.EmployeeMailId || ''}
            onChange={(e) =>
              setForm((f) => ({ ...f, EmployeeMailId: e.target.value }))
            }
            disabled={loading}
          />

          {/* Role Dropdown */}
          <label className="block text-sm font-medium mb-1">Role</label>
          <select
            className="select select-bordered w-full"
            value={form.EmployeeRoleID}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                EmployeeRoleID: e.target.value,
              }))
            }
            disabled={loading}
          >
            <option value="">Select role</option>
            {roleOptions.map((role) => (
              <option key={role.id} value={role.id.toString()}>
                {role.name}
              </option>
            ))}
          </select>

          {/* Status */}
          <label className="block text-sm font-medium mb-1">Status</label>
          <div>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="status"
                checked={form.is_active === true}
                onChange={() => setForm((f) => ({ ...f, is_active: true }))}
                disabled={loading}
              />
              <span className="text-success">Active</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="status"
                checked={form.is_active === false}
                onChange={() => setForm((f) => ({ ...f, is_active: false }))}
                disabled={loading}
              />
              <span className="text-error">Inactive</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="modal-action">
          <button
            className="btn btn-ghost"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={() => onConfirm(form)}
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
      </div>
    </div>
  );
};
