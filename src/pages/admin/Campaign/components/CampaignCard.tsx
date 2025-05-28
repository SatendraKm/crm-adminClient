import React from 'react';
import type { Campaign } from '../types/CampaignTypes';
import EmployeeTable from './EmployeeTable';

interface CampaignCardProps {
  campaign: Campaign;
  isExpanded: boolean;
  onToggle: () => void;
}

const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign,
  isExpanded,
  onToggle,
}) => {
  return (
    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-200">
      <div className="card-body">
        {/* Campaign Header */}
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={onToggle}
        >
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="card-title text-xl">{campaign.CampaignName}</h2>
              <div className="badge badge-primary badge-sm">
                ID: {campaign.CampaignId}
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-base-content/70">
              <span className="flex items-center gap-1">
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {campaign.Employees.length} employee
                {campaign.Employees.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`badge ${
                campaign.Employees.length > 3
                  ? 'badge-success'
                  : 'badge-warning'
              }`}
            >
              {campaign.Employees.length > 3 ? 'Well Staffed' : 'Low Staff'}
            </div>
            <button className="btn btn-ghost btn-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 transition-transform duration-200 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-6 border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Team Members</h3>
              <div className="text-sm text-base-content/70">
                Total: {campaign.Employees.length}
              </div>
            </div>
            <EmployeeTable employees={campaign.Employees} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignCard;
