import React from 'react';

interface ConfirmDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  employeeName?: string;
  loading?: boolean;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  open,
  onClose,
  onConfirm,
  employeeName,
  loading = false,
}) => {
  if (!open) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-sm">
        <h3 className="font-bold text-lg mb-4">Remove Employee</h3>
        <p>
          Are you sure you want to remove{' '}
          <span className="font-semibold">
            {employeeName || 'this employee'}
          </span>{' '}
          from the campaign?
        </p>
        <div className="modal-action">
          <button
            className="btn btn-ghost"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="btn btn-error"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Removing...
              </>
            ) : (
              'Remove'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
