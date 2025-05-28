// pages/admin/Campaign/Campaigns.tsx
import React from 'react';
import {
  useCampaigns,
  useCampaignSearch,
  useCampaignExpansion,
  useCampaignStats,
} from './hooks';
import CampaignCard from './components/CampaignCard';
import CampaignStats from './components/CampaignStats';

const Campaigns: React.FC = () => {
  // Custom hooks for data management
  const { campaigns, loading, error, refetch } = useCampaigns();
  const { searchTerm, setSearchTerm, filteredCampaigns, clearSearch } =
    useCampaignSearch(campaigns);
  const { toggleCampaign, isExpanded, collapseAll } = useCampaignExpansion(
    campaigns.map((c) => c.CampaignId),
  );
  const stats = useCampaignStats(campaigns);

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
    <div className="min-h-screen bg-base-200 p-6">
      <div className="container mx-auto max-w-7xl">
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
              {stats.largestCampaign && (
                <p className="text-sm text-base-content/60 mt-1">
                  Largest campaign:{' '}
                  <span className="font-medium">
                    {stats.largestCampaign.name}
                  </span>
                  ({stats.largestCampaign.employeeCount} employees)
                </p>
              )}
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
                className="btn btn-primary gap-2"
                onClick={refetch}
                disabled={loading}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <CampaignStats
          totalCampaigns={stats.totalCampaigns}
          totalEmployees={stats.totalEmployees}
          activeCampaigns={stats.activeCampaigns}
          averageEmployees={stats.averageEmployeesPerCampaign}
          emptyCampaigns={stats.campaignsWithNoEmployees}
        />

        {/* Search and Filters */}
        <div className="bg-base-100 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="form-control flex-1">
              <div className="input-group">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search campaigns, employees, phone numbers..."
                  className="input input-bordered flex-1"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="btn btn-square btn-outline"
                    onClick={clearSearch}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {searchTerm && (
              <div className="text-sm text-base-content/70">
                Found {filteredCampaigns.length} of {campaigns.length} campaigns
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
    </div>
  );
};

export default Campaigns;
