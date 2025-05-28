import { useMemo } from 'react';
import type { Campaign } from '../types/CampaignTypes';

interface CampaignStatsData {
  totalCampaigns: number;
  totalEmployees: number;
  activeCampaigns: number;
  averageEmployeesPerCampaign: number;
  campaignsWithNoEmployees: number;
  largestCampaign: {
    name: string;
    employeeCount: number;
  } | null;
}

export const useCampaignStats = (campaigns: Campaign[]): CampaignStatsData => {
  const stats = useMemo(() => {
    const totalCampaigns = campaigns.length;
    const totalEmployees = campaigns.reduce(
      (sum, campaign) => sum + campaign.Employees.length,
      0,
    );
    const activeCampaigns = campaigns.filter(
      (campaign) => campaign.Employees.length > 0,
    ).length;
    const averageEmployeesPerCampaign =
      totalCampaigns > 0 ? Math.round(totalEmployees / totalCampaigns) : 0;
    const campaignsWithNoEmployees = campaigns.filter(
      (campaign) => campaign.Employees.length === 0,
    ).length;

    const largestCampaign = campaigns.reduce((largest, current) => {
      if (!largest || current.Employees.length > largest.employeeCount) {
        return {
          name: current.CampaignName,
          employeeCount: current.Employees.length,
        };
      }
      return largest;
    }, null as { name: string; employeeCount: number } | null);

    return {
      totalCampaigns,
      totalEmployees,
      activeCampaigns,
      averageEmployeesPerCampaign,
      campaignsWithNoEmployees,
      largestCampaign,
    };
  }, [campaigns]);

  return stats;
};
