import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { NavigationService } from '../../../services/navigation.service';

interface Metric {
  id: string;
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down';
  comparison: string;
  color: string;
  sparklineData: number[];
  sparklineColor: string;
  sparklineFill: string;
  format: 'currency' | 'number' | 'percentage';
}

interface RevenueSegment {
  id: string;
  label: string;
  value: number;
  percentage: number;
  color: string;
}

interface Performer {
  id: string;
  name: string;
  initials: string;
  deals: number;
  value: number;
  progress: number;
  avatarColor: string;
  progressColor: string;
}

interface VelocityStage {
  name: string;
  fast: number;
  normal: number;
  slow: number;
  avgDays: number;
}

interface FunnelStage {
  name: string;
  count: number;
  percentage: number;
  conversionRate: number;
}

interface ForecastMonth {
  month: string;
  actual: number;
  projected: number;
  actualPercentage: number;
  projectedPercentage: number;
}

@Component({
  selector: 'app-sales-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sales-reports.html',
  styleUrl: './sales-reports.css',
})
export class SalesReports implements OnInit {
  private navigationService = inject(NavigationService);

  selectedRange = signal<string>('month');
  forecastView = signal<string>('realistic');

  metrics = signal<Metric[]>([
    {
      id: 'revenue',
      label: 'Total Revenue',
      value: 1245000,
      change: 12.5,
      trend: 'up',
      comparison: 'vs last month',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      sparklineData: [45, 52, 48, 58, 55, 62, 68, 65, 72, 78, 75, 82],
      sparklineColor: '#667eea',
      sparklineFill: 'url(#gradient-revenue)',
      format: 'currency'
    },
    {
      id: 'deals',
      label: 'Closed Deals',
      value: 156,
      change: 8.3,
      trend: 'up',
      comparison: 'vs last month',
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      sparklineData: [12, 15, 14, 18, 16, 19, 22, 20, 24, 26, 25, 28],
      sparklineColor: '#f093fb',
      sparklineFill: 'url(#gradient-deals)',
      format: 'number'
    },
    {
      id: 'conversion',
      label: 'Conversion Rate',
      value: 24.8,
      change: 3.2,
      trend: 'up',
      comparison: 'vs last month',
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      sparklineData: [18, 19, 20, 21, 20, 22, 23, 22, 24, 25, 24, 26],
      sparklineColor: '#4facfe',
      sparklineFill: 'url(#gradient-conversion)',
      format: 'percentage'
    },
    {
      id: 'pipeline',
      label: 'Pipeline Value',
      value: 3450000,
      change: -2.1,
      trend: 'down',
      comparison: 'vs last month',
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      sparklineData: [85, 88, 86, 90, 87, 89, 85, 83, 86, 84, 82, 80],
      sparklineColor: '#43e97b',
      sparklineFill: 'url(#gradient-pipeline)',
      format: 'currency'
    }
  ]);

  revenueSegments = signal<RevenueSegment[]>([
    { id: 'enterprise', label: 'Enterprise', value: 620000, percentage: 49.8, color: '#667eea' },
    { id: 'mid-market', label: 'Mid-Market', value: 374000, percentage: 30.0, color: '#f093fb' },
    { id: 'small-business', label: 'Small Business', value: 186000, percentage: 14.9, color: '#4facfe' },
    { id: 'startup', label: 'Startup', value: 65000, percentage: 5.3, color: '#43e97b' }
  ]);

  topPerformers = signal<Performer[]>([
    { id: '1', name: 'John Smith', initials: 'JS', deals: 42, value: 385000, progress: 96, avatarColor: '#667eea', progressColor: '#667eea' },
    { id: '2', name: 'Emma Davis', initials: 'ED', deals: 38, value: 342000, progress: 85, avatarColor: '#f093fb', progressColor: '#f093fb' },
    { id: '3', name: 'Michael Chen', initials: 'MC', deals: 35, value: 298000, progress: 74, avatarColor: '#4facfe', progressColor: '#4facfe' },
    { id: '4', name: 'Sarah Johnson', initials: 'SJ', deals: 28, value: 245000, progress: 61, avatarColor: '#43e97b', progressColor: '#43e97b' },
    { id: '5', name: 'David Wilson', initials: 'DW', deals: 13, value: 125000, progress: 31, avatarColor: '#ffa502', progressColor: '#ffa502' }
  ]);

  velocityData = signal<VelocityStage[]>([
    { name: 'Prospecting', fast: 35, normal: 45, slow: 20, avgDays: 12 },
    { name: 'Qualification', fast: 25, normal: 50, slow: 25, avgDays: 18 },
    { name: 'Proposal', fast: 40, normal: 40, slow: 20, avgDays: 7 },
    { name: 'Negotiation', fast: 50, normal: 35, slow: 15, avgDays: 5 },
    { name: 'Closing', fast: 60, normal: 30, slow: 10, avgDays: 3 }
  ]);

  funnelData = signal<FunnelStage[]>([
    { name: 'Leads', count: 1250, percentage: 100, conversionRate: 100 },
    { name: 'Qualified', count: 625, percentage: 80, conversionRate: 50 },
    { name: 'Proposal', count: 312, percentage: 60, conversionRate: 50 },
    { name: 'Negotiation', count: 187, percentage: 40, conversionRate: 60 },
    { name: 'Closed', count: 156, percentage: 25, conversionRate: 83 }
  ]);

  forecastData = signal<ForecastMonth[]>([
    { month: 'Jan', actual: 980000, projected: 950000, actualPercentage: 78, projectedPercentage: 76 },
    { month: 'Feb', actual: 1050000, projected: 1020000, actualPercentage: 84, projectedPercentage: 81 },
    { month: 'Mar', actual: 1120000, projected: 1100000, actualPercentage: 89, projectedPercentage: 88 },
    { month: 'Apr', actual: 1245000, projected: 1180000, actualPercentage: 99, projectedPercentage: 94 },
    { month: 'May', actual: 0, projected: 1280000, actualPercentage: 0, projectedPercentage: 100 },
    { month: 'Jun', actual: 0, projected: 1350000, actualPercentage: 0, projectedPercentage: 100 }
  ]);

  ngOnInit() {
    this.navigationService.setCurrentPage('analytics');
  }

  formatMetricValue(metric: Metric): string {
    if (metric.format === 'currency') {
      return this.formatCurrency(metric.value);
    } else if (metric.format === 'percentage') {
      return `${metric.value}%`;
    }
    return metric.value.toLocaleString();
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  }

  generateSparkline(data: number[]): string {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    const width = 100 / (data.length - 1);

    return data.map((value, index) => {
      const x = index * width;
      const y = 30 - ((value - min) / range) * 30;
      return `${x},${y}`;
    }).join(' ');
  }

  selectSegment(segment: RevenueSegment) {
    console.log('Selected segment:', segment);
  }

  getFunnelColor(index: number): string {
    const colors = ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#ffa502'];
    return colors[index] || '#667eea';
  }
}
