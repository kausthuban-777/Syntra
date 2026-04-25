import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { NavigationService } from '../../../services/navigation.service';
import { FormsModule } from '@angular/forms';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: Date;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  dueDate: Date;
  status: 'paid' | 'pending' | 'overdue' | 'draft';
}

interface FinancialData {
  balance: number;
  balanceChange: number;
  income: number;
  incomeChange: number;
  expenses: number;
  expensesChange: number;
  profit: number;
  profitChange: number;
}

@Component({
  selector: 'app-accounting',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './accounting.html',
  styleUrl: './accounting.css',
})
export class Accounting implements OnInit {
  private navigationService = inject(NavigationService);

  isConnected = signal(true);
  connectedPlatform = signal('QuickBooks');
  transactionFilter = signal<'all' | 'income' | 'expense'>('all');
  lastSyncTime = signal(new Date('2026-04-25T11:45:00'));

  financialData = signal<FinancialData>({
    balance: 284750.50,
    balanceChange: 12.5,
    income: 456890.25,
    incomeChange: 18.3,
    expenses: 172139.75,
    expensesChange: 8.7,
    profit: 284750.50,
    profitChange: 24.6
  });

  transactions = signal<Transaction[]>([
    {
      id: 'TXN001',
      description: 'Client Payment - Project Alpha',
      amount: 15000.00,
      type: 'income',
      category: 'Revenue',
      date: new Date('2026-04-25T10:30:00')
    },
    {
      id: 'TXN002',
      description: 'Office Supplies',
      amount: 450.75,
      type: 'expense',
      category: 'Office',
      date: new Date('2026-04-25T09:15:00')
    },
    {
      id: 'TXN003',
      description: 'Consulting Services',
      amount: 8500.00,
      type: 'income',
      category: 'Services',
      date: new Date('2026-04-24T16:45:00')
    },
    {
      id: 'TXN004',
      description: 'Software Subscription',
      amount: 299.99,
      type: 'expense',
      category: 'Software',
      date: new Date('2026-04-24T14:20:00')
    },
    {
      id: 'TXN005',
      description: 'Product Sales',
      amount: 12750.50,
      type: 'income',
      category: 'Sales',
      date: new Date('2026-04-24T11:30:00')
    },
    {
      id: 'TXN006',
      description: 'Marketing Campaign',
      amount: 3500.00,
      type: 'expense',
      category: 'Marketing',
      date: new Date('2026-04-23T15:00:00')
    },
    {
      id: 'TXN007',
      description: 'Freelancer Payment',
      amount: 2800.00,
      type: 'expense',
      category: 'Contractors',
      date: new Date('2026-04-23T10:45:00')
    },
    {
      id: 'TXN008',
      description: 'Client Retainer',
      amount: 5000.00,
      type: 'income',
      category: 'Revenue',
      date: new Date('2026-04-22T14:00:00')
    }
  ]);

  invoices = signal<Invoice[]>([
    {
      id: 'INV001',
      invoiceNumber: 'INV-2026-001',
      clientName: 'Acme Corporation',
      amount: 15000.00,
      dueDate: new Date('2026-05-01'),
      status: 'pending'
    },
    {
      id: 'INV002',
      invoiceNumber: 'INV-2026-002',
      clientName: 'TechStart Inc',
      amount: 8500.00,
      dueDate: new Date('2026-04-28'),
      status: 'paid'
    },
    {
      id: 'INV003',
      invoiceNumber: 'INV-2026-003',
      clientName: 'Global Solutions',
      amount: 12750.50,
      dueDate: new Date('2026-04-20'),
      status: 'overdue'
    },
    {
      id: 'INV004',
      invoiceNumber: 'INV-2026-004',
      clientName: 'Innovation Labs',
      amount: 6200.00,
      dueDate: new Date('2026-05-10'),
      status: 'draft'
    },
    {
      id: 'INV005',
      invoiceNumber: 'INV-2026-005',
      clientName: 'Digital Ventures',
      amount: 9800.00,
      dueDate: new Date('2026-05-05'),
      status: 'pending'
    }
  ]);

  filteredTransactions = computed(() => {
    const filter = this.transactionFilter();
    if (filter === 'all') {
      return this.transactions();
    }
    return this.transactions().filter(t => t.type === filter);
  });

  ngOnInit() {
    this.navigationService.setCurrentPage('integrations');
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  }

  disconnect() {
    this.isConnected.set(false);
  }

  reconnect() {
    this.isConnected.set(true);
  }

  connectPlatform(platform: string) {
    this.connectedPlatform.set(platform);
    this.isConnected.set(true);
  }

  syncNow() {
    this.lastSyncTime.set(new Date());
    // Simulate sync animation
  }

  createInvoice() {
    // Handle invoice creation
    console.log('Create invoice clicked');
  }
}
