export enum PayrollStatus {
  Pending = 'pending',
  Processing = 'processing',
  Completed = 'completed',
  Failed = 'failed'
}

export enum PayFrequency {
  Weekly = 'weekly',
  BiWeekly = 'bi-weekly',
  SemiMonthly = 'semi-monthly',
  Monthly = 'monthly'
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  payPeriodStart: Date;
  payPeriodEnd: Date;
  payDate: Date;
  grossPay: number;
  deductions: Deduction[];
  netPay: number;
  status: PayrollStatus;
  payFrequency: PayFrequency;
  hoursWorked: number;
  overtimeHours: number;
  overtimeRate: number;
  baseSalary: number;
  benefits: Benefit[];
  taxes: Tax[];
  notes?: string;
}

export interface Deduction {
  id: string;
  name: string;
  amount: number;
  type: 'pre-tax' | 'post-tax' | 'voluntary';
}

export interface Benefit {
  id: string;
  name: string;
  employeeContribution: number;
  employerContribution: number;
}

export interface Tax {
  id: string;
  name: string;
  rate: number;
  amount: number;
}

export interface PayrollSummary {
  totalEmployees: number;
  totalGrossPay: number;
  totalDeductions: number;
  totalNetPay: number;
  pendingPayrolls: number;
  processedPayrolls: number;
}

export interface PayrollFilter {
  status?: PayrollStatus;
  payPeriod?: Date;
  employeeId?: string;
}
