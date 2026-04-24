import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { NavigationService } from '../../../services/navigation.service';
import { FormsModule } from '@angular/forms';

interface Payment {
  id: string;
  invoiceId: string;
  customer: string;
  amount: number;
  method: 'credit-card' | 'bank-transfer' | 'paypal' | 'check';
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  date: Date;
  transactionId: string;
}

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payments.html',
  styleUrl: './payments.css'
})
export class Payments implements OnInit {
  private navigationService = inject(NavigationService);

  payments = signal<Payment[]>([
    {
      id: 'PAY-001',
      invoiceId: 'INV-001',
      customer: 'TechCorp Inc',
      amount: 125000,
      method: 'bank-transfer',
      status: 'completed',
      date: new Date('2026-04-28'),
      transactionId: 'TXN-20260428-001'
    },
    {
      id: 'PAY-002',
      invoiceId: 'INV-003',
      customer: 'Global Enterprises',
      amount: 45000,
      method: 'credit-card',
      status: 'completed',
      date: new Date('2026-04-12'),
      transactionId: 'TXN-20260412-002'
    },
    {
      id: 'PAY-003',
      invoiceId: 'INV-002',
      customer: 'Digital Solutions',
      amount: 85000,
      method: 'paypal',
      status: 'pending',
      date: new Date('2026-04-20'),
      transactionId: 'TXN-20260420-003'
    },
    {
      id: 'PAY-004',
      invoiceId: 'INV-004',
      customer: 'Innovation Labs',
      amount: 62000,
      method: 'bank-transfer',
      status: 'failed',
      date: new Date('2026-04-05'),
      transactionId: 'TXN-20260405-004'
    },
    {
      id: 'PAY-005',
      invoiceId: 'INV-005',
      customer: 'CloudTech Systems',
      amount: 95000,
      method: 'check',
      status: 'pending',
      date: new Date('2026-04-22'),
      transactionId: 'TXN-20260422-005'
    }
  ]);

  searchQuery = signal('');
  filterStatus = signal<string>('all');
  filterMethod = signal<string>('all');
  selectedPayment = signal<Payment | null>(null);

  ngOnInit() {
    this.navigationService.setCurrentPage('crm');
  }

  selectPayment(payment: Payment) {
    this.selectedPayment.set(payment);
  }

  closeDetails() {
    this.selectedPayment.set(null);
  }

  get filteredPayments() {
    let filtered = this.payments();

    if (this.searchQuery()) {
      const query = this.searchQuery().toLowerCase();
      filtered = filtered.filter(payment =>
        payment.customer.toLowerCase().includes(query) ||
        payment.id.toLowerCase().includes(query) ||
        payment.invoiceId.toLowerCase().includes(query)
      );
    }

    if (this.filterStatus() !== 'all') {
      filtered = filtered.filter(payment => payment.status === this.filterStatus());
    }

    if (this.filterMethod() !== 'all') {
      filtered = filtered.filter(payment => payment.method === this.filterMethod());
    }

    return filtered;
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      completed: 'status-completed',
      pending: 'status-pending',
      failed: 'status-failed',
      refunded: 'status-refunded'
    };
    return classes[status] || '';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      completed: 'Completed',
      pending: 'Pending',
      failed: 'Failed',
      refunded: 'Refunded'
    };
    return labels[status] || status;
  }

  getMethodLabel(method: string): string {
    const labels: Record<string, string> = {
      'credit-card': 'Credit Card',
      'bank-transfer': 'Bank Transfer',
      'paypal': 'PayPal',
      'check': 'Check'
    };
    return labels[method] || method;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  }

  getTotalCompleted(): number {
    return this.payments()
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);
  }

  getTotalPending(): number {
    return this.payments()
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0);
  }

  getTotalFailed(): number {
    return this.payments()
      .filter(p => p.status === 'failed')
      .reduce((sum, p) => sum + p.amount, 0);
  }

  getCompletedCount(): number {
    return this.payments().filter(p => p.status === 'completed').length;
  }

  getPendingCount(): number {
    return this.payments().filter(p => p.status === 'pending').length;
  }

  getFailedCount(): number {
    return this.payments().filter(p => p.status === 'failed').length;
  }

  getMethodClass(method: string): string {
    const classes: Record<string, string> = {
      'credit-card': 'method-card',
      'bank-transfer': 'method-bank',
      'paypal': 'method-paypal',
      'check': 'method-check'
    };
    return classes[method] || '';
  }
}
