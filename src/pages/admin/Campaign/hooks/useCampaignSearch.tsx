import { useState, useMemo } from 'react';
import type { Campaign } from '../types/CampaignTypes';

interface UseCampaignSearchReturn {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredCampaigns: Campaign[];
  clearSearch: () => void;
}

export const useCampaignSearch = (
  campaigns: Campaign[],
): UseCampaignSearchReturn => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredCampaigns = useMemo(() => {
    if (!searchTerm.trim()) {
      return campaigns;
    }

    const searchLower = searchTerm.toLowerCase();

    return campaigns.filter(
      (campaign) =>
        campaign.CampaignName.toLowerCase().includes(searchLower) ||
        campaign.CampaignId.toString().includes(searchLower) ||
        campaign.Employees.some(
          (employee) =>
            employee.EmployeeName.toLowerCase().includes(searchLower) ||
            employee.EmployeePhone.includes(searchTerm) ||
            employee.EmployeeId.toString().includes(searchTerm) ||
            (employee.EmployeeRegion &&
              employee.EmployeeRegion.toLowerCase().includes(searchLower)),
        ),
    );
  }, [campaigns, searchTerm]);

  const clearSearch = () => setSearchTerm('');

  return {
    searchTerm,
    setSearchTerm,
    filteredCampaigns,
    clearSearch,
  };
};
