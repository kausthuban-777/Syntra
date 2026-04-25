import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { NavigationService } from '../../../services/navigation.service';
import { FormsModule } from '@angular/forms';

interface PaymentProvider {
  id: string;
  name: string;
  logo: string;
  status: 'active' | 'inactive' | 'pending';
  transactionCount: number;
  totalAmount: number;
  currency: string;
  lastTransaction: Date;
  fees: number;
}

interface Transaction {
  id: string;
  provider: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  customer: string;
  timestamp: Date;
  method: string;
}

interface PaymentStats {
  totalRevenue: number;
  totalTransactions: number;
  successRate: number;
  averageTransaction: number;
}

@Component({
  selector: 'app-payment-gateway',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-gateway.html',
  styleUrl: './payment-gateway.css',
})
export class PaymentGateway implements OnInit {
  private navigationService = inject(NavigationService);

  isConnected = signal(true);
  activeTab = signal<'overview' | 'transactions' | 'providers'>('overview');

  providers = signal<PaymentProvider[]>([
    {
      id: 'stripe',
      name: 'Stripe',
      logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iMjUiIHZpZXdCb3g9IjAgMCA2MCAyNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNTkuMzc1IDEyLjVjMC02LjkwMy01LjU5Ny0xMi41LTEyLjUtMTIuNXMtMTIuNSA1LjU5Ny0xMi41IDEyLjUgNS41OTcgMTIuNSAxMi41IDEyLjUgMTIuNS01LjU5NyAxMi41LTEyLjV6IiBmaWxsPSIjNjM1QkZGIi8+PHBhdGggZD0iTTQ2Ljg3NSA4Ljc1YTMuNzUgMy43NSAwIDEgMCAwIDcuNSAzLjc1IDMuNzUgMCAwIDAgMC03LjV6IiBmaWxsPSIjZmZmIi8+PC9zdmc+',
      status: 'active',
      transactionCount: 1247,
      totalAmount: 284750.50,
      currency: 'USD',
      lastTransaction: new Date('2026-04-25T11:30:00'),
      fees: 2.9
    },
    {
      id: 'paypal',
      name: 'PayPal',
      logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iMjUiIHZpZXdCb3g9IjAgMCA2MCAyNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNDYuODc1IDIuNWgtMTIuNWMtLjg2MiAwLTEuNTk4LjYyNS0xLjczNCAxLjQ3NWwtNS4xMTYgMzIuNWMtLjEwMi42MjUuMzc1IDEuMTg4IDEgMS4xODhoNi4yNWMuODYyIDAgMS41OTgtLjYyNSAxLjczNC0xLjQ3NWwxLjM5MS04LjgyNWMuMTM2LS44NSAxLjg3Mi0xLjQ3NSAxLjczNC0xLjQ3NWg0LjM3NWM5LjA2MiAwIDE0LjMxMi00LjM3NSAxNS42ODgtMTMuMDYyLjYyNS00LjA2Mi0uMTI1LTcuMjUtMi4xODgtOS41LTIuMzc1LTIuNS02LjU2Mi0zLjc1LTEyLjEyNS0zLjc1em0xLjg3NSAxMi44NzVjLS43NSA0Ljg3NS00LjUgNC44NzUtOC4xMjUgNC44NzVoLTIuMDYybDEuNDM4LTkuMTI1Yy4wODctLjUuNS0uODc1IDEtLjg3NWguODc1YzIuMjUgMCA0LjM3NSAwIDUuNSAxLjI1IDEuMTI1IDEuMTI1IDEuNjI1IDIuNzUgMS4zNzUgMy44NzV6IiBmaWxsPSIjMDAzMDg3Ii8+PC9zdmc+',
      status: 'active',
      transactionCount: 892,
      totalAmount: 156890.25,
      currency: 'USD',
      lastTransaction: new Date('2026-04-25T10:45:00'),
      fees: 3.5
    },
    {
      id: 'square',
      name: 'Square',
      logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iMjUiIHZpZXdCb3g9IjAgMCA2MCAyNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSIzNSIgeT0iMiIgd2lkdGg9IjIxIiBoZWlnaHQ9IjIxIiByeD0iMyIgZmlsbD0iIzAwMCIvPjwvc3ZnPg==',
      status: 'active',
      transactionCount: 456,
      totalAmount: 89234.75,
      currency: 'USD',
      lastTransaction: new Date('2026-04-25T09:20:00'),
      fees: 2.6
    },
    {
      id: 'razorpay',
      name: 'Razorpay',
      logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iMjUiIHZpZXdCb3g9IjAgMCA2MCAyNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNDYuODc1IDIuNWgtMTIuNWMtMS4zOCAwLTIuNSAxLjEyLTIuNSAyLjV2MTIuNWMwIDEuMzggMS4xMiAyLjUgMi41IDIuNWgxMi41YzEuMzggMCAyLjUtMS4xMiAyLjUtMi41VjVjMC0xLjM4LTEuMTItMi41LTIuNS0yLjV6IiBmaWxsPSIjMDcyNjU0Ii8+PHBhdGggZD0iTTQwLjYyNSA4Ljc1aDYuMjVsLTYuMjUgNi4yNVY4Ljc1eiIgZmlsbD0iIzNBOTVGRiIvPjwvc3ZnPg==',
      status: 'inactive',
      transactionCount: 0,
      totalAmount: 0,
      currency: 'USD',
      lastTransaction: new Date('2026-04-20T14:00:00'),
      fees: 2.0
    }
  ]);

  transactions = signal<Transaction[]>([
    {
      id: 'TXN001',
      provider: 'Stripe',
      amount: 1250.00,
      currency: 'USD',
      status: 'completed',
      customer: 'Sarah Johnson',
      timestamp: new Date('2026-04-25T11:30:00'),
      method: 'Credit Card'
    },
    {
      id: 'TXN002',
      provider: 'PayPal',
      amount: 890.50,
      currency: 'USD',
      status: 'completed',
      customer: 'Michael Chen',
      timestamp: new Date('2026-04-25T11:15:00'),
      method: 'PayPal Balance'
    },
    {
      id: 'TXN003',
      provider: 'Stripe',
      amount: 2340.75,
      currency: 'USD',
      status: 'pending',
      customer: 'Lisa Anderson',
      timestamp: new Date('2026-04-25T10:45:00'),
      method: 'Debit Card'
    },
    {
      id: 'TXN004',
      provider: 'Square',
      amount: 567.25,
      currency: 'USD',
      status: 'completed',
      customer: 'David Park',
      timestamp: new Date('2026-04-25T10:30:00'),
      method: 'Credit Card'
    },
    {
      id: 'TXN005',
      provider: 'PayPal',
      amount: 1890.00,
      currency: 'USD',
      status: 'failed',
      customer: 'Emily Rodriguez',
      timestamp: new Date('2026-04-25T09:50:00'),
      method: 'Bank Transfer'
    },
    {
      id: 'TXN006',
      provider: 'Stripe',
      amount: 450.00,
      currency: 'USD',
      status: 'refunded',
      customer: 'James Wilson',
      timestamp: new Date('2026-04-25T09:20:00'),
      method: 'Credit Card'
    }
  ]);

  stats = computed<PaymentStats>(() => {
    const provs = this.providers();
    const txns = this.transactions();
    const totalRevenue = provs.reduce((sum, p) => sum + p.totalAmount, 0);
    const totalTransactions = provs.reduce((sum, p) => sum + p.transactionCount, 0);
    const completedTxns = txns.filter(t => t.status === 'completed').length;

    return {
      totalRevenue,
      totalTransactions,
      successRate: totalTransactions > 0 ? (completedTxns / txns.length) * 100 : 0,
      averageTransaction: totalTransactions > 0 ? totalRevenue / totalTransactions : 0
    };
  });

  searchQuery = signal('');
  filterStatus = signal<string>('all');
  filterProvider = signal<string>('all');

  filteredTransactions = computed(() => {
    let filtered = this.transactions();

    if (this.searchQuery()) {
      const query = this.searchQuery().toLowerCase();
      filtered = filtered.filter(txn =>
        txn.id.toLowerCase().includes(query) ||
        txn.customer.toLowerCase().includes(query) ||
        txn.provider.toLowerCase().includes(query)
      );
    }

    if (this.filterStatus() !== 'all') {
      filtered = filtered.filter(txn => txn.status === this.filterStatus());
    }

    if (this.filterProvider() !== 'all') {
      filtered = filtered.filter(txn => txn.provider === this.filterProvider());
    }

    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  });

  ngOnInit() {
    this.navigationService.setCurrentPage('integrations');
  }

  toggleProvider(provider: PaymentProvider) {
    const updated = this.providers().map(p =>
      p.id === provider.id ? { ...p, status: p.status === 'active' ? 'inactive' as const : 'active' as const } : p
    );
    this.providers.set(updated);
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      completed: '#34A853',
      pending: '#FBBC05',
      failed: '#EA4335',
      refunded: '#9E9E9E'
    };
    return colors[status] || '#999';
  }

  formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
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
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  disconnect() {
    this.isConnected.set(false);
  }

  reconnect() {
    this.isConnected.set(true);
  }
}
