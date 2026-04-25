import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Candidate, CandidateFilter, ExperienceLevel, CandidateStatus } from '../../../models/recruitment.model';
import { RecruitmentService } from '../../../services/recruitment.service';
import { ConfirmationModal } from '../../shared/ui/confirmation-modal/confirmation-modal';
import { TableSkeleton } from '../../shared/ui/table-skeleton/table-skeleton';

@Component({
  selector: 'app-candidates',
  imports: [CommonModule, FormsModule, ConfirmationModal, TableSkeleton],
  templateUrl: './candidates.html',
  styleUrl: './candidates.css',
  providers: [RecruitmentService]
})
export class Candidates implements OnInit, OnDestroy {
  protected candidates = signal<Candidate[]>([]);
  protected isLoading = signal<boolean>(false);
  protected selectedCandidate = signal<Candidate | null>(null);
  protected showForm = signal(false);
  protected isEditing = signal(false);

  protected showConfirmModal = signal(false);
  protected confirmModalTitle = '';
  protected confirmModalMessage = '';
  protected onConfirmAction: (() => void) | null = null;

  protected searchTerm = '';
  protected selectedStatus = '';
  protected selectedExperienceLevel = '';
  protected selectedPosition = '';
  protected selectedSource = '';
  protected minRating = '';

  protected statuses = signal<string[]>([]);
  protected experienceLevels = signal<string[]>([]);
  protected positions = signal<string[]>([]);
  protected sources = signal<string[]>([]);

  protected currentPage = 1;
  protected pageSize = 10;
  protected totalCount = 0;

  protected sortBy = signal<string>('name');
  protected sortDirection = signal<'asc' | 'desc'>('asc');

  protected sortedCandidates = computed(() => {
    const candidates = [...this.candidates()];
    const sortField = this.sortBy();
    const direction = this.sortDirection();

    return candidates.sort((a: any, b: any) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();

      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  });

  protected totalPages = computed(() => Math.ceil(this.totalCount / this.pageSize));

  private destroy$ = new Subject<void>();

  constructor(private recruitmentService: RecruitmentService) {}

  ngOnInit(): void {
    this.loadCandidates();
    this.loadFilterOptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCandidates(): void {
    this.isLoading.set(true);

    const filter: CandidateFilter = {
      searchTerm: this.searchTerm || undefined,
      status: this.selectedStatus || undefined,
      experienceLevel: this.selectedExperienceLevel || undefined,
      position: this.selectedPosition || undefined,
      source: this.selectedSource || undefined,
      minRating: this.minRating ? parseInt(this.minRating) : undefined
    };

    this.recruitmentService
      .getCandidates(filter, this.currentPage, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.candidates.set(response.data);
          this.totalCount = response.totalCount;
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading candidates:', error);
          this.isLoading.set(false);
        }
      });
  }

  private loadFilterOptions(): void {
    this.experienceLevels.set(Object.values(ExperienceLevel));
    this.statuses.set(Object.values(CandidateStatus));

    this.recruitmentService.getPositions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(positions => this.positions.set(positions));

    this.recruitmentService.getSources()
      .pipe(takeUntil(this.destroy$))
      .subscribe(sources => this.sources.set(sources));
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.currentPage = 1;
    this.loadCandidates();
  }

  onStatusChange(status: string): void {
    this.selectedStatus = status;
    this.currentPage = 1;
    this.loadCandidates();
  }

  onExperienceLevelChange(level: string): void {
    this.selectedExperienceLevel = level;
    this.currentPage = 1;
    this.loadCandidates();
  }

  onPositionChange(position: string): void {
    this.selectedPosition = position;
    this.currentPage = 1;
    this.loadCandidates();
  }

  onSourceChange(source: string): void {
    this.selectedSource = source;
    this.currentPage = 1;
    this.loadCandidates();
  }

  onRatingChange(rating: string): void {
    this.minRating = rating;
    this.currentPage = 1;
    this.loadCandidates();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.selectedExperienceLevel = '';
    this.selectedPosition = '';
    this.selectedSource = '';
    this.minRating = '';
    this.currentPage = 1;
    this.loadCandidates();
  }

  selectCandidate(candidate: Candidate): void {
    this.selectedCandidate.set(candidate);
    this.isEditing.set(false);
  }

  closeDetail(): void {
    this.selectedCandidate.set(null);
    this.showForm.set(false);
  }

  openAddForm(): void {
    this.isEditing.set(false);
    this.selectedCandidate.set(null);
    this.showForm.set(true);
  }

  openEditForm(): void {
    if (this.selectedCandidate()) {
      this.isEditing.set(true);
      this.showForm.set(true);
    }
  }

  handleFormSubmit(): void {
    this.showForm.set(false);
    this.loadCandidates();
  }

  deleteCandidate(id: string): void {
    this.confirmModalTitle = 'Delete Candidate';
    this.confirmModalMessage = 'Are you sure you want to delete this candidate? This action cannot be undone.';
    this.onConfirmAction = () => {
      this.recruitmentService.deleteCandidate(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.loadCandidates();
          if (this.selectedCandidate()?.id === id) {
            this.closeDetail();
          }
          this.showConfirmModal.set(false);
        });
    };
    this.showConfirmModal.set(true);
  }

  updateCandidateStatus(candidateId: string, newStatus: CandidateStatus): void {
    this.recruitmentService.updateCandidate(candidateId, { status: newStatus })
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadCandidates();
        if (this.selectedCandidate()?.id === candidateId) {
          this.recruitmentService.getCandidateById(candidateId)
            .pipe(takeUntil(this.destroy$))
            .subscribe(candidate => {
              if (candidate) {
                this.selectedCandidate.set(candidate);
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
      this.loadCandidates();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
      this.loadCandidates();
    }
  }

  getStatusColor(status: CandidateStatus): string {
    const statusColorMap: { [key in CandidateStatus]: string } = {
      [CandidateStatus.NEW]: 'badge-info',
      [CandidateStatus.SCREENING]: 'badge-warning',
      [CandidateStatus.INTERVIEWED]: 'badge-primary',
      [CandidateStatus.SHORTLISTED]: 'badge-success',
      [CandidateStatus.OFFER_EXTENDED]: 'badge-accent',
      [CandidateStatus.HIRED]: 'badge-success-filled',
      [CandidateStatus.REJECTED]: 'badge-danger',
      [CandidateStatus.WITHDRAWN]: 'badge-secondary'
    };
    return statusColorMap[status] || 'badge-secondary';
  }

  getRatingStars(rating: number | undefined): string {
    if (!rating) return '☆☆☆☆☆';
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  openResume(candidate: Candidate): void {
    if (candidate.resumeUrl) {
      window.open(candidate.resumeUrl, '_blank');
    }
  }

  sortCandidates(field: string): void {
    if (this.sortBy() === field) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortBy.set(field);
      this.sortDirection.set('asc');
    }
  }
}
