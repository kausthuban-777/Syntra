import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { JobPosting, JobPostingFilter, JobPostingStatus } from '../../../models/recruitment.model';
import { RecruitmentService } from '../../../services/recruitment.service';
import { ConfirmationModal } from '../../shared/ui/confirmation-modal/confirmation-modal';

@Component({
  selector: 'app-job-openings',
  imports: [CommonModule, FormsModule, ConfirmationModal],
  templateUrl: './job-openings.html',
  styleUrl: './job-openings.css',
  providers: [RecruitmentService]
})
export class JobOpenings implements OnInit, OnDestroy {
  protected jobPostings = signal<JobPosting[]>([]);
  protected isLoading = signal(false);
  protected selectedPosting = signal<JobPosting | null>(null);
  protected showForm = signal(false);
  protected isEditing = signal(false);

  protected showConfirmModal = signal(false);
  protected confirmModalTitle = '';
  protected confirmModalMessage = '';
  protected onConfirmAction: (() => void) | null = null;

  protected searchTerm = '';
  protected selectedStatus = '';
  protected selectedDepartment = '';
  protected selectedLocation = '';
  protected selectedJobType = '';

  protected statuses = signal<string[]>([]);
  protected departments = signal<string[]>([]);
  protected locations = signal<string[]>([]);
  protected jobTypes = ['Full-Time', 'Part-Time', 'Contract'];

  protected currentPage = 1;
  protected pageSize = 10;
  protected totalCount = 0;

  protected totalPages = computed(() => Math.ceil(this.totalCount / this.pageSize));

  private destroy$ = new Subject<void>();

  constructor(private recruitmentService: RecruitmentService) {}

  ngOnInit(): void {
    this.loadJobPostings();
    this.loadFilterOptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadJobPostings(): void {
    this.isLoading.set(true);

    const filter: JobPostingFilter = {
      searchTerm: this.searchTerm || undefined,
      status: this.selectedStatus || undefined,
      department: this.selectedDepartment || undefined,
      location: this.selectedLocation || undefined,
      jobType: this.selectedJobType || undefined
    };

    this.recruitmentService
      .getJobPostings(filter, this.currentPage, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.jobPostings.set(response.data);
          this.totalCount = response.totalCount;
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading job postings:', error);
          this.isLoading.set(false);
        }
      });
  }

  private loadFilterOptions(): void {
    this.statuses.set(Object.values(JobPostingStatus));

    this.recruitmentService.getDepartments()
      .pipe(takeUntil(this.destroy$))
      .subscribe(departments => this.departments.set(departments));

    this.recruitmentService.getLocations()
      .pipe(takeUntil(this.destroy$))
      .subscribe(locations => this.locations.set(locations));
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.currentPage = 1;
    this.loadJobPostings();
  }

  onStatusChange(status: string): void {
    this.selectedStatus = status;
    this.currentPage = 1;
    this.loadJobPostings();
  }

  onDepartmentChange(department: string): void {
    this.selectedDepartment = department;
    this.currentPage = 1;
    this.loadJobPostings();
  }

  onLocationChange(location: string): void {
    this.selectedLocation = location;
    this.currentPage = 1;
    this.loadJobPostings();
  }

  onJobTypeChange(jobType: string): void {
    this.selectedJobType = jobType;
    this.currentPage = 1;
    this.loadJobPostings();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.selectedDepartment = '';
    this.selectedLocation = '';
    this.selectedJobType = '';
    this.currentPage = 1;
    this.loadJobPostings();
  }

  selectPosting(posting: JobPosting): void {
    this.selectedPosting.set(posting);
    this.isEditing.set(false);
  }

  isPostingSelected(posting: JobPosting): boolean {
    const selected = this.selectedPosting();
    if (!selected) return false;
    return String(selected.id) === String(posting.id);
  }

  trackByPostingId(index: number, posting: JobPosting): string {
    return posting.id;
  }

  closeDetail(): void {
    this.selectedPosting.set(null);
    this.showForm.set(false);
  }

  openAddForm(): void {
    this.isEditing.set(false);
    this.selectedPosting.set(null);
    this.showForm.set(true);
  }

  openEditForm(): void {
    if (this.selectedPosting()) {
      this.isEditing.set(true);
      this.showForm.set(true);
    }
  }

  handleFormSubmit(): void {
    this.showForm.set(false);
    this.loadJobPostings();
  }

  deletePosting(id: string): void {
    this.confirmModalTitle = 'Delete Job Posting';
    this.confirmModalMessage = 'Are you sure you want to delete this job posting? This action cannot be undone.';
    this.onConfirmAction = () => {
      this.recruitmentService.deleteJobPosting(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.loadJobPostings();
          if (this.selectedPosting()?.id === id) {
            this.closeDetail();
          }
          this.showConfirmModal.set(false);
        });
    };
    this.showConfirmModal.set(true);
  }

  updatePostingStatus(postingId: string, newStatus: JobPostingStatus): void {
    this.recruitmentService.updateJobPosting(postingId, { status: newStatus })
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadJobPostings();
        if (this.selectedPosting()?.id === postingId) {
          this.recruitmentService.getJobPostingById(postingId)
            .pipe(takeUntil(this.destroy$))
            .subscribe(posting => {
              if (posting) {
                this.selectedPosting.set(posting);
              }
            });
        }
      });
  }

  handleConfirm(): void {
    if (this.onConfirmAction) {
      this.onConfirmAction();
    }
  }

  handleCancel(): void {
    this.showConfirmModal.set(false);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadJobPostings();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
      this.loadJobPostings();
    }
  }

  getStatusColor(status: JobPostingStatus): string {
    const statusColorMap: { [key in JobPostingStatus]: string } = {
      [JobPostingStatus.DRAFT]: 'badge-secondary',
      [JobPostingStatus.ACTIVE]: 'badge-success',
      [JobPostingStatus.CLOSED]: 'badge-danger',
      [JobPostingStatus.ARCHIVED]: 'badge-secondary',
      [JobPostingStatus.ONHOLD]: 'badge-warning'
    };
    return statusColorMap[status] || 'badge-secondary';
  }

  getApplicationProgress(posting: JobPosting): number {
    const totalNeeded = posting.totalPositions;
    const progress = (posting.hiredCount / totalNeeded) * 100;
    return Math.min(progress, 100);
  }

  isPostingOpen(posting: JobPosting): boolean {
    return posting.status === JobPostingStatus.ACTIVE;
  }

  getTimePosted(postedDate: Date): string {
    const now = new Date();
    const posted = new Date(postedDate);
    const diffInDays = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  }

  formatSalaryIndia(salaryInThousands: number): string {
  const salary = salaryInThousands;

  if (salary < 100000) {
    return '1L';
  }

  const lakhs = salary / 100000;
  const formatted = parseFloat(lakhs.toFixed(1));
  return `${formatted}L`;
}

  getSalaryRangeIndia(minSalary: number, maxSalary: number): string {
    return `${this.formatSalaryIndia(minSalary)} - ${this.formatSalaryIndia(maxSalary)}`;
  }
}
