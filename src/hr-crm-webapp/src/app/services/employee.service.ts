import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Employee, EmployeeListResponse, EmployeeFilter } from '../models/employee.model';

/**
 * Employee Service
 * Handles employee data operations
 * Currently uses mock data, ready for database integration
 *
 * Future Integration Points:
 * - Replace mock data with HTTP calls to backend API
 * - Update method signatures to use HttpClient
 * - Add proper error handling and interceptors
 */
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  // Mock data - Replace with API calls in future
  private mockEmployees: Employee[] = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Anderson',
      email: 'john.anderson@company.com',
      phone: '+1 (555) 123-4567',
      department: 'Engineering',
      position: 'Senior Software Engineer',
      employmentType: 'Full-Time',
      status: 'Active',
      joinDate: new Date('2020-03-15'),
      salary: 95000,
      manager: 'Sarah Smith'
    },
    {
      id: '2',
      firstName: 'Sarah',
      lastName: 'Smith',
      email: 'sarah.smith@company.com',
      phone: '+1 (555) 234-5678',
      department: 'Engineering',
      position: 'Engineering Manager',
      employmentType: 'Full-Time',
      status: 'Active',
      joinDate: new Date('2019-06-20'),
      salary: 120000,
      manager: 'David Chen'
    },
    {
      id: '3',
      firstName: 'Emily',
      lastName: 'Johnson',
      email: 'emily.johnson@company.com',
      phone: '+1 (555) 345-6789',
      department: 'Human Resources',
      position: 'HR Specialist',
      employmentType: 'Full-Time',
      status: 'Active',
      joinDate: new Date('2021-01-10'),
      salary: 65000,
      manager: 'Michael Brown'
    },
    {
      id: '4',
      firstName: 'David',
      lastName: 'Chen',
      email: 'david.chen@company.com',
      phone: '+1 (555) 456-7890',
      department: 'Engineering',
      position: 'VP of Engineering',
      employmentType: 'Full-Time',
      status: 'Active',
      joinDate: new Date('2018-05-01'),
      salary: 180000,
      manager: undefined
    },
    {
      id: '5',
      firstName: 'Jessica',
      lastName: 'Martinez',
      email: 'jessica.martinez@company.com',
      phone: '+1 (555) 567-8901',
      department: 'Marketing',
      position: 'Marketing Manager',
      employmentType: 'Full-Time',
      status: 'Active',
      joinDate: new Date('2020-09-12'),
      salary: 75000,
      manager: 'Robert Wilson'
    },
    {
      id: '6',
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'michael.brown@company.com',
      phone: '+1 (555) 678-9012',
      department: 'Human Resources',
      position: 'HR Director',
      employmentType: 'Full-Time',
      status: 'Active',
      joinDate: new Date('2017-02-14'),
      salary: 130000,
      manager: undefined
    },
    {
      id: '7',
      firstName: 'Robert',
      lastName: 'Wilson',
      email: 'robert.wilson@company.com',
      phone: '+1 (555) 789-0123',
      department: 'Marketing',
      position: 'VP of Marketing',
      employmentType: 'Full-Time',
      status: 'Active',
      joinDate: new Date('2019-01-20'),
      salary: 150000,
      manager: undefined
    },
    {
      id: '8',
      firstName: 'Lisa',
      lastName: 'Garcia',
      email: 'lisa.garcia@company.com',
      phone: '+1 (555) 890-1234',
      department: 'Finance',
      position: 'Financial Analyst',
      employmentType: 'Full-Time',
      status: 'On Leave',
      joinDate: new Date('2021-07-18'),
      salary: 70000,
      manager: 'James Taylor'
    },
    {
      id: '9',
      firstName: 'James',
      lastName: 'Taylor',
      email: 'james.taylor@company.com',
      phone: '+1 (555) 901-2345',
      department: 'Finance',
      position: 'CFO',
      employmentType: 'Full-Time',
      status: 'Active',
      joinDate: new Date('2016-11-05'),
      salary: 200000,
      manager: undefined
    },
    {
      id: '10',
      firstName: 'Amanda',
      lastName: 'Davis',
      email: 'amanda.davis@company.com',
      phone: '+1 (555) 012-3456',
      department: 'Engineering',
      position: 'Junior Developer',
      employmentType: 'Full-Time',
      status: 'Active',
      joinDate: new Date('2022-06-01'),
      salary: 55000,
      manager: 'Sarah Smith'
    }
  ];

  constructor() { }

  /**
   * Get all employees with optional filtering
   * @param filter Optional filter parameters
   * @param pageNumber Page number for pagination (default: 1)
   * @param pageSize Page size for pagination (default: 10)
   * @returns Observable of employee list response
   *
   * TODO: Replace with HttpClient.get() API call when database is ready
   * Example: this.http.get<EmployeeListResponse>('/api/employees', { params })
   */
  getEmployees(
    filter?: EmployeeFilter,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Observable<EmployeeListResponse> {
    let filteredEmployees = [...this.mockEmployees];

    if (filter) {
      if (filter.searchTerm) {
        const term = filter.searchTerm.toLowerCase();
        filteredEmployees = filteredEmployees.filter(emp =>
          emp.firstName.toLowerCase().includes(term) ||
          emp.lastName.toLowerCase().includes(term) ||
          emp.email.toLowerCase().includes(term) ||
          emp.phone.includes(term)
        );
      }

      if (filter.department) {
        filteredEmployees = filteredEmployees.filter(emp => emp.department === filter.department);
      }

      if (filter.status) {
        filteredEmployees = filteredEmployees.filter(emp => emp.status === filter.status);
      }

      if (filter.employmentType) {
        filteredEmployees = filteredEmployees.filter(emp => emp.employmentType === filter.employmentType);
      }
    }

    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);

    const response: EmployeeListResponse = {
      data: paginatedEmployees,
      totalCount: filteredEmployees.length,
      pageNumber,
      pageSize
    };

    return of(response);
  }

  /**
   * Get employee by ID
   * @param id Employee ID
   * @returns Observable of employee
   *
   * TODO: Replace with HttpClient.get() API call when database is ready
   * Example: this.http.get<Employee>(`/api/employees/${id}`)
   */
  getEmployeeById(id: string): Observable<Employee | undefined> {
    const employee = this.mockEmployees.find(emp => emp.id === id);
    return of(employee);
  }

  /**
   * Create new employee
   * @param employee Employee data
   * @returns Observable of created employee
   *
   * TODO: Replace with HttpClient.post() API call when database is ready
   * Example: this.http.post<Employee>('/api/employees', employee)
   */
  createEmployee(employee: Omit<Employee, 'id'>): Observable<Employee> {
    const newEmployee: Employee = {
      ...employee,
      id: Math.random().toString(36).substr(2, 9)
    };
    this.mockEmployees.push(newEmployee);
    return of(newEmployee);
  }

  /**
   * Update existing employee
   * @param id Employee ID
   * @param employee Updated employee data
   * @returns Observable of updated employee
   *
   * TODO: Replace with HttpClient.put() API call when database is ready
   * Example: this.http.put<Employee>(`/api/employees/${id}`, employee)
   */
  updateEmployee(id: string, employee: Partial<Employee>): Observable<Employee | undefined> {
    const index = this.mockEmployees.findIndex(emp => emp.id === id);
    if (index !== -1) {
      this.mockEmployees[index] = { ...this.mockEmployees[index], ...employee };
      return of(this.mockEmployees[index]);
    }
    return of(undefined);
  }

  /**
   * Delete employee
   * @param id Employee ID
   * @returns Observable of boolean indicating success
   *
   * TODO: Replace with HttpClient.delete() API call when database is ready
   * Example: this.http.delete(`/api/employees/${id}`)
   */
  deleteEmployee(id: string): Observable<boolean> {
    const index = this.mockEmployees.findIndex(emp => emp.id === id);
    if (index !== -1) {
      this.mockEmployees.splice(index, 1);
      return of(true);
    }
    return of(false);
  }

  /**
   * Get unique departments from all employees
   * @returns Observable of department list
   */
  getDepartments(): Observable<string[]> {
    const departments = Array.from(new Set(this.mockEmployees.map(emp => emp.department)));
    return of(departments.sort());
  }

  /**
   * Get unique employment types from all employees
   * @returns Observable of employment type list
   */
  getEmploymentTypes(): Observable<string[]> {
    const types = Array.from(new Set(this.mockEmployees.map(emp => emp.employmentType)));
    return of(types.sort());
  }
}
