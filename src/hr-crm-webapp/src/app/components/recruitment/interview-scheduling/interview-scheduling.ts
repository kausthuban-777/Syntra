import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Interview, InterviewFilter, InterviewType, InterviewStatus } from '../../../models/recruitment.model';
import { RecruitmentService } from '../../../services/recruitment.service';
import { ConfirmationModal } from '../../shared/ui/confirmation-modal/confirmation-modal';

@Component({
  selector: 'app-interview-scheduling',
  imports: [CommonModule, FormsModule, ConfirmationModal],
  templateUrl: './interview-scheduling.html',
  styleUrl: './interview-scheduling.css',
  providers: [RecruitmentService]
})
export class InterviewScheduling implements OnInit, OnDestroy {
  protected interviews = signal<Interview[]>([]);
  protected isLoading = signal(false);
  protected selectedInterview = signal<Interview | null>(null);
  protected showForm = signal(false);
  protected isEditing = signal(false);

  protected showConfirmModal = signal(false);
  protected confirmModalTitle = '';
  protected confirmModalMessage = '';
  protected onConfirmAction: (() => void) | null = null;

  protected searchTerm = '';
  protected selectedStatus = '';
  protected selectedType = '';
  protected sortBy = 'date';

  protected statuses = signal<string[]>([]);
  protected interviewTypes = signal<string[]>([]);

  protected currentPage = 1;
  protected pageSize = 10;
  protected totalCount = 0;

  protected totalPages = computed(() => Math.ceil(this.totalCount / this.pageSize));
  protected upcomingInterviews = computed(() => {
    return this.interviews().filter(i => new Date(i.scheduledDate) > new Date());
  });
  protected completedInterviews = computed(() => {
    return this.interviews().filter(i => i.status === InterviewStatus.COMPLETED);
  });

  private destroy$ = new Subject<void>();

  constructor(private recruitmentService: RecruitmentService) {}

  ngOnInit(): void {
    this.loadInterviews();
    this.loadFilterOptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadInterviews(): void {
    this.isLoading.set(true);

    const filter: InterviewFilter = {
      searchTerm: this.searchTerm || undefined,
      status: this.selectedStatus || undefined,
      interviewType: this.selectedType || undefined
    };

    this.recruitmentService
      .getInterviews(filter, this.currentPage, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          let sorted = [...response.data];

          if (this.sortBy === 'date') {
            sorted.sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
          } else if (this.sortBy === 'rating') {
            sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          }

          this.interviews.set(sorted);
          this.totalCount = response.totalCount;
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading interviews:', error);
          this.isLoading.set(false);
        }
      });
  }

  private loadFilterOptions(): void {
    this.statuses.set(Object.values(InterviewStatus));

    this.recruitmentService.getInterviewTypes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(types => this.interviewTypes.set(types));
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.currentPage = 1;
    this.loadInterviews();
  }

  onStatusChange(status: string): void {
    this.selectedStatus = status;
    this.currentPage = 1;
    this.loadInterviews();
  }

  onTypeChange(type: string): void {
    this.selectedType = type;
    this.currentPage = 1;
    this.loadInterviews();
  }

  onSortChange(sort: string): void {
    this.sortBy = sort;
    this.loadInterviews();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.selectedType = '';
    this.sortBy = 'date';
    this.currentPage = 1;
    this.loadInterviews();
  }

  selectInterview(interview: Interview): void {
    this.selectedInterview.set(interview);
    this.isEditing.set(false);
  }

  isInterviewSelected(interview: Interview): boolean {
    const selected = this.selectedInterview();
    if (!selected) return false;
    return selected.id === interview.id;
  }

  trackByInterviewId(index: number, interview: Interview): string {
    return interview.id;
  }

  closeDetail(): void {
    this.selectedInterview.set(null);
    this.showForm.set(false);
  }

  openAddForm(): void {
    this.isEditing.set(false);
    this.selectedInterview.set(null);
    this.showForm.set(true);
  }

  openEditForm(): void {
    if (this.selectedInterview()) {
      this.isEditing.set(true);
      this.showForm.set(true);
    }
  }

  handleFormSubmit(): void {
    this.showForm.set(false);
    this.loadInterviews();
  }

  deleteInterview(id: string): void {
    this.confirmModalTitle = 'Cancel Interview';
    this.confirmModalMessage = 'Are you sure you want to cancel this interview? This action cannot be undone.';
    this.onConfirmAction = () => {
      this.recruitmentService.deleteInterview(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.loadInterviews();
          if (this.selectedInterview()?.id === id) {
            this.closeDetail();
          }
          this.showConfirmModal.set(false);
        });
    };
    this.showConfirmModal.set(true);
  }

  updateInterviewStatus(interviewId: string, newStatus: InterviewStatus): void {
    this.recruitmentService.updateInterview(interviewId, { status: newStatus })
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadInterviews();
        if (this.selectedInterview()?.id === interviewId) {
          this.recruitmentService.getInterviewById(interviewId)
            .pipe(takeUntil(this.destroy$))
            .subscribe(interview => {
              if (interview) {
                this.selectedInterview.set(interview);
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
      this.loadInterviews();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
      this.loadInterviews();
    }
  }

  getStatusColor(status: InterviewStatus): string {
    const statusColorMap: { [key in InterviewStatus]: string } = {
      [InterviewStatus.SCHEDULED]: 'badge-info',
      [InterviewStatus.COMPLETED]: 'badge-success',
      [InterviewStatus.RESCHEDULED]: 'badge-warning',
      [InterviewStatus.CANCELLED]: 'badge-danger',
      [InterviewStatus.FEEDBACK_PENDING]: 'badge-primary'
    };
    return statusColorMap[status] || 'badge-secondary';
  }

  getTypeColor(type: InterviewType): string {
    const typeColorMap: { [key in InterviewType]: string } = {
      [InterviewType.PHONE_SCREENING]: 'type-phone',
      [InterviewType.TECHNICAL]: 'type-technical',
      [InterviewType.HR]: 'type-hr',
      [InterviewType.MANAGER]: 'type-manager',
      [InterviewType.FINAL]: 'type-final',
      [InterviewType.ASSESSMENT]: 'type-assessment'
    };
    return typeColorMap[type] || 'type-other';
  }

  isUpcoming(interview: Interview): boolean {
    return new Date(interview.scheduledDate) > new Date();
  }

  getTimeUntilInterview(scheduledDate: Date): string {
    const now = new Date();
    const scheduled = new Date(scheduledDate);
    const diffInMinutes = Math.floor((scheduled.getTime() - now.getTime()) / (1000 * 60));

    if (diffInMinutes < 0) return 'Overdue';
    if (diffInMinutes < 60) return `${diffInMinutes}m away`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h away`;
    return `${Math.floor(diffInMinutes / 1440)}d away`;
  }

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  getRatingStars(rating: number | undefined): string {
    if (!rating) return '☆☆☆☆☆';
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }
}
