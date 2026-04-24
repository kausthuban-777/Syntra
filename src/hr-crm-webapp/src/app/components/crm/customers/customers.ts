import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { NavigationService } from '../../../services/navigation.service';
import { FormsModule } from '@angular/forms';

interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'vip';
  totalRevenue: number;
  lastPurchase: Date;
  joinedDate: Date;
  address: string;
  industry: string;
  contactPerson: string;
}

interface CustomerStats {
  total: number;
  active: number;
  vip: number;
  totalRevenue: number;
}

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customers.html',
  styleUrl: './customers.css'
})
export class Customers implements OnInit {
  private navigationService = inject(NavigationService);

  customers = signal<Customer[]>([
    {
      id: 'C001',
      name: 'TechCorp Inc',
      company: 'TechCorp Inc',
      email: 'contact@techcorp.com',
      phone: '+1 555-0100',
      status: 'vip',
      totalRevenue: 245000,
      lastPurchase: new Date('2026-04-20'),
      joinedDate: new Date('2024-01-15'),
      address: '123 Tech Street, San Francisco, CA 94105',
      industry: 'Technology',
      contactPerson: 'Sarah Johnson'
    },
    {
      id: 'C002',
      name: 'Digital Solutions',
      company: 'Digital Solutions',
      email: 'info@digitalsol.com',
      phone: '+1 555-0101',
      status: 'active',
      totalRevenue: 128000,
      lastPurchase: new Date('2026-04-18'),
      joinedDate: new Date('2024-03-22'),
      address: '456 Innovation Ave, Austin, TX 78701',
      industry: 'Marketing',
      contactPerson: 'Michael Chen'
    },
    {
      id: 'C003',
      name: 'Global Enterprises',
      company: 'Global Enterprises',
      email: 'contact@globalent.com',
      phone: '+1 555-0102',
      status: 'vip',
      totalRevenue: 387000,
      lastPurchase: new Date('2026-04-22'),
      joinedDate: new Date('2023-11-10'),
      address: '789 Business Blvd, New York, NY 10001',
      industry: 'Finance',
      contactPerson: 'Lisa Anderson'
    },
    {
      id: 'C004',
      name: 'Innovation Labs',
      company: 'Innovation Labs',
      email: 'hello@innovlabs.com',
      phone: '+1 555-0103',
      status: 'active',
      totalRevenue: 95000,
      lastPurchase: new Date('2026-04-15'),
      joinedDate: new Date('2024-06-05'),
      address: '321 Research Park, Boston, MA 02101',
      industry: 'Research',
      contactPerson: 'David Park'
    },
    {
      id: 'C005',
      name: 'CloudTech Systems',
      company: 'CloudTech Systems',
      email: 'support@cloudtech.com',
      phone: '+1 555-0104',
      status: 'active',
      totalRevenue: 156000,
      lastPurchase: new Date('2026-04-19'),
      joinedDate: new Date('2024-02-28'),
      address: '654 Cloud Drive, Seattle, WA 98101',
      industry: 'Cloud Services',
      contactPerson: 'Robert Taylor'
    },
    {
      id: 'C006',
      name: 'StartupHub',
      company: 'StartupHub',
      email: 'team@startuphub.io',
      phone: '+1 555-0105',
      status: 'inactive',
      totalRevenue: 42000,
      lastPurchase: new Date('2026-02-10'),
      joinedDate: new Date('2024-08-12'),
      address: '987 Venture Lane, Denver, CO 80201',
      industry: 'Consulting',
      contactPerson: 'Emily Rodriguez'
    }
  ]);

  stats = signal<CustomerStats>({
    total: 6,
    active: 4,
    vip: 2,
    totalRevenue: 1053000
  });

  selectedCustomer = signal<Customer | null>(null);
  searchQuery = signal('');
  filterStatus = signal<string>('all');
  sortBy = signal<string>('joinedDate');

  ngOnInit() {
    this.navigationService.setCurrentPage('crm');
  }

  get filteredCustomers() {
    let filtered = this.customers();

    if (this.searchQuery()) {
      const query = this.searchQuery().toLowerCase();
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.industry.toLowerCase().includes(query)
      );
    }

    if (this.filterStatus() !== 'all') {
      filtered = filtered.filter(customer => customer.status === this.filterStatus());
    }

    return filtered.sort((a, b) => {
      if (this.sortBy() === 'joinedDate') {
        return b.joinedDate.getTime() - a.joinedDate.getTime();
      }
      if (this.sortBy() === 'revenue') {
        return b.totalRevenue - a.totalRevenue;
      }
      return 0;
    });
  }

  selectCustomer(customer: Customer) {
    this.selectedCustomer.set(customer);
  }

  closeDetails() {
    this.selectedCustomer.set(null);
  }

  updateCustomerStatus(customer: Customer, status: Customer['status']) {
    const updated = this.customers().map(c =>
      c.id === customer.id ? { ...c, status } : c
    );
    this.customers.set(updated);
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      active: 'status-active',
      inactive: 'status-inactive',
      vip: 'status-vip'
    };
    return classes[status] || '';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      active: 'Active',
      inactive: 'Inactive',
      vip: 'VIP'
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

  getRelationshipStrength(customer: Customer): number {
    const daysSinceJoined = Math.floor((new Date().getTime() - customer.joinedDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysSinceLastPurchase = Math.floor((new Date().getTime() - customer.lastPurchase.getTime()) / (1000 * 60 * 60 * 24));

    let strength = 50;

    if (customer.status === 'vip') strength += 30;
    else if (customer.status === 'active') strength += 20;

    if (daysSinceJoined > 365) strength += 10;
    if (daysSinceLastPurchase < 30) strength += 10;
    if (customer.totalRevenue > 200000) strength += 10;

    return Math.min(100, strength);
  }

  getStrengthClass(customer: Customer): string {
    const strength = this.getRelationshipStrength(customer);
    if (strength >= 80) return 'strength-high';
    if (strength >= 50) return 'strength-medium';
    return 'strength-low';
  }
}
