import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { NavigationService } from '../../../services/navigation.service';

interface RadialMetric {
  id: string;
  label: string;
  value: string;
  percentage: number;
  target: string;
  change: number;
  gradientStart: string;
  gradientEnd: string;
}

interface Department {
  id: string;
  name: string;
  count: number;
  percentage: number;
  color: string;
}

interface AttendanceStatus {
  id: string;
  label: string;
  count: number;
  rate: number;
  color: string;
  bgColor: string;
}

interface PerformanceDept {
  name: string;
  excellent: number;
  good: number;
  average: number;
  needsImprovement: number;
  total: number;
}

interface TurnoverMonth {
  month: string;
  joined: number;
  left: number;
  joinedPercentage: number;
  leftPercentage: number;
}

interface TrainingProgram {
  id: string;
  name: string;
  completed: number;
  total: number;
  percentage: number;
  deadline: string;
}

interface SatisfactionCategory {
  name: string;
  score: number;
  ratings: { [key: number]: number };
}

@Component({
  selector: 'app-hr-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hr-reports.html',
  styleUrl: './hr-reports.css',
})
export class HrReports implements OnInit {
  private navigationService = inject(NavigationService);

  radialMetrics = signal<RadialMetric[]>([
    {
      id: 'headcount',
      label: 'Headcount',
      value: '342',
      percentage: 85,
      target: '400',
      change: 5.2,
      gradientStart: '#667eea',
      gradientEnd: '#764ba2'
    },
    {
      id: 'retention',
      label: 'Retention',
      value: '94.5%',
      percentage: 94.5,
      target: '95%',
      change: 2.1,
      gradientStart: '#f093fb',
      gradientEnd: '#f5576c'
    },
    {
      id: 'satisfaction',
      label: 'Satisfaction',
      value: '4.2/5',
      percentage: 84,
      target: '4.5',
      change: 3.5,
      gradientStart: '#4facfe',
      gradientEnd: '#00f2fe'
    },
    {
      id: 'productivity',
      label: 'Productivity',
      value: '87%',
      percentage: 87,
      target: '90%',
      change: -1.2,
      gradientStart: '#43e97b',
      gradientEnd: '#38f9d7'
    }
  ]);

  departments = signal<Department[]>([
    { id: 'engineering', name: 'Engineering', count: 125, percentage: 36.5, color: '#667eea' },
    { id: 'sales', name: 'Sales', count: 78, percentage: 22.8, color: '#f093fb' },
    { id: 'marketing', name: 'Marketing', count: 52, percentage: 15.2, color: '#4facfe' },
    { id: 'hr', name: 'Human Resources', count: 35, percentage: 10.2, color: '#43e97b' },
    { id: 'finance', name: 'Finance', count: 28, percentage: 8.2, color: '#ffa502' },
    { id: 'operations', name: 'Operations', count: 24, percentage: 7.1, color: '#ff6348' }
  ]);

  attendanceStatus = signal<AttendanceStatus[]>([
    { id: 'present', label: 'Present', count: 318, rate: 93, color: '#43e97b', bgColor: 'rgba(67, 233, 123, 0.1)' },
    { id: 'absent', label: 'Absent', count: 8, rate: 2.3, color: '#ff6348', bgColor: 'rgba(255, 99, 72, 0.1)' },
    { id: 'late', label: 'Late', count: 12, rate: 3.5, color: '#ffa502', bgColor: 'rgba(255, 165, 2, 0.1)' },
    { id: 'leave', label: 'On Leave', count: 4, rate: 1.2, color: '#667eea', bgColor: 'rgba(102, 126, 234, 0.1)' }
  ]);

  performanceByDept = signal<PerformanceDept[]>([
    { name: 'Engineering', excellent: 35, good: 45, average: 15, needsImprovement: 5, total: 125 },
    { name: 'Sales', excellent: 28, good: 42, average: 22, needsImprovement: 8, total: 78 },
    { name: 'Marketing', excellent: 32, good: 48, average: 15, needsImprovement: 5, total: 52 },
    { name: 'HR', excellent: 40, good: 45, average: 12, needsImprovement: 3, total: 35 },
    { name: 'Finance', excellent: 38, good: 42, average: 16, needsImprovement: 4, total: 28 },
    { name: 'Operations', excellent: 30, good: 50, average: 15, needsImprovement: 5, total: 24 }
  ]);

  turnoverData = signal<TurnoverMonth[]>([
    { month: 'Jan', joined: 12, left: 5, joinedPercentage: 80, leftPercentage: 33 },
    { month: 'Feb', joined: 8, left: 3, joinedPercentage: 53, leftPercentage: 20 },
    { month: 'Mar', joined: 15, left: 7, joinedPercentage: 100, leftPercentage: 47 },
    { month: 'Apr', joined: 10, left: 4, joinedPercentage: 67, leftPercentage: 27 },
    { month: 'May', joined: 14, left: 6, joinedPercentage: 93, leftPercentage: 40 },
    { month: 'Jun', joined: 11, left: 5, joinedPercentage: 73, leftPercentage: 33 }
  ]);

  trainingPrograms = signal<TrainingProgram[]>([
    { id: '1', name: 'Leadership Development', completed: 45, total: 50, percentage: 90, deadline: 'May 30' },
    { id: '2', name: 'Technical Skills', completed: 82, total: 100, percentage: 82, deadline: 'Jun 15' },
    { id: '3', name: 'Compliance Training', completed: 120, total: 150, percentage: 80, deadline: 'Jun 30' },
    { id: '4', name: 'Communication Skills', completed: 35, total: 60, percentage: 58, deadline: 'Jul 10' },
    { id: '5', name: 'Project Management', completed: 28, total: 40, percentage: 70, deadline: 'Jul 20' }
  ]);

  satisfactionData = signal<SatisfactionCategory[]>([
    { name: 'Work Environment', score: 4.3, ratings: { 5: 45, 4: 35, 3: 15, 2: 3, 1: 2 } },
    { name: 'Management', score: 4.1, ratings: { 5: 38, 4: 42, 3: 15, 2: 3, 1: 2 } },
    { name: 'Compensation', score: 3.8, ratings: { 5: 28, 4: 38, 3: 25, 2: 7, 1: 2 } },
    { name: 'Work-Life Balance', score: 4.2, ratings: { 5: 42, 4: 38, 3: 15, 2: 3, 1: 2 } },
    { name: 'Career Growth', score: 3.9, ratings: { 5: 32, 4: 40, 3: 20, 2: 6, 1: 2 } },
    { name: 'Team Collaboration', score: 4.4, ratings: { 5: 48, 4: 35, 3: 12, 2: 3, 1: 2 } }
  ]);

  ngOnInit() {
    this.navigationService.setCurrentPage('analytics');
  }

  getTotalEmployees(): number {
    return this.departments().reduce((sum, dept) => sum + dept.count, 0);
  }

  getTrainingColor(percentage: number): string {
    if (percentage >= 80) return 'var(--accent-green)';
    if (percentage >= 60) return 'var(--accent-orange)';
    return 'var(--accent-red)';
  }

  getRatingPercentage(category: SatisfactionCategory, star: number): number {
    const total = Object.values(category.ratings).reduce((sum, count) => sum + count, 0);
    return (category.ratings[star] / total) * 100;
  }

  getRatingCount(category: SatisfactionCategory, star: number): number {
    return category.ratings[star];
  }

  getRatingColor(star: number): string {
    if (star >= 4) return 'var(--accent-green)';
    if (star === 3) return 'var(--accent-orange)';
    return 'var(--accent-red)';
  }
}
