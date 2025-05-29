// components/StatusEditModal.tsx
import React, { useState } from 'react';
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
  const [selectedStatus, setSelectedStatus] = useState<'Active' | 'Inactive'>(
    'Active',
  );

  // Update selected status when employee changes
  React.useEffect(() => {
    if (employee) {
      setSelectedStatus(employee.is_active as 'Active' | 'Inactive');
    }
  }, [employee]);

  const handleConfirm = async () => {
    if (employee) {
      await onConfirm(employee.EmployeeId, selectedStatus);
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'text-success' : 'text-error';
  };

  const getNewStatusColor = (status: string) => {
    return status === 'Active' ? 'text-success' : 'text-error';
  };

  if (!employee) return null;

  const isStatusChanged = selectedStatus !== employee.is_active;

  return (
    <>
      {/* Modal backdrop */}
      {isOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-md">
            {/* Modal header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Update Employee Status</h3>
              <button
                className="btn btn-sm btn-circle btn-ghost"
                onClick={onClose}
                disabled={loading}
              >
                ✕
              </button>
            </div>

            {/* Employee info */}
            <div className="bg-base-200 p-4 rounded-lg mb-6">
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-600">Employee ID:</span>
                  <span className="ml-2 font-mono text-sm">
                    {employee.EmployeeId}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Name:</span>
                  <span className="ml-2 font-medium">
                    {employee.EmployeeName}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Role:</span>
                  <span className="ml-2">
                    <span className="badge badge-secondary badge-sm">
                      {employee.role}
                    </span>
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Project:</span>
                  <span className="ml-2">
                    <span className="badge badge-primary badge-sm">
                      {employee.Project}
                    </span>
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Current Status:</span>
                  <span
                    className={`ml-2 font-semibold ${getStatusColor(
                      employee.is_active,
                    )}`}
                  >
                    {employee.is_active}
                  </span>
                </div>
              </div>
            </div>

            {/* Status selection */}
            <div className="mb-6">
              <label className="label">
                <span className="label-text font-medium">
                  Select New Status:
                </span>
              </label>
              <div className="flex gap-4">
                <label className="cursor-pointer flex items-center gap-2">
                  <input
                    type="radio"
                    name="status"
                    className="radio radio-success"
                    value="Active"
                    checked={selectedStatus === 'Active'}
                    onChange={(e) =>
                      setSelectedStatus(e.target.value as 'Active' | 'Inactive')
                    }
                    disabled={loading}
                  />
                  <span className="text-success font-medium">Active</span>
                </label>
                <label className="cursor-pointer flex items-center gap-2">
                  <input
                    type="radio"
                    name="status"
                    className="radio radio-error"
                    value="Inactive"
                    checked={selectedStatus === 'Inactive'}
                    onChange={(e) =>
                      setSelectedStatus(e.target.value as 'Active' | 'Inactive')
                    }
                    disabled={loading}
                  />
                  <span className="text-error font-medium">Inactive</span>
                </label>
              </div>
            </div>

            {/* Change preview */}
            {isStatusChanged && (
              <div className="alert alert-info mb-6">
                <svg
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <div className="text-sm">
                    Status will change from{' '}
                    <span
                      className={`font-semibold ${getStatusColor(
                        employee.is_active,
                      )}`}
                    >
                      {employee.is_active}
                    </span>{' '}
                    to{' '}
                    <span
                      className={`font-semibold ${getNewStatusColor(
                        selectedStatus,
                      )}`}
                    >
                      {selectedStatus}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Warning for deactivation */}
            {selectedStatus === 'Inactive' &&
              employee.is_active === 'Active' && (
                <div className="alert alert-warning mb-6">
                  <svg
                    className="stroke-current shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  <div>
                    <div className="font-medium">Warning</div>
                    <div className="text-sm">
                      Deactivating this employee will restrict their access and
                      assignments.
                    </div>
                  </div>
                </div>
              )}

            {/* Modal actions */}
            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className={`btn ${
                  isStatusChanged ? 'btn-primary' : 'btn-disabled'
                }`}
                onClick={handleConfirm}
                disabled={loading || !isStatusChanged}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Updating...
                  </>
                ) : (
                  'Confirm Update'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StatusEditModal;
