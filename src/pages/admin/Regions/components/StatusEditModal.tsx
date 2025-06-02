import React from 'react';
import type { Region } from '../types/RegionTypes';

interface StatusEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Region | null;
  onConfirm: (
    employeeId: string,
    newStatus: 'Active' | 'Inactive',
  ) => Promise<void>;
  loading: boolean;
}

const StatusEditModal: React.FC<StatusEditModalProps> = ({
  isOpen,
  onClose,
  employee,
  onConfirm,
  loading,
}) => {
  const [selectedStatus, setSelectedStatus] = React.useState<
    'Active' | 'Inactive'
  >('Active');

  React.useEffect(() => {
    if (employee?.is_active) {
      setSelectedStatus(employee.is_active as 'Active' | 'Inactive');
    }
  }, [employee, isOpen]);

  if (!isOpen || !employee) return null;

  const currentStatus = employee.is_active as 'Active' | 'Inactive';

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-sm">
        <h3 className="font-bold text-lg mb-4">
          Change Status for {employee.EmployeeName} for Region-{' '}
          {employee.RegionName}
        </h3>

        <div className="mb-4">
          <div>
            Current status:{' '}
            <span
              className={`font-semibold ${
                currentStatus === 'Active' ? 'text-success' : 'text-error'
              }`}
            >
              {currentStatus}
            </span>
          </div>
          <div className="mt-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="status"
                checked={selectedStatus === 'Active'}
                onChange={() => setSelectedStatus('Active')}
                disabled={loading}
              />
              <span className="text-success">Active</span>
            </label>
            <label className="flex items-center gap-2 mt-1">
              <input
                type="radio"
                name="status"
                checked={selectedStatus === 'Inactive'}
                onChange={() => setSelectedStatus('Inactive')}
                disabled={loading}
              />
              <span className="text-error">Inactive</span>
            </label>
          </div>
        </div>

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
            onClick={() => onConfirm(employee.EmployeeId, selectedStatus)}
            disabled={loading || selectedStatus === currentStatus}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Updating...
              </>
            ) : (
              'Confirm'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusEditModal;
