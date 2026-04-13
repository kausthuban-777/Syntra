import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  PayrollRecord,
  PayrollStatus,
  PayFrequency,
  PayrollSummary,
  PayrollFilter,
  Deduction,
  Benefit,
  Tax
} from '../models/payroll.model';

@Injectable({
  providedIn: 'root'
})
export class PayrollService {
  private payrollRecords = signal<PayrollRecord[]>(this.generateMockData());

  getPayrollRecords(filter?: PayrollFilter): Observable<PayrollRecord[]> {
    let records = this.payrollRecords();

    if (filter?.status) {
      records = records.filter(r => r.status === filter.status);
    }

    if (filter?.employeeId) {
      records = records.filter(r => r.employeeId === filter.employeeId);
    }

    if (filter?.payPeriod) {
      records = records.filter(r =>
        r.payPeriodStart <= filter.payPeriod! && r.payPeriodEnd >= filter.payPeriod!
      );
    }

    return new BehaviorSubject(records).asObservable();
  }

  getPayrollSummary(): Observable<PayrollSummary> {
    const records = this.payrollRecords();
    const summary: PayrollSummary = {
      totalEmployees: new Set(records.map(r => r.employeeId)).size,
      totalGrossPay: records.reduce((sum, r) => sum + r.grossPay, 0),
      totalDeductions: records.reduce((sum, r) => sum + r.deductions.reduce((dSum, d) => dSum + d.amount, 0), 0),
      totalNetPay: records.reduce((sum, r) => sum + r.netPay, 0),
      pendingPayrolls: records.filter(r => r.status === PayrollStatus.Pending).length,
      processedPayrolls: records.filter(r => r.status === PayrollStatus.Completed).length
    };

    return new BehaviorSubject(summary).asObservable();
  }

  updatePayrollStatus(id: string, status: PayrollStatus): void {
    const records = this.payrollRecords();
    const index = records.findIndex(r => r.id === id);
    if (index !== -1) {
      records[index] = { ...records[index], status };
      this.payrollRecords.set([...records]);
    }
  }

  private generateMockData(): PayrollRecord[] {
    const employees = [
      { id: 'EMP001', name: 'John Smith' },
      { id: 'EMP002', name: 'Sarah Johnson' },
      { id: 'EMP003', name: 'Mike Davis' },
      { id: 'EMP004', name: 'Emily Chen' },
      { id: 'EMP005', name: 'David Wilson' }
    ];

    return employees.map((emp, index) => {
      const baseSalary = 5000 + (index * 1000);
      const hoursWorked = 160 + Math.random() * 20;
      const overtimeHours = Math.random() > 0.7 ? Math.random() * 10 : 0;
      const overtimeRate = baseSalary / 160 * 1.5;

      const deductions: Deduction[] = [
        { id: '1', name: 'Health Insurance', amount: 150, type: 'pre-tax' },
        { id: '2', name: '401(k)', amount: 200, type: 'pre-tax' },
        { id: '3', name: 'Federal Tax', amount: baseSalary * 0.15, type: 'post-tax' },
        { id: '4', name: 'State Tax', amount: baseSalary * 0.05, type: 'post-tax' }
      ];

      const benefits: Benefit[] = [
        { id: '1', name: 'Health Insurance', employeeContribution: 150, employerContribution: 300 },
        { id: '2', name: 'Dental Insurance', employeeContribution: 25, employerContribution: 50 }
      ];

      const taxes: Tax[] = [
        { id: '1', name: 'Federal Income Tax', rate: 0.15, amount: baseSalary * 0.15 },
        { id: '2', name: 'Social Security', rate: 0.062, amount: Math.min(baseSalary, 168600) * 0.062 },
        { id: '3', name: 'Medicare', rate: 0.0145, amount: baseSalary * 0.0145 }
      ];

      const grossPay = baseSalary + (overtimeHours * overtimeRate);
      const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0);
      const netPay = grossPay - totalDeductions;

      return {
        id: `PAY${String(index + 1).padStart(3, '0')}`,
        employeeId: emp.id,
        employeeName: emp.name,
        payPeriodStart: new Date(2026, 3, 1 + (index * 7)),
        payPeriodEnd: new Date(2026, 3, 7 + (index * 7)),
        payDate: new Date(2026, 3, 15 + (index * 7)),
        grossPay,
        deductions,
        netPay,
        status: index % 3 === 0 ? PayrollStatus.Pending : index % 3 === 1 ? PayrollStatus.Processing : PayrollStatus.Completed,
        payFrequency: PayFrequency.BiWeekly,
        hoursWorked,
        overtimeHours,
        overtimeRate,
        baseSalary,
        benefits,
        taxes
      };
    });
  }
}
