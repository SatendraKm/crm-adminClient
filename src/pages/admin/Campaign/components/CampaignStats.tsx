import React from 'react';

interface CampaignStatsProps {
  totalCampaigns: number;
  totalEmployees: number;
  activeCampaigns: number;
  averageEmployees?: number;
  emptyCampaigns?: number;
}

const CampaignStats: React.FC<CampaignStatsProps> = ({
  totalCampaigns,
  totalEmployees,
  activeCampaigns,
  averageEmployees = 0,
  emptyCampaigns = 0,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total Campaigns */}
      <div className="stat bg-base-100 rounded-lg shadow-sm">
        <div className="stat-figure text-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <div className="stat-title">Total Campaigns</div>
        <div className="stat-value text-primary">{totalCampaigns}</div>
        <div className="stat-desc">
          {emptyCampaigns > 0 && (
            <span className="text-warning">{emptyCampaigns} empty</span>
          )}
        </div>
      </div>

      {/* Total Employees */}
      <div className="stat bg-base-100 rounded-lg shadow-sm">
        <div className="stat-figure text-secondary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <div className="stat-title">Total Employees</div>
        <div className="stat-value text-secondary">{totalEmployees}</div>
        <div className="stat-desc">Avg: {averageEmployees} per campaign</div>
      </div>

      {/* Active Campaigns */}
      <div className="stat bg-base-100 rounded-lg shadow-sm">
        <div className="stat-figure text-accent">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <div className="stat-title">Active Campaigns</div>
        <div className="stat-value text-accent">{activeCampaigns}</div>
        <div className="stat-desc">
          {totalCampaigns > 0 && (
            <span>
              {Math.round((activeCampaigns / totalCampaigns) * 100)}% of total
            </span>
          )}
        </div>
      </div>

      {/* Utilization Rate */}
      <div className="stat bg-base-100 rounded-lg shadow-sm">
        <div className="stat-figure text-info">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="stat-title">Utilization</div>
        <div className="stat-value text-info">
          {totalCampaigns > 0
            ? Math.round((activeCampaigns / totalCampaigns) * 100)
            : 0}
          %
        </div>
        <div className="stat-desc">
          {activeCampaigns}/{totalCampaigns} campaigns staffed
        </div>
      </div>
    </div>
  );
};

export default CampaignStats;
