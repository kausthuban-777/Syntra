import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { PayrollService } from '../../../services/payroll.service';
import { PayrollRecord, PayrollStatus, PayrollSummary, PayrollFilter } from '../../../models/payroll.model';

@Component({
  selector: 'app-payroll',
  imports: [CommonModule, FormsModule],
  templateUrl: './payroll.html',
  styleUrl: './payroll.css',
})
export class Payroll implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  payrollRecords = signal<PayrollRecord[]>([]);
  selectedRecord = signal<PayrollRecord | null>(null);
  showDetailsModal = signal(false);
  summary = signal<PayrollSummary | null>(null);

  selectedStatus = signal<PayrollStatus | ''>('');
  selectedPeriod = signal('');

  filteredRecords = computed(() => {
    let records = this.payrollRecords();

    if (this.selectedStatus()) {
      records = records.filter(r => r.status === this.selectedStatus());
    }

    if (this.selectedPeriod()) {
      const period = new Date(this.selectedPeriod());
      records = records.filter(r =>
        r.payPeriodStart <= period && r.payPeriodEnd >= period
      );
    }

    return records;
  });

  constructor(private payrollService: PayrollService) {}

  ngOnInit(): void {
    this.loadPayrollData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadPayrollData(): void {
    this.payrollService.getPayrollRecords().pipe(
      takeUntil(this.destroy$)
    ).subscribe(records => {
      this.payrollRecords.set(records);
    });

    this.payrollService.getPayrollSummary().pipe(
      takeUntil(this.destroy$)
    ).subscribe(summary => {
      this.summary.set(summary);
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }

  getStatusClass(status: PayrollStatus): string {
    return status.toLowerCase();
  }

  viewPayrollDetails(record: PayrollRecord): void {
    this.selectedRecord.set(record);
    this.showDetailsModal.set(true);
  }

  closeDetailsModal(): void {
    this.showDetailsModal.set(false);
    this.selectedRecord.set(null);
  }

  processPayroll(record: PayrollRecord): void {
    this.payrollService.updatePayrollStatus(record.id, PayrollStatus.Processing);
    this.loadPayrollData();
  }

  completePayroll(record: PayrollRecord): void {
    this.payrollService.updatePayrollStatus(record.id, PayrollStatus.Completed);
    this.loadPayrollData();
  }

  onStatusFilterChange(): void {
    // Filter will be applied automatically via computed signal
  }

  onPeriodFilterChange(): void {
    // Filter will be applied automatically via computed signal
  }
}
