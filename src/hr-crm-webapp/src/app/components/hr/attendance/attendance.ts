import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AttendanceService } from '../../../services/attendance.service';
import {
  AttendanceRecord,
  AttendanceFilter,
  AttendanceStatus,
  AttendanceSummary
} from '../../../models/attendance.model';
import { ConfirmationModal } from '../../shared/ui/confirmation-modal/confirmation-modal';

@Component({
  selector: 'app-attendance',
  imports: [CommonModule, FormsModule, ConfirmationModal],
  templateUrl: './attendance.html',
  styleUrl: './attendance.css'
})
export class Attendance implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  attendanceRecords = signal<AttendanceRecord[]>([]);
  selectedDate = signal<string>(new Date().toISOString().split('T')[0]);
  selectedEmployee = signal<string>('all');
  selectedStatus = signal<string>('all');
  showConfirmationModal = signal<boolean>(false);
  confirmationTitle = signal<string>('');
  confirmationMessage = signal<string>('');
  confirmationAction = signal<'mark-present' | 'mark-absent' | 'mark-late' | null>(null);
  confirmationTargetId = signal<string>('');
  confirmationButton = signal<string>('');
  attendanceSummary = signal<AttendanceSummary>({
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0,
    onLeaveToday: 0,
    lateToday: 0
  });

  readonly AttendanceStatus = AttendanceStatus;

  readonly statusOptions = [
    { label: 'All statuses', value: 'all' },
    ...Object.values(AttendanceStatus).map(value => ({ label: value, value }))
  ];

  readonly employeeOptions = [
    { label: 'All employees', value: 'all' },
    { label: 'Amina Patel', value: '1001' },
    { label: 'Marco Diaz', value: '1004' },
    { label: 'Priya Sharma', value: '1003' },
    { label: 'Leila Sanders', value: '1009' },
    { label: 'Ethan Ross', value: '1007' }
  ];

  readonly recordCountText = computed(() => `${this.attendanceRecords().length} records`);

  constructor(private attendanceService: AttendanceService) {}

  ngOnInit(): void {
    this.refreshData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private refreshData(): void {
    this.loadAttendanceRecords();
    this.loadSummary();
  }

  private loadAttendanceRecords(): void {
    const filter: AttendanceFilter = {
      date: this.selectedDate() ? new Date(this.selectedDate()) : undefined,
      employeeId: this.selectedEmployee() !== 'all' ? this.selectedEmployee() : undefined,
      status: this.selectedStatus() !== 'all' ? this.selectedStatus() as AttendanceStatus : undefined
    };

    this.attendanceService.getAttendanceRecords(filter)
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.attendanceRecords.set(response.data as AttendanceRecord[]);
      });
  }

  private loadSummary(): void {
    const date = this.selectedDate() ? new Date(this.selectedDate()) : new Date();
    this.attendanceService.getAttendanceSummary(date)
      .pipe(takeUntil(this.destroy$))
      .subscribe(summary => this.attendanceSummary.set(summary));
  }

  onFilterUpdated(): void {
    this.refreshData();
  }

  getStatusClass(status: AttendanceStatus): string {
    return status.toLowerCase().replace(/\s+/g, '-');
  }

  formatTime(date?: Date): string {
    if (!date) return '-';
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  }

  formatHours(hours?: number): string {
    if (!hours) return '-';
    return `${hours}h`;
  }

  openStatusConfirmation(record: AttendanceRecord, newStatus: AttendanceStatus): void {
    const action = newStatus.toLowerCase().replace(/\s+/g, '-');
    const title = `Update attendance status`;
    const message = `Change ${record.employeeName}'s status to ${newStatus} for ${this.formatDate(record.date)}?`;

    this.confirmationTitle.set(title);
    this.confirmationMessage.set(message);
    this.confirmationButton.set(newStatus);
    this.confirmationAction.set(action as any);
    this.confirmationTargetId.set(record.id);
    this.showConfirmationModal.set(true);
  }

  handleConfirmationCancel(): void {
    this.showConfirmationModal.set(false);
    this.confirmationAction.set(null);
    this.confirmationTargetId.set('');
  }

  handleConfirmationConfirm(): void {
    const action = this.confirmationAction();
    const recordId = this.confirmationTargetId();

    if (!action || !recordId) {
      this.handleConfirmationCancel();
      return;
    }

    let newStatus: AttendanceStatus;
    switch (action) {
      case 'mark-present':
        newStatus = AttendanceStatus.Present;
        break;
      case 'mark-absent':
        newStatus = AttendanceStatus.Absent;
        break;
      case 'mark-late':
        newStatus = AttendanceStatus.Late;
        break;
      default:
        this.handleConfirmationCancel();
        return;
    }

    this.attendanceService.updateAttendanceStatus(recordId, newStatus)
      .pipe(takeUntil(this.destroy$))
      .subscribe(updated => {
        if (updated) {
          this.refreshData();
        }
        this.handleConfirmationCancel();
      });
  }

  private formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    }).format(new Date(date));
  }
}
