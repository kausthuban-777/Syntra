import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { NavigationService } from '../../../services/navigation.service';
import { FormsModule } from '@angular/forms';

interface Quotation {
  id: string;
  customer: string;
  title: string;
  amount: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  validUntil: Date;
  createdAt: Date;
  items: number;
}

@Component({
  selector: 'app-quotations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quotations.html',
  styleUrl: './quotations.css'
})
export class Quotations implements OnInit {
  private navigationService = inject(NavigationService);

  quotations = signal<Quotation[]>([
    {
      id: 'Q001',
      customer: 'TechCorp Inc',
      title: 'Enterprise Software License',
      amount: 125000,
      status: 'sent',
      validUntil: new Date('2026-05-15'),
      createdAt: new Date('2026-04-15'),
      items: 5
    },
    {
      id: 'Q002',
      customer: 'Digital Solutions',
      title: 'Cloud Migration Services',
      amount: 85000,
      status: 'accepted',
      validUntil: new Date('2026-05-20'),
      createdAt: new Date('2026-04-10'),
      items: 8
    },
    {
      id: 'Q003',
      customer: 'Global Enterprises',
      title: 'Annual Support Package',
      amount: 45000,
      status: 'draft',
      validUntil: new Date('2026-05-25'),
      createdAt: new Date('2026-04-20'),
      items: 3
    },
    {
      id: 'Q004',
      customer: 'Innovation Labs',
      title: 'Custom Integration',
      amount: 62000,
      status: 'sent',
      validUntil: new Date('2026-05-30'),
      createdAt: new Date('2026-04-18'),
      items: 6
    },
    {
      id: 'Q005',
      customer: 'StartupHub',
      title: 'Consulting Services',
      amount: 28000,
      status: 'rejected',
      validUntil: new Date('2026-04-25'),
      createdAt: new Date('2026-03-25'),
      items: 4
    }
  ]);

  searchQuery = signal('');
  filterStatus = signal<string>('all');
  selectedQuotation = signal<Quotation | null>(null);

  ngOnInit() {
    this.navigationService.setCurrentPage('crm');
  }

  selectQuotation(quotation: Quotation) {
    this.selectedQuotation.set(quotation);
  }

  closeDetails() {
    this.selectedQuotation.set(null);
  }

  get filteredQuotations() {
    let filtered = this.quotations();

    if (this.searchQuery()) {
      const query = this.searchQuery().toLowerCase();
      filtered = filtered.filter(q =>
        q.customer.toLowerCase().includes(query) ||
        q.title.toLowerCase().includes(query) ||
        q.id.toLowerCase().includes(query)
      );
    }

    if (this.filterStatus() !== 'all') {
      filtered = filtered.filter(q => q.status === this.filterStatus());
    }

    return filtered;
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      draft: 'status-draft',
      sent: 'status-sent',
      accepted: 'status-accepted',
      rejected: 'status-rejected',
      expired: 'status-expired'
    };
    return classes[status] || '';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      draft: 'Draft',
      sent: 'Sent',
      accepted: 'Accepted',
      rejected: 'Rejected',
      expired: 'Expired'
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

  getStatusCount(status: string): number {
    return this.quotations().filter(q => q.status === status).length;
  }

  getDaysUntilExpiry(validUntil: Date): string {
    const now = new Date();
    const diff = validUntil.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days < 0) return 'Expired';
    if (days === 0) return 'Expires today';
    if (days === 1) return '1 day left';
    return `${days} days left`;
  }

  isExpiringSoon(validUntil: Date): boolean {
    const now = new Date();
    const diff = validUntil.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days <= 7 && days >= 0;
  }
}
