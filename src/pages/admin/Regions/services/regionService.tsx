import axiosInstance from '../../../../lib/axios';
import type { RegionApiResponse } from '../types/RegionTypes';

export const regionService = {
  async getRegions(): Promise<RegionApiResponse> {
    try {
      const response = await axiosInstance.get<RegionApiResponse>(
        `/api/admin/regions`,
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching regions:', error);
      throw error;
    }
  },
};
