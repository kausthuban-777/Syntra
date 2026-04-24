import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { NavigationService } from '../../../services/navigation.service';

interface KPIMetric {
  id: string;
  label: string;
  value: string;
  sublabel: string;
  trend: number;
  color: string;
  iconBg: string;
}

interface FunnelStage {
  id: string;
  name: string;
  count: number;
  percentage: number;
  widthPercentage: number;
  conversionRate: number;
  color: string;
}

interface SourceData {
  id: string;
  name: string;
  applications: number;
  hired: number;
  quality: number;
  costPerHire: number;
  avgTime: number;
  color: string;
}

interface InterviewStage {
  id: string;
  name: string;
  scheduled: number;
  completed: number;
  passed: number;
  passRate: number;
}

interface DepartmentHiring {
  id: string;
  name: string;
  hired: number;
  target: number;
  openPositions: number;
  status: string;
  color: string;
}

interface ExperienceMetric {
  id: string;
  name: string;
  score: number;
}

interface TimelineWeek {
  week: string;
  hired: number;
  inProgress: number;
  rejected: number;
  hiredPercentage: number;
  inProgressPercentage: number;
  rejectedPercentage: number;
}

@Component({
  selector: 'app-recruitment-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recruitment-reports.html',
  styleUrl: './recruitment-reports.css',
})
export class RecruitmentReports implements OnInit {
  private navigationService = inject(NavigationService);

  kpiMetrics = signal<KPIMetric[]>([
    {
      id: 'applications',
      label: 'Total Applications',
      value: '1,247',
      sublabel: 'This month',
      trend: 15.3,
      color: '#667eea',
      iconBg: 'rgba(102, 126, 234, 0.1)'
    },
    {
      id: 'interviews',
      label: 'Interviews Scheduled',
      value: '342',
      sublabel: 'This month',
      trend: 8.7,
      color: '#f093fb',
      iconBg: 'rgba(240, 147, 251, 0.1)'
    },
    {
      id: 'offers',
      label: 'Offers Extended',
      value: '45',
      sublabel: 'This month',
      trend: 12.5,
      color: '#43e97b',
      iconBg: 'rgba(67, 233, 123, 0.1)'
    },
    {
      id: 'time-to-hire',
      label: 'Avg Time to Hire',
      value: '28 days',
      sublabel: 'Down from 32',
      trend: -12.5,
      color: '#4facfe',
      iconBg: 'rgba(79, 172, 254, 0.1)'
    }
  ]);

  funnelStages = signal<FunnelStage[]>([
    { id: 'applied', name: 'Applied', count: 1247, percentage: 100, widthPercentage: 100, conversionRate: 27, color: '#667eea' },
    { id: 'screening', name: 'Screening', count: 342, percentage: 27, widthPercentage: 85, conversionRate: 65, color: '#f093fb' },
    { id: 'interview', name: 'Interview', count: 223, percentage: 18, widthPercentage: 70, conversionRate: 45, color: '#4facfe' },
    { id: 'assessment', name: 'Assessment', count: 100, percentage: 8, widthPercentage: 55, conversionRate: 60, color: '#43e97b' },
    { id: 'offer', name: 'Offer', count: 60, percentage: 5, widthPercentage: 40, conversionRate: 75, color: '#ffa502' },
    { id: 'hired', name: 'Hired', count: 45, percentage: 4, widthPercentage: 30, conversionRate: 100, color: '#38f9d7' }
  ]);

  sourcesData = signal<SourceData[]>([
    { id: 'linkedin', name: 'LinkedIn', applications: 485, hired: 18, quality: 85, costPerHire: 3200, avgTime: 25, color: '#0077b5' },
    { id: 'referral', name: 'Employee Referral', applications: 156, hired: 12, quality: 92, costPerHire: 1500, avgTime: 22, color: '#43e97b' },
    { id: 'job-board', name: 'Job Boards', applications: 342, hired: 8, quality: 68, costPerHire: 2800, avgTime: 32, color: '#f093fb' },
    { id: 'career-page', name: 'Career Page', applications: 189, hired: 5, quality: 75, costPerHire: 1200, avgTime: 28, color: '#4facfe' },
    { id: 'agency', name: 'Recruitment Agency', applications: 75, hired: 2, quality: 58, costPerHire: 5500, avgTime: 35, color: '#ffa502' }
  ]);

  interviewStages = signal<InterviewStage[]>([
    { id: 'phone', name: 'Phone Screen', scheduled: 342, completed: 320, passed: 223, passRate: 70 },
    { id: 'technical', name: 'Technical Interview', scheduled: 223, completed: 210, passed: 145, passRate: 69 },
    { id: 'behavioral', name: 'Behavioral Interview', scheduled: 145, completed: 138, passed: 100, passRate: 72 },
    { id: 'final', name: 'Final Round', scheduled: 100, completed: 95, passed: 60, passRate: 63 }
  ]);

  hiringByDept = signal<DepartmentHiring[]>([
    { id: 'eng', name: 'Engineering', hired: 18, target: 25, openPositions: 7, status: 'On Track', color: '#667eea' },
    { id: 'sales', name: 'Sales', hired: 12, target: 15, openPositions: 3, status: 'On Track', color: '#f093fb' },
    { id: 'marketing', name: 'Marketing', hired: 6, target: 10, openPositions: 4, status: 'Behind', color: '#4facfe' },
    { id: 'product', name: 'Product', hired: 5, target: 8, openPositions: 3, status: 'On Track', color: '#43e97b' },
    { id: 'design', name: 'Design', hired: 4, target: 5, openPositions: 1, status: 'Ahead', color: '#ffa502' }
  ]);

  experienceScore = signal(87);

  experienceMetrics = signal<ExperienceMetric[]>([
    { id: 'communication', name: 'Communication', score: 92 },
    { id: 'process', name: 'Process Clarity', score: 85 },
    { id: 'timeline', name: 'Timeline Adherence', score: 88 },
    { id: 'feedback', name: 'Feedback Quality', score: 82 },
    { id: 'overall', name: 'Overall Satisfaction', score: 87 }
  ]);

  timelineData = signal<TimelineWeek[]>([
    { week: 'Week 1', hired: 8, inProgress: 45, rejected: 12, hiredPercentage: 53, inProgressPercentage: 100, rejectedPercentage: 40 },
    { week: 'Week 2', hired: 12, inProgress: 38, rejected: 15, hiredPercentage: 80, inProgressPercentage: 84, rejectedPercentage: 50 },
    { week: 'Week 3', hired: 10, inProgress: 42, rejected: 18, hiredPercentage: 67, inProgressPercentage: 93, rejectedPercentage: 60 },
    { week: 'Week 4', hired: 15, inProgress: 35, rejected: 10, hiredPercentage: 100, inProgressPercentage: 78, rejectedPercentage: 33 }
  ]);

  ngOnInit() {
    this.navigationService.setCurrentPage('analytics');
  }

  getTotalCandidates(): number {
    return this.funnelStages()[0].count;
  }

  getOverallConversion(): number {
    const stages = this.funnelStages();
    return Math.round((stages[stages.length - 1].count / stages[0].count) * 100);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  }

  getExperienceColor(score: number): string {
    if (score >= 85) return 'var(--accent-green)';
    if (score >= 70) return 'var(--accent-orange)';
    return 'var(--accent-red)';
  }
}
