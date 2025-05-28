export interface Region {
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
}
