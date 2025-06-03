import React, { useState } from 'react';
import axiosInstance from '../../../../lib/axios';
import toast from 'react-hot-toast';
import type { Assignment } from '../hooks/useGroupedRegionData';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  employeeId: string;
  assignments: Assignment[];
  refetch: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const RegionAssignmentTableRow: React.FC<Props> = ({
  employeeId,
  assignments,
  refetch,
  isExpanded,
  onToggleExpand,
}) => {
  // Modal state for status toggle
  const [statusModal, setStatusModal] = useState<{
    open: boolean;
    regionId: string;
    currentStatus: string;
  }>({ open: false, regionId: '', currentStatus: '' });

  // Modal state for delete
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    assignmentId: number | null;
    regionName: string;
  }>({ open: false, assignmentId: null, regionName: '' });

  const [loading, setLoading] = useState(false);

  const handleToggleStatus = (regionId: string, currentStatus: string) => {
    setStatusModal({ open: true, regionId, currentStatus });
  };

  const confirmToggleStatus = async () => {
    setLoading(true);
    try {
      const payload = {
        RegionId: statusModal.regionId,
        is_active:
          statusModal.currentStatus === 'Active' ? 'Inactive' : 'Active',
      };
      const res = await axiosInstance.put(
        `/api/admin/regions/${employeeId}/status`,
        payload,
      );
      if (res.data.success) {
        toast.success('Status updated');
        refetch();
      } else {
        toast.error(res.data.message || 'Failed to update status');
      }
    } catch {
      toast.error('Failed to update status');
    } finally {
      setLoading(false);
      setStatusModal({ open: false, regionId: '', currentStatus: '' });
    }
  };

  const handleDeleteAssignment = (id: number, regionName: string) => {
    setDeleteModal({ open: true, assignmentId: id, regionName });
  };

  const confirmDeleteAssignment = async () => {
    if (!deleteModal.assignmentId) return;
    setLoading(true);
    try {
      const res = await axiosInstance.delete(
        `/api/admin/parivartan-bdm/${deleteModal.assignmentId}`,
      );
      if (res.data.success) {
        toast.success('Assignment deleted');
        refetch();
      } else {
        toast.error(res.data.message || 'Failed to delete assignment');
      }
    } catch {
      toast.error('Failed to delete assignment');
    } finally {
      setLoading(false);
      setDeleteModal({ open: false, assignmentId: null, regionName: '' });
    }
  };

  return (
    <>
      <tr className="hover cursor-pointer" onClick={onToggleExpand}>
        <td colSpan={6} className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold text-base">
                {assignments[0]?.EmployeeName}
              </div>
              <div className="text-sm text-gray-500">
                ID: {assignments[0]?.EmployeeId}
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500 select-none">
              <span>Total Regions: {assignments.length}</span>
              {isExpanded ? (
                <ChevronUp size={16} className="transition-transform" />
              ) : (
                <ChevronDown size={16} className="transition-transform" />
              )}
            </div>
          </div>
        </td>
      </tr>

      {isExpanded && (
        <tr>
          <td colSpan={6} className="p-0">
            <div className="bg-base-200 rounded-b-lg p-4 border-t border-base-300 shadow-sm animate-fade-in mb-4">
              <table className="table w-full text-sm">
                <thead>
                  <tr>
                    <th>Region</th>
                    <th>Project</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((a) => (
                    <tr key={a.id}>
                      <td>{a.RegionName}</td>
                      <td>{a.Project}</td>
                      <td>{a.role}</td>
                      <td>
                        <span
                          className={`badge ${
                            a.is_active === 'Active'
                              ? 'badge-success'
                              : 'badge-ghost'
                          }`}
                        >
                          {a.is_active}
                        </span>
                      </td>
                      <td className="text-right space-x-2">
                        <button
                          className="btn btn-xs btn-outline btn-info"
                          onClick={() =>
                            handleToggleStatus(a.RegionId, a.is_active)
                          }
                        >
                          {a.is_active === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          className="btn btn-xs btn-outline btn-error"
                          onClick={() =>
                            handleDeleteAssignment(a.id, a.RegionName)
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      )}
      {/* Toggle Status Modal */}
      {statusModal.open && (
        <div className="modal modal-open">
          <div className="modal-box max-w-sm">
            <h3 className="font-bold text-lg mb-4">
              {statusModal.currentStatus === 'Active'
                ? 'Deactivate'
                : 'Activate'}{' '}
              Region Assignment
            </h3>
            <p>
              Are you sure you want to{' '}
              <span className="font-semibold">
                {statusModal.currentStatus === 'Active'
                  ? 'deactivate'
                  : 'activate'}
              </span>{' '}
              this region assignment?
            </p>
            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() =>
                  setStatusModal({
                    open: false,
                    regionId: '',
                    currentStatus: '',
                  })
                }
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className={`btn ${
                  statusModal.currentStatus === 'Active'
                    ? 'btn-error'
                    : 'btn-success'
                }`}
                onClick={confirmToggleStatus}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Saving...
                  </>
                ) : statusModal.currentStatus === 'Active' ? (
                  'Deactivate'
                ) : (
                  'Activate'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Assignment Modal */}
      {deleteModal.open && (
        <div className="modal modal-open">
          <div className="modal-box max-w-sm">
            <h3 className="font-bold text-lg mb-4">Delete Region Assignment</h3>
            <p>
              Are you sure you want to delete the assignment for region{' '}
              <span className="font-semibold">{deleteModal.regionName}</span>?
            </p>
            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() =>
                  setDeleteModal({
                    open: false,
                    assignmentId: null,
                    regionName: '',
                  })
                }
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="btn btn-error"
                onClick={confirmDeleteAssignment}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RegionAssignmentTableRow;
