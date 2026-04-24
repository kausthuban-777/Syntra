import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Employee, EmployeeFilter } from '../../../models/employee.model';
import { EmployeeService } from '../../../services/employee.service';
import { ConfirmationModal } from '../../shared/ui/confirmation-modal/confirmation-modal';

@Component({
  selector: 'app-employees',
  imports: [CommonModule, FormsModule, ConfirmationModal],
  templateUrl: './employees.html',
  styleUrl: './employees.css',
  providers: [EmployeeService]
})
export class Employees implements OnInit, OnDestroy {
  // Signals for state management
  protected employees = signal<Employee[]>([]);
  protected isLoading = signal(false);
  protected selectedEmployee = signal<Employee | null>(null);
  protected showForm = signal(false);
  protected isEditing = signal(false);

  // Confirmation Modal state
  protected showConfirmModal = signal(false);
  protected confirmModalTitle = '';
  protected confirmModalMessage = '';
  protected onConfirmAction: (() => void) | null = null;

  // Filter state
  protected searchTerm = '';
  protected selectedDepartment = '';
  protected selectedStatus = '';
  protected selectedEmploymentType = '';

  // Filter options
  protected departments = signal<string[]>([]);
  protected employmentTypes = signal<string[]>([]);
  protected statuses: string[] = ['Active', 'Inactive', 'On Leave'];

  // Pagination
  protected currentPage = 1;
  protected pageSize = 10;
  protected totalCount = 0;

  // Sorting
  protected sortBy = signal('firstName');
  protected sortDirection = signal<'asc' | 'desc'>('asc');

  // Component lifecycle
  private destroy$ = new Subject<void>();

  constructor(private employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.loadEmployees();
    this.loadFilterOptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load employees from service
   * Can be easily switched to API call
   */
  private loadEmployees(): void {
    this.isLoading.set(true);

    const filter: EmployeeFilter = {
      searchTerm: this.searchTerm || undefined,
      department: this.selectedDepartment || undefined,
      status: this.selectedStatus || undefined,
      employmentType: this.selectedEmploymentType || undefined
    };

    this.employeeService
      .getEmployees(filter, this.currentPage, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.employees.set(response.data);
          this.totalCount = response.totalCount;
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading employees:', error);
          this.isLoading.set(false);
        }
      });
  }

  /**
   * Load filter options (departments, employment types)
   */
  private loadFilterOptions(): void {
    this.employeeService.getDepartments()
      .pipe(takeUntil(this.destroy$))
      .subscribe(departments => this.departments.set(departments));

    this.employeeService.getEmploymentTypes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(types => this.employmentTypes.set(types));
  }

  /**
   * Handle search input
   */
  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.currentPage = 1;
    this.loadEmployees();
  }

  /**
   * Handle department filter change
   */
  onDepartmentChange(department: string): void {
    this.selectedDepartment = department;
    this.currentPage = 1;
    this.loadEmployees();
  }

  /**
   * Handle status filter change
   */
  onStatusChange(status: string): void {
    this.selectedStatus = status;
    this.currentPage = 1;
    this.loadEmployees();
  }

  /**
   * Handle employment type filter change
   */
  onEmploymentTypeChange(type: string): void {
    this.selectedEmploymentType = type;
    this.currentPage = 1;
    this.loadEmployees();
  }

  /**
   * Clear all filters
   */
  clearFilters(): void {
    this.searchTerm = '';
    this.selectedDepartment = '';
    this.selectedStatus = '';
    this.selectedEmploymentType = '';
    this.currentPage = 1;
    this.loadEmployees();
  }

  /**
   * Select an employee for viewing details
   */
  selectEmployee(employee: Employee): void {
    this.selectedEmployee.set(employee);
    this.isEditing.set(false);
  }

  /**
   * Close the detail panel
   */
  closeDetail(): void {
    this.selectedEmployee.set(null);
    this.showForm.set(false);
  }

  /**
   * Open form for adding new employee
   */
  openAddForm(): void {
    this.isEditing.set(false);
    this.selectedEmployee.set(null);
    this.showForm.set(true);
  }

  /**
   * Open form for editing selected employee
   */
  openEditForm(): void {
    if (this.selectedEmployee()) {
      this.isEditing.set(true);
      this.showForm.set(true);
    }
  }

  /**
   * Handle form submission (add or edit)
   */
  handleFormSubmit(): void {
    // TODO: Implement form submission logic
    // This will handle both create and update operations
    this.showForm.set(false);
    this.loadEmployees();
  }

  /**
   * Delete an employee
   */
  deleteEmployee(employeeId: string): void {
    const employee = this.employees().find(emp => emp.id === employeeId);
    if (!employee) return;

    // Set up the confirmation modal
    this.confirmModalTitle = 'Delete Employee';
    this.confirmModalMessage = `Are you sure you want to delete ${employee.firstName} ${employee.lastName}? This action cannot be undone.`;
    this.onConfirmAction = () => this.confirmDeleteEmployee(employeeId);
    this.showConfirmModal.set(true);
  }

  /**
   * Handle confirmed delete action
   */
  private confirmDeleteEmployee(employeeId: string): void {
    this.employeeService.deleteEmployee(employeeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (success) => {
          if (success) {
            this.selectedEmployee.set(null);
            this.loadEmployees();
          }
        },
        error: (error) => console.error('Error deleting employee:', error)
      });
  }

  /**
   * Handle confirm modal confirmation
   */
  onConfirmModalConfirm(): void {
    if (this.onConfirmAction) {
      this.onConfirmAction();
      this.onConfirmAction = null;
    }
    this.showConfirmModal.set(false);
  }

  /**
   * Handle confirm modal cancellation
   */
  onConfirmModalCancel(): void {
    this.onConfirmAction = null;
    this.showConfirmModal.set(false);
  }

  /**
   * Format date for display
   */
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  /**
   * Get status badge color
   */
  getStatusColor(status: string): string {
    switch (status) {
      case 'Active':
        return 'badge-green';
      case 'On Leave':
        return 'badge-orange';
      case 'Inactive':
        return 'badge-red';
      default:
        return 'badge-default';
    }
  }

  /**
   * Calculate total pages
   */
  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  /**
   * Go to previous page
   */
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadEmployees();
    }
  }

  /**
   * Go to next page
   */
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadEmployees();
    }
  }

  /**
   * Format salary for display
   */
  formatSalary(salary?: number): string {
    if (!salary) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(salary);
  }

  /**
   * Sort employees by field
   */
  sortEmployees(field: string): void {
    if (this.sortBy() === field) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortBy.set(field);
      this.sortDirection.set('asc');
    }
    this.loadEmployees();
  }
}
