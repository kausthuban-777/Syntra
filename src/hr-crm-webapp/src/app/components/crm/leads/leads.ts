import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { NavigationService } from '../../../services/navigation.service';
import { FormsModule } from '@angular/forms';

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'unqualified';
  source: string;
  value: number;
  assignedTo: string;
  createdAt: Date;
  lastContact?: Date;
  notes: string;
}

interface LeadStats {
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  conversionRate: number;
}

@Component({
  selector: 'app-leads',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './leads.html',
  styleUrl: './leads.css'
})
export class Leads implements OnInit {
  private navigationService = inject(NavigationService);

  leads = signal<Lead[]>([
    {
      id: 'L001',
      name: 'Sarah Johnson',
      company: 'TechCorp Inc',
      email: 'sarah.j@techcorp.com',
      phone: '+1 555-0123',
      status: 'new',
      source: 'Website',
      value: 45000,
      assignedTo: 'John Smith',
      createdAt: new Date('2026-04-20'),
      notes: 'Interested in enterprise plan'
    },
    {
      id: 'L002',
      name: 'Michael Chen',
      company: 'Digital Solutions',
      email: 'mchen@digitalsol.com',
      phone: '+1 555-0124',
      status: 'contacted',
      source: 'Referral',
      value: 32000,
      assignedTo: 'Emma Davis',
      createdAt: new Date('2026-04-18'),
      lastContact: new Date('2026-04-22'),
      notes: 'Follow up next week'
    },
    {
      id: 'L003',
      name: 'Emily Rodriguez',
      company: 'StartupHub',
      email: 'emily@startuphub.io',
      phone: '+1 555-0125',
      status: 'qualified',
      source: 'LinkedIn',
      value: 28000,
      assignedTo: 'John Smith',
      createdAt: new Date('2026-04-15'),
      lastContact: new Date('2026-04-23'),
      notes: 'Ready for proposal'
    },
    {
      id: 'L004',
      name: 'David Park',
      company: 'Innovation Labs',
      email: 'dpark@innovlabs.com',
      phone: '+1 555-0126',
      status: 'contacted',
      source: 'Cold Call',
      value: 52000,
      assignedTo: 'Emma Davis',
      createdAt: new Date('2026-04-19'),
      lastContact: new Date('2026-04-21'),
      notes: 'Needs custom integration'
    },
    {
      id: 'L005',
      name: 'Lisa Anderson',
      company: 'Global Enterprises',
      email: 'landerson@globalent.com',
      phone: '+1 555-0127',
      status: 'new',
      source: 'Trade Show',
      value: 67000,
      assignedTo: 'John Smith',
      createdAt: new Date('2026-04-22'),
      notes: 'Met at conference'
    },
    {
      id: 'L006',
      name: 'Robert Taylor',
      company: 'CloudTech Systems',
      email: 'rtaylor@cloudtech.com',
      phone: '+1 555-0128',
      status: 'qualified',
      source: 'Website',
      value: 41000,
      assignedTo: 'Emma Davis',
      createdAt: new Date('2026-04-17'),
      lastContact: new Date('2026-04-24'),
      notes: 'Budget approved'
    }
  ]);

  stats = signal<LeadStats>({
    total: 6,
    new: 2,
    contacted: 2,
    qualified: 2,
    conversionRate: 33.3
  });

  selectedLead = signal<Lead | null>(null);
  showAddModal = signal(false);
  searchQuery = signal('');
  filterStatus = signal<string>('all');
  sortBy = signal<string>('createdAt');

  ngOnInit() {
    this.navigationService.setCurrentPage('crm');
  }

  get filteredLeads() {
    let filtered = this.leads();

    if (this.searchQuery()) {
      const query = this.searchQuery().toLowerCase();
      filtered = filtered.filter(lead =>
        lead.name.toLowerCase().includes(query) ||
        lead.company.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query)
      );
    }

    if (this.filterStatus() !== 'all') {
      filtered = filtered.filter(lead => lead.status === this.filterStatus());
    }

    return filtered.sort((a, b) => {
      if (this.sortBy() === 'createdAt') {
        return b.createdAt.getTime() - a.createdAt.getTime();
      }
      if (this.sortBy() === 'value') {
        return b.value - a.value;
      }
      return 0;
    });
  }

  selectLead(lead: Lead) {
    this.selectedLead.set(lead);
  }

  closeDetails() {
    this.selectedLead.set(null);
  }

  openAddModal() {
    this.showAddModal.set(true);
  }

  closeAddModal() {
    this.showAddModal.set(false);
  }

  updateLeadStatus(lead: Lead, status: Lead['status']) {
    const updated = this.leads().map(l =>
      l.id === lead.id ? { ...l, status } : l
    );
    this.leads.set(updated);
  }

  deleteLead(leadId: string) {
    if (confirm('Are you sure you want to delete this lead?')) {
      this.leads.set(this.leads().filter(l => l.id !== leadId));
      this.closeDetails();
    }
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      new: 'status-new',
      contacted: 'status-contacted',
      qualified: 'status-qualified',
      unqualified: 'status-unqualified'
    };
    return classes[status] || '';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      new: 'New',
      contacted: 'Contacted',
      qualified: 'Qualified',
      unqualified: 'Unqualified'
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
}
