import React from 'react';

interface StatusEditModalProps {
  open: boolean;
  onClose: () => void;
  employeeName: string;
  currentStatus: boolean | null;
  onConfirm: (newStatus: boolean) => void;
  loading: boolean;
}

export const StatusEditModal: React.FC<StatusEditModalProps> = ({
  open,
  onClose,
  employeeName,
  currentStatus,
  onConfirm,
  loading,
}) => {
  const [newStatus, setNewStatus] = React.useState(currentStatus ?? false);

  React.useEffect(() => {
    setNewStatus(currentStatus ?? false);
  }, [currentStatus, open]);

  if (!open) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-sm">
        <h3 className="font-bold text-lg mb-4">
          Change Status for {employeeName}
        </h3>
        <div className="mb-4">
          <div>
            Current status:{' '}
            <span
              className={`font-semibold ${
                currentStatus ? 'text-success' : 'text-error'
              }`}
            >
              {currentStatus ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div className="mt-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="status"
                checked={newStatus === true}
                onChange={() => setNewStatus(true)}
                disabled={loading}
              />
              <span className="text-success">Active</span>
            </label>
            <label className="flex items-center gap-2 mt-1">
              <input
                type="radio"
                name="status"
                checked={newStatus === false}
                onChange={() => setNewStatus(false)}
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
            onClick={() => onConfirm(newStatus)}
            disabled={loading || newStatus === currentStatus}
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
