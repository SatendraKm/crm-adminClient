export interface Employee {
  EmployeeId: number;
  EmployeeName: string;
  EmployeePhone: string;
  EmployeeRegion: string | null;
}

export interface Campaign {
  CampaignId: number;
  CampaignName: string;
  Employees: Employee[];
}

export interface ApiResponse {
  success: boolean;
  data: Campaign[];
}
