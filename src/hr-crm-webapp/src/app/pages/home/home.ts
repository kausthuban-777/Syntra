import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';

interface KPICard {
  count: number;
  title: string;
  subtitle: string;
  percentage: number;
  icon: string;
  gradient: string;
}

interface ChartData {
  labels: string[];
  values: number[];
}

interface Interview {
  title: string;
  time: string;
  icon: string;
}

interface Task {
  id: number;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface DailyItem {
  label: string;
  value: string;
  bgColor: string;
  textColor: string;
}

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private navigationService = inject(NavigationService);
  userGreeting = 'Sarah';
  currentDate = this.getFormattedDate();

  // KPI Cards Data
  kpiCards: KPICard[] = [
    {
      count: 45,
      title: 'New Leads',
      subtitle: 'This Week',
      percentage: 29,
      icon: '📊',
      gradient: 'var(--gradient-primary)'
    },
    {
      count: 22,
      title: 'Active Deals',
      subtitle: 'This Week',
      percentage: 9,
      icon: '🤝',
      gradient: 'linear-gradient(135deg, #d946ef 0%, #a855f7 100%)'
    },
    {
      count: 8,
      title: 'Open Positions',
      subtitle: 'New',
      percentage: 1,
      icon: '👥',
      gradient: 'linear-gradient(135deg, #ff8c42 0%, #ff6b35 100%)'
    },
    {
      count: 14,
      title: 'Pending Tickets',
      subtitle: 'New',
      percentage: 7,
      icon: '🎫',
      gradient: 'linear-gradient(135deg, #c2185b 0%, #d946ef 100%)'
    }
  ];

  // Sales Pipeline Chart Data
  salesPipelineData: ChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed'],
    values: [180, 240, 200, 150, 180, 220, 180, 200, 280, 320]
  };

  // Employee Overview Stats
  employeeStats = {
    total: 120,
    commission: 8,
    redLogo: 5
  };

  // Upcoming Interviews
  upcomingInterviews: Interview[] = [
    {
      title: 'UX Design Dos',
      time: '2:00 PM',
      icon: '🎨'
    },
    {
      title: 'Sales Manager',
      time: '2:00 PM',
      icon: '💼'
    }
  ];

  // Daily List (OPr counts)
  dailyList: DailyItem[] = [
    {
      label: 'Employer: Sothis',
      value: '🟨',
      bgColor: '#FFF4E6',
      textColor: '#E67E22'
    },
    {
      label: 'Relacing: Payroll',
      value: '🟩',
      bgColor: '#E8FFF5',
      textColor: '#00B894'
    }
  ];

  // Task List
  taskList: Task[] = [
    {
      id: 1,
      title: 'Prepare Monthly Report.',
      completed: false,
      priority: 'high'
    },
    {
      id: 2,
      title: 'Follow up with Clients',
      completed: false,
      priority: 'high'
    },
    {
      id: 3,
      title: 'Review Payroll Data',
      completed: false,
      priority: 'medium'
    }
  ];

  ngOnInit() {
    this.navigationService.setCurrentPage('home');
    // TODO: Replace with backend API calls
    // this.loadDashboardData();
  }

  getFormattedDate(): string {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  }

  toggleTask(task: Task) {
    task.completed = !task.completed;
    // TODO: Send update to backend
  }

  addNewTask() {
    const newTask: Task = {
      id: this.taskList.length + 1,
      title: '',
      completed: false,
      priority: 'medium'
    };
    this.taskList.push(newTask);
    // TODO: Send to backend
  }

  // Backend integration methods (to be implemented)
  loadDashboardData() {
    // TODO: Replace with actual backend calls
    // this.dashboardService.getKPIs().subscribe(data => this.kpiCards = data);
    // this.dashboardService.getSalesPipeline().subscribe(data => this.salesPipelineData = data);
    // this.dashboardService.getEmployeeStats().subscribe(data => this.employeeStats = data);
    // this.dashboardService.getTasks().subscribe(data => this.taskList = data);
    // this.dashboardService.getInterviews().subscribe(data => this.upcomingInterviews = data);
  }

  getPriorityClass(priority: string): string {
    return `priority-${priority}`;
  }
}
