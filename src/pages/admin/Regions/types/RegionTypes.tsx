export interface Region {
  id: string;
  EmployeeId: string;
  EmployeeName: string;
  Project: string;
  role: string;
  RegionId: string;
  RegionName: string;
  is_active: string;
}

export interface RegionApiResponse {
  success: boolean;
  data: Region[];
  total?: number;
  currentPage?: number;
  totalPages?: number;
}
