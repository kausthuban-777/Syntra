import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { PayrollService } from '../../../services/payroll.service';
import { PayrollRecord, PayrollStatus, PayrollSummary, PayrollFilter } from '../../../models/payroll.model';
import { TableSkeleton } from '../../shared/ui/table-skeleton/table-skeleton';

@Component({
  selector: 'app-payroll',
  imports: [CommonModule, FormsModule, TableSkeleton],
  templateUrl: './payroll.html',
  styleUrl: './payroll.css',
})
export class Payroll implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Expose PayrollStatus enum to template
  PayrollStatus = PayrollStatus;

  payrollRecords = signal<PayrollRecord[]>([]);
  selectedRecord = signal<PayrollRecord | null>(null);
  showDetailsModal = signal(false);
  summary = signal<PayrollSummary | null>(null);
  isLoading = signal<boolean>(false);

  selectedStatus = signal<PayrollStatus | ''>('');
  selectedPeriod = signal('');

  sortBy = signal<string>('employeeName');
  sortDirection = signal<'asc' | 'desc'>('asc');

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

  sortedRecords = computed(() => {
    const records = [...this.filteredRecords()];
    const sortField = this.sortBy();
    const direction = this.sortDirection();

    return records.sort((a: any, b: any) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();

      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
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
    this.isLoading.set(true);
    this.payrollService.getPayrollRecords().pipe(
      takeUntil(this.destroy$)
    ).subscribe(records => {
      this.payrollRecords.set(records);
      this.isLoading.set(false);
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

  downloadPayrollReceipt(record: PayrollRecord): void {
    // Generate and download payroll receipt
    const receiptData = this.generatePayrollReceipt(record);
    const blob = new Blob([receiptData], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `payroll-receipt-${record.employeeId}-${this.formatDate(record.payPeriodEnd)}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private generatePayrollReceipt(record: PayrollRecord): string {
    const totalDeductions = record.deductions.reduce((sum, d) => sum + d.amount, 0);

    return `
PAYROLL RECEIPT
=====================================

Employee Information:
-------------------------------------
Name: ${record.employeeName}
Employee ID: ${record.employeeId}
Pay Frequency: ${record.payFrequency}

Pay Period:
-------------------------------------
Start Date: ${this.formatDate(record.payPeriodStart)}
End Date: ${this.formatDate(record.payPeriodEnd)}
Pay Date: ${this.formatDate(record.payDate)}

Earnings:
-------------------------------------
Base Salary: ${this.formatCurrency(record.baseSalary)}
Hours Worked: ${record.hoursWorked.toFixed(1)}
${record.overtimeHours > 0 ? `Overtime Hours: ${record.overtimeHours.toFixed(1)}\nOvertime Rate: ${this.formatCurrency(record.overtimeRate)}/hr` : ''}

Gross Pay: ${this.formatCurrency(record.grossPay)}

Deductions:
-------------------------------------
${record.deductions.map(d => `${d.name}: ${this.formatCurrency(d.amount)}`).join('\n')}
-------------------------------------
Total Deductions: ${this.formatCurrency(totalDeductions)}

Summary:
=====================================
Gross Pay: ${this.formatCurrency(record.grossPay)}
Total Deductions: -${this.formatCurrency(totalDeductions)}
NET PAY: ${this.formatCurrency(record.netPay)}
=====================================

Status: ${record.status}
Generated: ${new Date().toLocaleString()}
    `.trim();
  }

  onStatusFilterChange(): void {
    // Filter will be applied automatically via computed signal
  }

  onPeriodFilterChange(): void {
    // Filter will be applied automatically via computed signal
  }

  sortRecords(field: string): void {
    if (this.sortBy() === field) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortBy.set(field);
      this.sortDirection.set('asc');
    }
  }
}
