import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { NavigationService } from '../../../services/navigation.service';
import { FormsModule } from '@angular/forms';

interface Deal {
  id: string;
  title: string;
  customer: string;
  value: number;
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  probability: number;
  expectedCloseDate: Date;
  owner: string;
  createdAt: Date;
  lastActivity: Date;
  notes: string;
}

interface DealStats {
  total: number;
  active: number;
  won: number;
  totalValue: number;
  avgDealSize: number;
}

@Component({
  selector: 'app-deals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './deals.html',
  styleUrl: './deals.css'
})
export class Deals implements OnInit {
  private navigationService = inject(NavigationService);

  deals = signal<Deal[]>([
    {
      id: 'D001',
      title: 'Enterprise Software License',
      customer: 'TechCorp Inc',
      value: 125000,
      stage: 'negotiation',
      probability: 75,
      expectedCloseDate: new Date('2026-05-15'),
      owner: 'John Smith',
      createdAt: new Date('2026-03-10'),
      lastActivity: new Date('2026-04-23'),
      notes: 'Final pricing discussion scheduled'
    },
    {
      id: 'D002',
      title: 'Cloud Migration Project',
      customer: 'Digital Solutions',
      value: 85000,
      stage: 'proposal',
      probability: 60,
      expectedCloseDate: new Date('2026-05-20'),
      owner: 'Emma Davis',
      createdAt: new Date('2026-03-15'),
      lastActivity: new Date('2026-04-22'),
      notes: 'Proposal sent, awaiting feedback'
    },
    {
      id: 'D003',
      title: 'Annual Support Contract',
      customer: 'Global Enterprises',
      value: 45000,
      stage: 'closed-won',
      probability: 100,
      expectedCloseDate: new Date('2026-04-20'),
      owner: 'John Smith',
      createdAt: new Date('2026-02-05'),
      lastActivity: new Date('2026-04-20'),
      notes: 'Contract signed and executed'
    },
    {
      id: 'D004',
      title: 'Custom Integration',
      customer: 'Innovation Labs',
      value: 62000,
      stage: 'qualification',
      probability: 40,
      expectedCloseDate: new Date('2026-06-10'),
      owner: 'Emma Davis',
      createdAt: new Date('2026-04-01'),
      lastActivity: new Date('2026-04-21'),
      notes: 'Technical requirements gathering'
    },
    {
      id: 'D005',
      title: 'Platform Upgrade',
      customer: 'CloudTech Systems',
      value: 95000,
      stage: 'prospecting',
      probability: 25,
      expectedCloseDate: new Date('2026-07-01'),
      owner: 'John Smith',
      createdAt: new Date('2026-04-18'),
      lastActivity: new Date('2026-04-24'),
      notes: 'Initial discovery call completed'
    }
  ]);

  stats = signal<DealStats>({
    total: 5,
    active: 4,
    won: 1,
    totalValue: 412000,
    avgDealSize: 82400
  });

  selectedDeal = signal<Deal | null>(null);
  searchQuery = signal('');
  filterStage = signal<string>('all');
  sortBy = signal<string>('value');

  ngOnInit() {
    this.navigationService.setCurrentPage('crm');
  }

  get filteredDeals() {
    let filtered = this.deals();

    if (this.searchQuery()) {
      const query = this.searchQuery().toLowerCase();
      filtered = filtered.filter(deal =>
        deal.title.toLowerCase().includes(query) ||
        deal.customer.toLowerCase().includes(query)
      );
    }

    if (this.filterStage() !== 'all') {
      filtered = filtered.filter(deal => deal.stage === this.filterStage());
    }

    return filtered.sort((a, b) => {
      if (this.sortBy() === 'value') {
        return b.value - a.value;
      }
      if (this.sortBy() === 'probability') {
        return b.probability - a.probability;
      }
      return 0;
    });
  }

  selectDeal(deal: Deal) {
    this.selectedDeal.set(deal);
  }

  closeDetails() {
    this.selectedDeal.set(null);
  }

  updateDealStage(deal: Deal, stage: Deal['stage']) {
    const updated = this.deals().map(d =>
      d.id === deal.id ? { ...d, stage } : d
    );
    this.deals.set(updated);
  }

  getStageClass(stage: string): string {
    const classes: Record<string, string> = {
      prospecting: 'stage-prospecting',
      qualification: 'stage-qualification',
      proposal: 'stage-proposal',
      negotiation: 'stage-negotiation',
      'closed-won': 'stage-won',
      'closed-lost': 'stage-lost'
    };
    return classes[stage] || '';
  }

  getStageLabel(stage: string): string {
    const labels: Record<string, string> = {
      prospecting: 'Prospecting',
      qualification: 'Qualification',
      proposal: 'Proposal',
      negotiation: 'Negotiation',
      'closed-won': 'Closed Won',
      'closed-lost': 'Closed Lost'
    };
    return labels[stage] || stage;
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

  getDealIntensity(deal: Deal): number {
    const maxValue = Math.max(...this.deals().map(d => d.value));
    return (deal.value / maxValue) * 100;
  }
}
