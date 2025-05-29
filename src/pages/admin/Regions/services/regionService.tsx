// services/regionService.ts
import axiosInstance from '../../../../lib/axios';
import type { RegionApiResponse } from '../types/RegionTypes';

export interface RegionQueryParams {
  page?: number;
  limit?: number;
  EmployeeName?: string;
  role?: string;
  Project?: string;
  is_active?: string;
}

export interface UpdateStatusResponse {
  success: boolean;
  message: string;
  data?: Region;
}

export const regionService = {
  async getRegions(params?: RegionQueryParams): Promise<RegionApiResponse> {
    try {
      // Build query string from parameters
      const queryParams = new URLSearchParams();

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, value.toString());
          }
        });
      }

      const queryString = queryParams.toString();
      const url = `/api/admin/regions${queryString ? `?${queryString}` : ''}`;

      const response = await axiosInstance.get<RegionApiResponse>(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching regions:', error);
      throw error;
    }
  },

  async updateEmployeeStatus(
    employeeId: string,
    status: 'Active' | 'Inactive',
  ): Promise<UpdateStatusResponse> {
    try {
      const response = await axiosInstance.put<UpdateStatusResponse>(
        `/api/admin/regions/${employeeId}/status`,
        { is_active: status },
      );
      return response.data;
    } catch (error) {
      console.error('Error updating employee status:', error);
      throw error;
    }
  },
};
