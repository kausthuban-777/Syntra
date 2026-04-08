import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import * as echarts from 'echarts';
import gsap from 'gsap';

interface ReportCard {
  title: string;
  value: number;
  change: number;
  icon: string;
  gradient: string;
  color: string;
}

interface EmployeeReport {
  name: string;
  department: string;
  performanceScore: number;
  attendance: number;
  projects: number;
}

interface DealReport {
  stage: string;
  count: number;
  percentage: number;
  value: number;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, NgxEchartsModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class ReportsComponent implements OnInit {
  @ViewChild('statsContainer') statsContainer!: ElementRef;

  selectedPeriod = 'monthly';

  // Report Cards Data
  reportCards: ReportCard[] = [
    {
      title: 'Total Employees',
      value: 284,
      change: 12,
      icon: '👥',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#667eea'
    },
    {
      title: 'Active Deals',
      value: 156,
      change: 8,
      icon: '🤝',
      gradient: 'linear-gradient(135deg, #d946ef 0%, #a855f7 100%)',
      color: '#d946ef'
    },
    {
      title: 'New Leads',
      value: 89,
      change: 23,
      icon: '📊',
      gradient: 'linear-gradient(135deg, #ff8c42 0%, #ff6b35 100%)',
      color: '#ff8c42'
    },
    {
      title: 'Sales Revenue',
      value: 2.4,
      change: 15,
      icon: '💰',
      gradient: 'linear-gradient(135deg, #00B894 0%, #00a86b 100%)',
      color: '#00B894'
    },
    {
      title: 'Recruitment',
      value: 42,
      change: -3,
      icon: '🎯',
      gradient: 'linear-gradient(135deg, #c2185b 0%, #e91e63 100%)',
      color: '#c2185b'
    },
    {
      title: 'Attendance Rate',
      value: 94,
      change: 2,
      icon: '✅',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      color: '#06b6d4'
    }
  ];

  // Employee Performance Data
  employeeReports: EmployeeReport[] = [
    { name: 'James Wilson', department: 'Sales', performanceScore: 92, attendance: 98, projects: 5 },
    { name: 'Sarah Johnson', department: 'HR', performanceScore: 88, attendance: 100, projects: 3 },
    { name: 'Michael Chen', department: 'Engineering', performanceScore: 95, attendance: 96, projects: 8 },
    { name: 'Emily Davis', department: 'Marketing', performanceScore: 85, attendance: 95, projects: 4 },
    { name: 'Robert Brown', department: 'Sales', performanceScore: 89, attendance: 97, projects: 6 }
  ];

  // Deal Pipeline Data
  dealReports: DealReport[] = [
    { stage: 'Prospect', count: 45, percentage: 29, value: 450000 },
    { stage: 'Qualified', count: 38, percentage: 24, value: 760000 },
    { stage: 'Negotiation', count: 35, percentage: 22, value: 1050000 },
    { stage: 'Closed Won', count: 38, percentage: 24, value: 1140000 }
  ];

  // Chart Options
  employeePerformanceChartOptions: EChartsOption = {};
  revenueTrendChartOptions: EChartsOption = {};
  departmentDistributionChartOptions: EChartsOption = {};
  dealPipelineChartOptions: EChartsOption = {};
  attendanceTrendChartOptions: EChartsOption = {};
  hiringSalesChartOptions: EChartsOption = {};

  constructor() {
    this.initializeCharts();
  }

  ngOnInit(): void {
    this.animateStats();
  }

  private initializeCharts(): void {
    // Employee Performance Chart
    this.employeePerformanceChartOptions = {
      color: ['#667eea', '#d946ef', '#ff8c42', '#00B894'],
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: 'transparent',
        textStyle: { color: '#fff' }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: this.employeeReports.map(emp => emp.name.split(' ')[0]),
        axisLine: { lineStyle: { color: '#E5E7EB' } },
        axisLabel: { color: '#6B7280', fontSize: 12 }
      },
      yAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: '#E5E7EB' } },
        axisLabel: { color: '#6B7280', fontSize: 12 },
        splitLine: { lineStyle: { color: '#F3F4F6' } }
      },
      series: [
        {
          name: 'Performance Score',
          data: this.employeeReports.map(emp => emp.performanceScore),
          type: 'bar',
          itemStyle: {
            borderRadius: [8, 8, 0, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#667eea' },
              { offset: 1, color: '#764ba2' }
            ])
          }
        } as any,
        {
          name: 'Attendance Rate',
          data: this.employeeReports.map(emp => emp.attendance),
          type: 'line',
          smooth: true,
          itemStyle: { color: '#00B894' },
          lineStyle: { color: '#00B894', width: 3 }
        } as any
      ],
      legend: {
        data: ['Performance Score', 'Attendance Rate'],
        textStyle: { color: '#6B7280' },
        top: '3%'
      }
    };

    // Revenue Trend Chart
    this.revenueTrendChartOptions = {
      color: ['#d946ef'],
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: 'transparent',
        textStyle: { color: '#fff' }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        axisLine: { lineStyle: { color: '#E5E7EB' } },
        axisLabel: { color: '#6B7280', fontSize: 12 }
      },
      yAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: '#E5E7EB' } },
        axisLabel: { color: '#6B7280', fontSize: 12 },
        splitLine: { lineStyle: { color: '#F3F4F6' } }
      },
      series: [
        {
          name: 'Revenue ($K)',
          data: [320, 380, 420, 510, 680, 720, 850],
          type: 'line',
          smooth: true,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(217, 70, 239, 0.5)' },
              { offset: 1, color: 'rgba(217, 70, 239, 0.05)' }
            ])
          },
          lineStyle: {
            color: '#d946ef',
            width: 3
          },
          itemStyle: { color: '#d946ef', borderRadius: 4 }
        } as any
      ],
      legend: {
        data: ['Revenue ($K)'],
        textStyle: { color: '#6B7280' },
        top: '2%'
      }
    };

    // Department Distribution Chart
    this.departmentDistributionChartOptions = {
      color: ['#667eea', '#d946ef', '#ff8c42', '#00B894', '#06b6d4'],
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: 'transparent',
        textStyle: { color: '#fff' }
      },
      series: [
        {
          name: 'Department Distribution',
          data: [
            { value: 45, name: 'Sales' },
            { value: 38, name: 'Engineering' },
            { value: 32, name: 'Marketing' },
            { value: 28, name: 'HR' },
            { value: 20, name: 'Operations' }
          ],
          type: 'pie',
          radius: ['30%', '70%'],
          itemStyle: {
            borderRadius: 8,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            color: '#6B7280'
          }
        }
      ]
    };

    // Deal Pipeline Chart
    this.dealPipelineChartOptions = {
      color: ['#667eea', '#d946ef', '#ff8c42', '#00B894'],
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: 'transparent',
        textStyle: { color: '#fff' }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: this.dealReports.map(d => d.stage),
        axisLine: { lineStyle: { color: '#E5E7EB' } },
        axisLabel: { color: '#6B7280', fontSize: 12 }
      },
      yAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: '#E5E7EB' } },
        axisLabel: { color: '#6B7280', fontSize: 12 },
        splitLine: { lineStyle: { color: '#F3F4F6' } }
      },
      series: [
        {
          name: 'Deal Count',
          data: this.dealReports.map(d => d.count),
          type: 'bar',
          itemStyle: {
            borderRadius: [8, 8, 0, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#667eea' },
              { offset: 1, color: '#764ba2' }
            ])
          }
        } as any
      ],
      legend: {
        data: ['Deal Count'],
        textStyle: { color: '#6B7280' },
        top: '2%'
      }
    };

    // Attendance Trend Chart
    this.attendanceTrendChartOptions = {
      color: ['#00B894'],
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: 'transparent',
        textStyle: { color: '#fff' }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        axisLine: { lineStyle: { color: '#E5E7EB' } },
        axisLabel: { color: '#6B7280', fontSize: 12 }
      },
      yAxis: {
        type: 'value',
        max: 100,
        axisLine: { lineStyle: { color: '#E5E7EB' } },
        axisLabel: { color: '#6B7280', fontSize: 12 },
        splitLine: { lineStyle: { color: '#F3F4F6' } }
      },
      series: [
        {
          name: 'Attendance %',
          data: [94, 96, 95, 93, 97],
          type: 'line',
          smooth: true,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(0, 184, 148, 0.5)' },
              { offset: 1, color: 'rgba(0, 184, 148, 0.05)' }
            ])
          },
          lineStyle: {
            color: '#00B894',
            width: 3
          },
          itemStyle: { color: '#00B894', borderRadius: 4 }
        } as any
      ],
      legend: {
        data: ['Attendance %'],
        textStyle: { color: '#6B7280' },
        top: '2%'
      }
    };

    // Hiring vs Sales Chart
    this.hiringSalesChartOptions = {
      color: ['#667eea', '#d946ef'],
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: 'transparent',
        textStyle: { color: '#fff' }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['Q1', 'Q2', 'Q3', 'Q4'],
        axisLine: { lineStyle: { color: '#E5E7EB' } },
        axisLabel: { color: '#6B7280', fontSize: 12 }
      },
      yAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: '#E5E7EB' } },
        axisLabel: { color: '#6B7280', fontSize: 12 },
        splitLine: { lineStyle: { color: '#F3F4F6' } }
      },
      series: [
        {
          name: 'Hires',
          data: [25, 32, 28, 35],
          type: 'bar',
          itemStyle: {
            borderRadius: [8, 8, 0, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#667eea' },
              { offset: 1, color: '#764ba2' }
            ])
          }
        } as any,
        {
          name: 'Deals Closed',
          data: [42, 58, 52, 68],
          type: 'bar',
          itemStyle: {
            borderRadius: [8, 8, 0, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#d946ef' },
              { offset: 1, color: '#a855f7' }
            ])
          }
        } as any
      ],
      legend: {
        data: ['Hires', 'Deals Closed'],
        textStyle: { color: '#6B7280' },
        top: '3%'
      }
    };
  }

  private animateStats(): void {
    if (!this.statsContainer) return;

    const cards = this.statsContainer.nativeElement.querySelectorAll('.stat-card');
    cards.forEach((card: HTMLElement, index: number) => {
      const value = card.querySelector('.stat-value') as HTMLElement;
      if (!value) return;

      const finalValue = parseFloat(value.textContent || '0');
      gsap.from(
        { current: 0 },
        {
          current: finalValue,
          duration: 1.5,
          delay: index * 0.1,
          ease: 'power2.out',
          onUpdate: function (this: any) {
            value.textContent = Math.round(this['targets']()[0].current).toString();
          }
        }
      );
    });
  }

  setPeriod(period: string): void {
    this.selectedPeriod = period;
    this.animateStats();
  }

  exportReport(format: string): void {
    console.log('Exporting report as', format);
    // Implementation for exporting report
  }
}

// Alias for backward compatibility
export { ReportsComponent as Reports };
