// pages/admin/Campaign/hooks/useCampaigns.ts
import { useState, useEffect, useCallback } from 'react';
import type { Campaign, ApiResponse } from '../types/CampaignTypes';
import axiosInstance from '../../../../lib/axios';

interface UseCampaignsReturn {
  campaigns: Campaign[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  totalEmployees: number;
}

export const useCampaigns = (): UseCampaignsReturn => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get<ApiResponse>(
        '/api/admin/campaigns',
      );

      if (response.data.success) {
        setCampaigns(response.data.data);
      } else {
        throw new Error('API returned success: false');
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Failed to fetch campaigns';
      setError(errorMessage);
      console.error('Campaign fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const totalEmployees = campaigns.reduce(
    (sum, campaign) => sum + campaign.Employees.length,
    0,
  );

  return {
    campaigns,
    loading,
    error,
    refetch: fetchCampaigns,
    totalEmployees,
  };
};
