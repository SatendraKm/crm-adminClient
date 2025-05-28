export interface Role {
  RoleName: string;
}

export interface Employee {
  EmployeeId: number;
  EmployeePhone: string;
  EmployeeName: string;
  EmployeeMailId: string | null;
  is_active: boolean | null;
  role: Role;
  RegionName: string | null;
}

export interface FilterOptions {
  roles: string[];
  regions: string[];
}

export interface EmployeeFilters {
  search: string;
  filterActive: 'All' | 'Active' | 'Inactive';
  filterRole: string;
  filterRegion: string;
  page: number;
}

// Updated to match actual API response structure
export interface EmployeeResponse {
  success: boolean;
  message: string;
  data: Employee[]; // Direct array of employees
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
