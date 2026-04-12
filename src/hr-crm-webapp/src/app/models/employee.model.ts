/**
 * Employee Model
 * Represents the structure of an employee entity
 * Can be used with both mock data and database
 */
export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  employmentType: 'Full-Time' | 'Part-Time' | 'Contract';
  status: 'Active' | 'Inactive' | 'On Leave';
  joinDate: Date;
  salary?: number;
  manager?: string;
  profileImage?: string;
}

export interface EmployeeListResponse {
  data: Employee[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface EmployeeFilter {
  searchTerm?: string;
  department?: string;
  status?: string;
  employmentType?: string;
}
