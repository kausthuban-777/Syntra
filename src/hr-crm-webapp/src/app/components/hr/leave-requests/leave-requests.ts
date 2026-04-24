import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LeaveRequestService } from '../../../services/leave-request.service';
import {
  LeaveRequest,
  LeaveRequestFilter,
  LeaveRequestStatus,
  LeaveType,
  LeaveRequestSummary
} from '../../../models/leave-request.model';
import { ConfirmationModal } from '../../shared/ui/confirmation-modal/confirmation-modal';
import { TableSkeleton } from '../../shared/ui/table-skeleton/table-skeleton';

@Component({
  selector: 'app-leave-requests',
  imports: [CommonModule, FormsModule, ConfirmationModal, TableSkeleton],
  templateUrl: './leave-requests.html',
  styleUrl: './leave-requests.css'
})
export class LeaveRequests implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  leaveRequests = signal<LeaveRequest[]>([]);
  selectedRequest = signal<LeaveRequest | null>(null);
  searchText = signal<string>('');
  statusFilter = signal<string>('all');
  typeFilter = signal<string>('all');
  showConfirmationModal = signal<boolean>(false);
  confirmationTitle = signal<string>('');
  confirmationMessage = signal<string>('');
  confirmationButton = signal<string>('');
  confirmationAction = signal<'approve' | 'reject' | null>(null);
  confirmationTargetId = signal<string>('');
  leaveSummary = signal<LeaveRequestSummary>({
    totalCount: 0,
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0
  });
  isLoading = signal<boolean>(false);
  sortBy = signal<string>('employeeName');
  sortDirection = signal<'asc' | 'desc'>('asc');

  readonly LeaveRequestStatus = LeaveRequestStatus;
  readonly LeaveType = LeaveType;

  sortedRequests = computed(() => {
    const requests = [...this.leaveRequests()];
    const sortField = this.sortBy();
    const direction = this.sortDirection();

    return requests.sort((a: any, b: any) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();

      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  });

  readonly statusOptions = [
    { label: 'All statuses', value: 'all' },
    ...Object.values(LeaveRequestStatus).map(value => ({ label: value, value }))
  ];

  readonly leaveTypeOptions = [
    { label: 'All leave types', value: 'all' },
    ...Object.values(LeaveType).map(value => ({ label: value, value }))
  ];

  readonly requestCountText = computed(() => `${this.leaveRequests().length} requests`);

  constructor(private leaveRequestService: LeaveRequestService) {}

  ngOnInit(): void {
    this.refreshData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private refreshData(): void {
    this.loadLeaveRequests();
    this.loadSummary();
  }

  private loadLeaveRequests(): void {
    this.isLoading.set(true);
    const filter: LeaveRequestFilter = {
      searchTerm: this.searchText() || undefined,
      status: this.statusFilter() !== 'all' ? this.statusFilter() as LeaveRequestStatus : undefined,
      leaveType: this.typeFilter() !== 'all' ? this.typeFilter() as LeaveType : undefined
    };

    this.leaveRequestService.getLeaveRequests(filter)
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        const requests = response.data as LeaveRequest[];
        this.leaveRequests.set(requests);
        if (!this.selectedRequest() || !requests.some(item => item.id === this.selectedRequest()?.id)) {
          this.selectedRequest.set(requests.length ? requests[0] : null);
        }
        this.isLoading.set(false);
      });
  }

  sortRequests(field: string): void {
    if (this.sortBy() === field) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortBy.set(field);
      this.sortDirection.set('asc');
    }
  }

  private loadSummary(): void {
    this.leaveRequestService.getLeaveRequestSummary()
      .pipe(takeUntil(this.destroy$))
      .subscribe(summary => this.leaveSummary.set(summary));
  }

  onFilterUpdated(): void {
    this.loadLeaveRequests();
  }

  selectRequest(request: LeaveRequest): void {
    this.selectedRequest.set(request);
  }

  getStatusClass(status?: LeaveRequestStatus | null): string {
    if (!status) {
      return '';
    }
    return status.toLowerCase().replace(/\s+/g, '-');
  }

  getRequestDuration(request: LeaveRequest): string {
    const startTime = request.startDate.getTime();
    const endTime = request.endDate.getTime();
    const days = Math.round((endTime - startTime) / (1000 * 60 * 60 * 24)) + 1;
    return `${days} day${days === 1 ? '' : 's'}`;
  }

  getSelectedRequestDuration(): string {
    const request = this.selectedRequest();
    return request ? this.getRequestDuration(request) : '-';
  }

  formatDate(value?: Date): string {
    if (!value) {
      return '-';
    }
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    }).format(new Date(value));
  }

  openActionConfirmation(request: LeaveRequest, action: 'approve' | 'reject'): void {
    const title = action === 'approve' ? 'Approve leave request' : 'Reject leave request';
    const message = action === 'approve'
      ? `Approve ${request.employeeName}'s leave request from ${this.formatDate(request.startDate)} to ${this.formatDate(request.endDate)}?`
      : `Reject ${request.employeeName}'s leave request and update the status accordingly?`;

    this.confirmationTitle.set(title);
    this.confirmationMessage.set(message);
    this.confirmationButton.set(action === 'approve' ? 'Approve' : 'Reject');
    this.confirmationAction.set(action);
    this.confirmationTargetId.set(request.id);
    this.showConfirmationModal.set(true);
  }

  handleConfirmationCancel(): void {
    this.showConfirmationModal.set(false);
    this.confirmationAction.set(null);
    this.confirmationTargetId.set('');
  }

  handleConfirmationConfirm(): void {
    const action = this.confirmationAction();
    const requestId = this.confirmationTargetId();

    if (!action || !requestId) {
      this.handleConfirmationCancel();
      return;
    }

    const status = action === 'approve' ? LeaveRequestStatus.Approved : LeaveRequestStatus.Rejected;
    const approver = 'HR Team';
    const comments = action === 'approve' ? 'Approved by HR.' : 'Rejected by HR.';

    this.leaveRequestService.updateLeaveRequestStatus(requestId, status, approver, comments)
      .pipe(takeUntil(this.destroy$))
      .subscribe(updated => {
        if (updated) {
          this.refreshData();
          this.selectedRequest.set(updated);
        }
        this.handleConfirmationCancel();
      });
  }
}

