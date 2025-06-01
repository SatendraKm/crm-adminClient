// pages/admin/Campaign/Campaigns.tsx
import React from 'react';
import { useState, useEffect } from 'react';
import axiosInstance from '../../../lib/axios';
import { useCampaigns, useCampaignSearch, useCampaignExpansion } from './hooks';
import CampaignCard from './components/CampaignCard';
import { RefreshCcw, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Campaigns: React.FC = () => {
  // Custom hooks for data management
  const { campaigns, loading, error, refetch } = useCampaigns();
  const { searchTerm, setSearchTerm, filteredCampaigns, clearSearch } =
    useCampaignSearch(campaigns);
  const { toggleCampaign, isExpanded, collapseAll } = useCampaignExpansion(
    campaigns.map((c) => c.CampaignId),
  );

  const [isNewCampaignOpen, setIsNewCampaignOpen] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [creatingCampaign, setCreatingCampaign] = useState(false);
  const [newCampaignError, setNewCampaignError] = useState('');

  // --- Assign Employee Modal State ---
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignEmployeeId, setAssignEmployeeId] = useState('');
  const [assignCampaignId, setAssignCampaignId] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState('');
  const [assignSuccess, setAssignSuccess] = useState('');

  // --- Dropdown data for Assign Modal ---
  const [employeeOptions, setEmployeeOptions] = useState<
    { EmployeeId: number; EmployeeName: string; EmployeeRoleID: number }[]
  >([]);
  const [campaignOptions, setCampaignOptions] = useState<
    { CampaignId: number; CampaignName: string }[]
  >([]);
  const [dropdownLoading, setDropdownLoading] = useState(false);
  const [dropdownError, setDropdownError] = useState('');

  // Fetch dropdown data when assign modal opens
  useEffect(() => {
    if (isAssignModalOpen) {
      setDropdownLoading(true);
      setDropdownError('');
      Promise.all([
        axiosInstance.get('/api/admin/employees/list'),
        axiosInstance.get('/api/admin/campaigns/list'),
      ])
        .then(([empRes, campRes]) => {
          if (empRes.data.success && campRes.data.success) {
            setEmployeeOptions(
              (empRes.data.data || []).filter(
                (emp: any) =>
                  emp.EmployeeRoleID === 1 || emp.EmployeeRoleID === 2,
              ),
            );
            setCampaignOptions(campRes.data.data);
          } else {
            setDropdownError('Failed to load dropdown data');
          }
        })
        .catch(() => setDropdownError('Failed to load dropdown data'))
        .finally(() => setDropdownLoading(false));
    }
  }, [isAssignModalOpen]);

  const handleOpenNewCampaign = () => {
    setIsNewCampaignOpen(true);
    setNewCampaignName('');
    setNewCampaignError('');
  };
  const handleCloseNewCampaign = () => setIsNewCampaignOpen(false);

  const handleCreateCampaign = async () => {
    if (!newCampaignName.trim()) {
      setNewCampaignError('Campaign name is required');
      return;
    }
    setCreatingCampaign(true);
    setNewCampaignError('');
    try {
      const res = await axiosInstance.post('/api/admin/campaigns', {
        CampaignName: newCampaignName.trim(),
      });
      if (res.data.success) {
        setIsNewCampaignOpen(false);
        setNewCampaignName('');
        await refetch();
      } else {
        setNewCampaignError(res.data.message || 'Failed to create campaign');
      }
    } catch (err: any) {
      setNewCampaignError(
        err.response?.data?.message ||
          err.message ||
          'Failed to create campaign',
      );
    } finally {
      setCreatingCampaign(false);
    }
  };

  // --- Handlers for Assign Employee ---
  const handleOpenAssignModal = () => {
    setIsAssignModalOpen(true);
    setAssignEmployeeId('');
    setAssignCampaignId('');
    setAssignError('');
    setAssignSuccess('');
  };
  const handleCloseAssignModal = () => setIsAssignModalOpen(false);

  const handleAssignEmployee = async () => {
    if (!assignEmployeeId || !assignCampaignId) {
      setAssignError('Both Employee ID and Campaign ID are required');
      return;
    }
    setAssigning(true);
    setAssignError('');
    setAssignSuccess('');
    try {
      const res = await axiosInstance.post(
        '/api/admin/campaigns/employee-campaign',
        {
          EmployeeId: Number(assignEmployeeId),
          CampaignId: Number(assignCampaignId),
        },
      );
      if (res.data.success) {
        setAssignSuccess(res.data.message || 'Employee assigned successfully');
        await refetch();
        setIsAssignModalOpen(false);
        toast.success(res.data.message || 'Employee assigned successfully');
      } else {
        setAssignError(res.data.message || 'Failed to assign employee');
      }
    } catch (err: any) {
      setAssignError(
        err.response?.data?.message ||
          err.message ||
          'Failed to assign employee',
      );
    } finally {
      setAssigning(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 p-6">
        <div className="container mx-auto">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <span className="loading loading-spinner loading-lg"></span>
              <p className="mt-4 text-lg">Loading campaigns...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-base-content">
              Campaign Management
            </h1>
            <p className="text-base-content/70 mt-2">
              Manage your campaigns and team assignments
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className="btn btn-outline btn-sm"
              onClick={collapseAll}
              disabled={loading}
            >
              Collapse All
            </button>
            <button
              className="btn btn-primary btn-sm gap-2"
              onClick={refetch}
              disabled={loading}
            >
              <RefreshCcw />
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            {/* --- New Buttons --- */}
            <button
              className="btn btn-success btn-sm"
              onClick={handleOpenNewCampaign}
            >
              + Add Campaign
            </button>
            <button
              className="btn btn-info btn-sm"
              onClick={handleOpenAssignModal}
            >
              + Assign Employee
            </button>
          </div>
        </div>
      </div>

      {isNewCampaignOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Add New Campaign</h3>
              <button
                className="btn btn-sm btn-circle btn-ghost"
                onClick={handleCloseNewCampaign}
                disabled={creatingCampaign}
              >
                ✕
              </button>
            </div>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Campaign Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={newCampaignName}
                onChange={(e) => setNewCampaignName(e.target.value)}
                disabled={creatingCampaign}
                placeholder="Enter campaign name"
              />
            </div>
            {newCampaignError && (
              <div className="alert alert-error mb-2 py-2">
                {newCampaignError}
              </div>
            )}
            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={handleCloseNewCampaign}
                disabled={creatingCampaign}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleCreateCampaign}
                disabled={creatingCampaign}
              >
                {creatingCampaign ? (
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
      )}

      {/* --- Assign Employee Modal --- */}
      {isAssignModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Assign Employee to Campaign</h3>
              <button
                className="btn btn-sm btn-circle btn-ghost"
                onClick={handleCloseAssignModal}
                disabled={assigning}
              >
                ✕
              </button>
            </div>
            {dropdownLoading ? (
              <div className="flex items-center gap-2 mb-4">
                <span className="loading loading-spinner loading-sm"></span>
                Loading options...
              </div>
            ) : dropdownError ? (
              <div className="alert alert-error mb-2 py-2">{dropdownError}</div>
            ) : (
              <>
                <div className="form-control mb-2">
                  <label className="label">
                    <span className="label-text">Employee</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={assignEmployeeId}
                    onChange={(e) => setAssignEmployeeId(e.target.value)}
                    disabled={assigning}
                  >
                    <option value="">Select Employee</option>
                    {employeeOptions.map((emp) => (
                      <option key={emp.EmployeeId} value={emp.EmployeeId}>
                        {emp.EmployeeName}{' '}
                        {emp.EmployeeRoleID === 1 ? '(Agent)' : '(BDM)'}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-control mb-2">
                  <label className="label">
                    <span className="label-text">Campaign</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={assignCampaignId}
                    onChange={(e) => setAssignCampaignId(e.target.value)}
                    disabled={assigning}
                  >
                    <option value="">Select Campaign</option>
                    {campaignOptions.map((camp) => (
                      <option key={camp.CampaignId} value={camp.CampaignId}>
                        {camp.CampaignName}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
            {assignError && (
              <div className="alert alert-error mb-2 py-2">{assignError}</div>
            )}
            {assignSuccess && (
              <div className="alert alert-success mb-2 py-2">
                {assignSuccess}
              </div>
            )}
            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={handleCloseAssignModal}
                disabled={assigning}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleAssignEmployee}
                disabled={
                  assigning ||
                  dropdownLoading ||
                  !assignEmployeeId ||
                  !assignCampaignId
                }
              >
                {assigning ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Assigning...
                  </>
                ) : (
                  'Assign'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-base-100 rounded-2xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Search Input */}
          <div className="form-control w-full sm:flex-1">
            <label className="input input-bordered flex items-center gap-2">
              <Search className="w-5 h-5 text-base-content/60" />
              <input
                type="text"
                placeholder="Search campaigns or employees"
                className="grow"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="btn btn-sm btn-circle btn-ghost"
                  onClick={clearSearch}
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </label>
          </div>

          {/* Result Count */}
          {searchTerm && (
            <div className="text-sm text-base-content/70 sm:text-right w-full sm:w-auto">
              Showing {filteredCampaigns.length} of {campaigns.length} campaigns
            </div>
          )}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="alert alert-error mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Error: {error}</span>
          <div>
            <button className="btn btn-sm btn-outline" onClick={refetch}>
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Campaigns Grid */}
      {filteredCampaigns.length > 0 ? (
        <div className="grid gap-6">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard
              key={campaign.CampaignId}
              campaign={campaign}
              isExpanded={isExpanded(campaign.CampaignId)}
              onToggle={() => toggleCampaign(campaign.CampaignId)}
              refetch={refetch} // <-- pass refetch here
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">{searchTerm ? '🔍' : '📋'}</div>
          <h3 className="text-xl font-semibold mb-2">
            {searchTerm
              ? 'No matching campaigns found'
              : 'No campaigns available'}
          </h3>
          <p className="text-base-content/70 max-w-md mx-auto">
            {searchTerm
              ? 'Try adjusting your search terms or clear the search to see all campaigns.'
              : 'Get started by creating your first campaign or check your API connection.'}
          </p>
          {searchTerm && (
            <button className="btn btn-ghost mt-4" onClick={clearSearch}>
              Clear Search
            </button>
          )}
        </div>
      )}

      {/* Footer Info */}
      {campaigns.length > 0 && (
        <div className="mt-8 text-center text-sm text-base-content/50">
          Showing {filteredCampaigns.length} of {campaigns.length} campaigns
        </div>
      )}
    </div>
  );
};

export default Campaigns;
