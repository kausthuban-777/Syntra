import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PipelineData, CandidateStatus, Candidate, RecruitmentMetrics } from '../../../models/recruitment.model';
import { RecruitmentService } from '../../../services/recruitment.service';

@Component({
  selector: 'app-hiring-pipeline',
  imports: [CommonModule, FormsModule],
  templateUrl: './hiring-pipeline.html',
  styleUrl: './hiring-pipeline.css',
  providers: [RecruitmentService]
})
export class HiringPipeline implements OnInit, OnDestroy {
  protected pipelineData = signal<PipelineData | null>(null);
  protected metrics = signal<RecruitmentMetrics | null>(null);
  protected isLoading = signal(false);
  protected selectedCandidate = signal<Candidate | null>(null);
  protected activeStage = signal<string>('');

  protected stages = [
    { id: CandidateStatus.NEW, label: 'New', color: '#3498db', icon: '📥' },
    { id: CandidateStatus.SCREENING, label: 'Screening', color: '#f39c12', icon: '🔍' },
    { id: CandidateStatus.INTERVIEWED, label: 'Interviewed', color: '#9b59b6', icon: '💬' },
    { id: CandidateStatus.SHORTLISTED, label: 'Shortlisted', color: '#2ecc71', icon: '⭐' },
    { id: CandidateStatus.OFFER_EXTENDED, label: 'Offer Extended', color: '#1abc9c', icon: '💼' },
    { id: CandidateStatus.HIRED, label: 'Hired', color: '#27ae60', icon: '✅' }
  ];

  private destroy$ = new Subject<void>();

  constructor(private recruitmentService: RecruitmentService) {}

  ngOnInit(): void {
    this.loadPipelineData();
    this.loadMetrics();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadPipelineData(): void {
    this.isLoading.set(true);
    this.recruitmentService.getPipelineData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.pipelineData.set(data);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading pipeline data:', error);
          this.isLoading.set(false);
        }
      });
  }

  private loadMetrics(): void {
    this.recruitmentService.getRecruitmentMetrics()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.metrics.set(data);
        },
        error: (error) => {
          console.error('Error loading metrics:', error);
        }
      });
  }

  getCandidatesForStage(stageId: string): Candidate[] {
    if (!this.pipelineData()) return [];

    const stageKey = stageId.toLowerCase().replace(/\s/g, '');
    const data = this.pipelineData()!;

    switch (stageId) {
      case CandidateStatus.NEW:
        return data.new;
      case CandidateStatus.SCREENING:
        return data.screening;
      case CandidateStatus.INTERVIEWED:
        return data.interviewed;
      case CandidateStatus.SHORTLISTED:
        return data.shortlisted;
      case CandidateStatus.OFFER_EXTENDED:
        return data.offerExtended;
      case CandidateStatus.HIRED:
        return data.hired;
      default:
        return [];
    }
  }

  selectCandidate(candidate: Candidate): void {
    this.selectedCandidate.set(candidate);
  }

  closeDetail(): void {
    this.selectedCandidate.set(null);
  }

  getStageColor(stageId: string): string {
    const stage = this.stages.find(s => s.id === stageId);
    return stage?.color || '#95a5a6';
  }

  getStageIcon(stageId: string): string {
    const stage = this.stages.find(s => s.id === stageId);
    return stage?.icon || '📋';
  }

  moveCandidate(candidate: Candidate, newStatus: CandidateStatus): void {
    this.recruitmentService.updateCandidate(candidate.id, { status: newStatus })
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadPipelineData();
        this.closeDetail();
      });
  }

  getRatingStars(rating: number | undefined): string {
    if (!rating) return '☆☆☆☆☆';
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  getNextStatus(currentStatus: CandidateStatus): CandidateStatus | null {
    const statusOrder = [
      CandidateStatus.NEW,
      CandidateStatus.SCREENING,
      CandidateStatus.INTERVIEWED,
      CandidateStatus.SHORTLISTED,
      CandidateStatus.OFFER_EXTENDED,
      CandidateStatus.HIRED
    ];

    const currentIndex = statusOrder.indexOf(currentStatus);
    if (currentIndex < statusOrder.length - 1) {
      return statusOrder[currentIndex + 1];
    }
    return null;
  }

  getPreviousStatus(currentStatus: CandidateStatus): CandidateStatus | null {
    const statusOrder = [
      CandidateStatus.NEW,
      CandidateStatus.SCREENING,
      CandidateStatus.INTERVIEWED,
      CandidateStatus.SHORTLISTED,
      CandidateStatus.OFFER_EXTENDED,
      CandidateStatus.HIRED
    ];

    const currentIndex = statusOrder.indexOf(currentStatus);
    if (currentIndex > 0) {
      return statusOrder[currentIndex - 1];
    }
    return null;
  }

  canPromote(currentStatus: CandidateStatus): boolean {
    return this.getNextStatus(currentStatus) !== null;
  }

  canDemote(currentStatus: CandidateStatus): boolean {
    return this.getPreviousStatus(currentStatus) !== null;
  }
}
