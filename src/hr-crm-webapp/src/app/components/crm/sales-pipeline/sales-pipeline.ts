import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { NavigationService } from '../../../services/navigation.service';

interface PipelineStage {
  name: string;
  deals: PipelineDeal[];
  totalValue: number;
  count: number;
  conversionRate?: number;
  avgDaysInStage?: number;
}

interface PipelineDeal {
  id: string;
  title: string;
  customer: string;
  value: number;
  probability: number;
  owner: string;
  daysInStage?: number;
}

@Component({
  selector: 'app-sales-pipeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sales-pipeline.html',
  styleUrl: './sales-pipeline.css'
})
export class SalesPipeline implements OnInit {
  private navigationService = inject(NavigationService);

  pipeline = signal<PipelineStage[]>([
    {
      name: 'Prospecting',
      count: 3,
      totalValue: 185000,
      conversionRate: 67,
      avgDaysInStage: 12,
      deals: [
        { id: 'D005', title: 'Platform Upgrade', customer: 'CloudTech Systems', value: 95000, probability: 25, owner: 'John Smith', daysInStage: 8 },
        { id: 'D006', title: 'Consulting Services', customer: 'StartupHub', value: 45000, probability: 20, owner: 'Emma Davis', daysInStage: 15 },
        { id: 'D007', title: 'Training Program', customer: 'Innovation Labs', value: 45000, probability: 30, owner: 'John Smith', daysInStage: 10 }
      ]
    },
    {
      name: 'Qualification',
      count: 2,
      totalValue: 107000,
      conversionRate: 50,
      avgDaysInStage: 18,
      deals: [
        { id: 'D004', title: 'Custom Integration', customer: 'Innovation Labs', value: 62000, probability: 40, owner: 'Emma Davis', daysInStage: 22 },
        { id: 'D008', title: 'API Development', customer: 'Digital Solutions', value: 45000, probability: 35, owner: 'John Smith', daysInStage: 14 }
      ]
    },
    {
      name: 'Proposal',
      count: 1,
      totalValue: 85000,
      conversionRate: 100,
      avgDaysInStage: 7,
      deals: [
        { id: 'D002', title: 'Cloud Migration Project', customer: 'Digital Solutions', value: 85000, probability: 60, owner: 'Emma Davis', daysInStage: 7 }
      ]
    },
    {
      name: 'Negotiation',
      count: 2,
      totalValue: 195000,
      conversionRate: 50,
      avgDaysInStage: 5,
      deals: [
        { id: 'D001', title: 'Enterprise Software License', customer: 'TechCorp Inc', value: 125000, probability: 75, owner: 'John Smith', daysInStage: 4 },
        { id: 'D009', title: 'Security Audit', customer: 'Global Enterprises', value: 70000, probability: 70, owner: 'Emma Davis', daysInStage: 6 }
      ]
    },
    {
      name: 'Closed Won',
      count: 1,
      totalValue: 45000,
      conversionRate: 100,
      avgDaysInStage: 0,
      deals: [
        { id: 'D003', title: 'Annual Support Contract', customer: 'Global Enterprises', value: 45000, probability: 100, owner: 'John Smith', daysInStage: 0 }
      ]
    }
  ]);

  totalPipelineValue = signal(617000);
  totalDeals = signal(9);
  avgDealSize = signal(68556);
  winRate = signal(11);
  selectedDeal = signal<PipelineDeal | null>(null);

  ngOnInit() {
    this.navigationService.setCurrentPage('crm');
  }

  selectDeal(deal: PipelineDeal) {
    this.selectedDeal.set(deal);
  }

  closeDetails() {
    this.selectedDeal.set(null);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  }

  getVelocityClass(days: number): string {
    if (days <= 7) return 'velocity-fast';
    if (days <= 14) return 'velocity-normal';
    return 'velocity-slow';
  }

  getConversionClass(rate: number): string {
    if (rate >= 75) return 'conversion-high';
    if (rate >= 50) return 'conversion-medium';
    return 'conversion-low';
  }
}
