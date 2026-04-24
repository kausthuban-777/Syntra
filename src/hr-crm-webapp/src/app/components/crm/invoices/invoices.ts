import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { NavigationService } from '../../../services/navigation.service';
import { FormsModule } from '@angular/forms';

interface Invoice {
  id: string;
  customer: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  issueDate: Date;
  dueDate: Date;
  paidDate?: Date;
}

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invoices.html',
  styleUrl: './invoices.css'
})
export class Invoices implements OnInit {
  private navigationService = inject(NavigationService);

  invoices = signal<Invoice[]>([
    {
      id: 'INV-001',
      customer: 'TechCorp Inc',
      amount: 125000,
      status: 'paid',
      issueDate: new Date('2026-04-01'),
      dueDate: new Date('2026-04-30'),
      paidDate: new Date('2026-04-28')
    },
    {
      id: 'INV-002',
      customer: 'Digital Solutions',
      amount: 85000,
      status: 'pending',
      issueDate: new Date('2026-04-10'),
      dueDate: new Date('2026-05-10')
    },
    {
      id: 'INV-003',
      customer: 'Global Enterprises',
      amount: 45000,
      status: 'paid',
      issueDate: new Date('2026-03-15'),
      dueDate: new Date('2026-04-15'),
      paidDate: new Date('2026-04-12')
    },
    {
      id: 'INV-004',
      customer: 'Innovation Labs',
      amount: 62000,
      status: 'overdue',
      issueDate: new Date('2026-03-01'),
      dueDate: new Date('2026-04-01')
    },
    {
      id: 'INV-005',
      customer: 'CloudTech Systems',
      amount: 95000,
      status: 'pending',
      issueDate: new Date('2026-04-15'),
      dueDate: new Date('2026-05-15')
    }
  ]);

  searchQuery = signal('');
  filterStatus = signal<string>('all');
  selectedInvoice = signal<Invoice | null>(null);

  ngOnInit() {
    this.navigationService.setCurrentPage('crm');
  }

  selectInvoice(invoice: Invoice) {
    this.selectedInvoice.set(invoice);
  }

  closeDetails() {
    this.selectedInvoice.set(null);
  }

  get filteredInvoices() {
    let filtered = this.invoices();

    if (this.searchQuery()) {
      const query = this.searchQuery().toLowerCase();
      filtered = filtered.filter(inv =>
        inv.customer.toLowerCase().includes(query) ||
        inv.id.toLowerCase().includes(query)
      );
    }

    if (this.filterStatus() !== 'all') {
      filtered = filtered.filter(inv => inv.status === this.filterStatus());
    }

    return filtered;
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      paid: 'status-paid',
      pending: 'status-pending',
      overdue: 'status-overdue',
      cancelled: 'status-cancelled'
    };
    return classes[status] || '';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      paid: 'Paid',
      pending: 'Pending',
      overdue: 'Overdue',
      cancelled: 'Cancelled'
    };
    return labels[status] || status;
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

  getTotalPaid(): number {
    return this.invoices()
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.amount, 0);
  }

  getTotalPending(): number {
    return this.invoices()
      .filter(inv => inv.status === 'pending')
      .reduce((sum, inv) => sum + inv.amount, 0);
  }

  getTotalOverdue(): number {
    return this.invoices()
      .filter(inv => inv.status === 'overdue')
      .reduce((sum, inv) => sum + inv.amount, 0);
  }

  getAgingDays(invoice: Invoice): number {
    if (invoice.status === 'paid') return 0;
    const now = new Date();
    const diff = now.getTime() - invoice.dueDate.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  getPaymentProgress(invoice: Invoice): number {
    if (invoice.status === 'paid') return 100;
    if (invoice.status === 'cancelled') return 0;

    const now = new Date();
    const total = invoice.dueDate.getTime() - invoice.issueDate.getTime();
    const elapsed = now.getTime() - invoice.issueDate.getTime();
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  }

  getProgressClass(invoice: Invoice): string {
    if (invoice.status === 'paid') return 'progress-paid';
    if (invoice.status === 'overdue') return 'progress-overdue';
    return 'progress-pending';
  }
}
