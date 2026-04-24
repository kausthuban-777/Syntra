import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { NavigationService } from '../../../services/navigation.service';

interface Widget {
  id: string;
  title: string;
  type: 'metric' | 'chart' | 'list' | 'progress' | 'table' | 'gauge';
  size: 'small' | 'medium' | 'large' | 'full';
  data: any;
}

interface WidgetTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  type: 'metric' | 'chart' | 'list' | 'progress' | 'table' | 'gauge';
  size: 'small' | 'medium' | 'large' | 'full';
  defaultData: any;
}

interface WidgetCategory {
  id: string;
  name: string;
}

@Component({
  selector: 'app-custom-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-reports.html',
  styleUrl: './custom-reports.css',
})
export class CustomReports implements OnInit {
  private navigationService = inject(NavigationService);

  editMode = signal(false);
  showWidgetLibrary = signal(false);
  selectedCategory = signal('metrics');

  activeWidgets = signal<Widget[]>([
    {
      id: 'w1',
      title: 'Total Revenue',
      type: 'metric',
      size: 'small',
      data: { value: '$1.2M', label: 'This Month', change: 12.5 }
    },
    {
      id: 'w2',
      title: 'Active Deals',
      type: 'metric',
      size: 'small',
      data: { value: '156', label: 'In Pipeline', change: 8.3 }
    },
    {
      id: 'w3',
      title: 'Team Performance',
      type: 'chart',
      size: 'medium',
      data: {
        bars: [
          { label: 'Sales', value: 85, color: '#667eea' },
          { label: 'Marketing', value: 72, color: '#f093fb' },
          { label: 'Support', value: 90, color: '#4facfe' },
          { label: 'Product', value: 78, color: '#43e97b' }
        ]
      }
    },
    {
      id: 'w4',
      title: 'Top Performers',
      type: 'list',
      size: 'medium',
      data: {
        items: [
          { id: '1', icon: '👤', name: 'John Smith', value: '$385K', color: '#667eea' },
          { id: '2', icon: '👤', name: 'Emma Davis', value: '$342K', color: '#f093fb' },
          { id: '3', icon: '👤', name: 'Michael Chen', value: '$298K', color: '#4facfe' }
        ]
      }
    },
    {
      id: 'w5',
      title: 'Goal Progress',
      type: 'progress',
      size: 'medium',
      data: {
        items: [
          { id: '1', label: 'Q1 Revenue', value: 85, color: '#667eea' },
          { id: '2', label: 'New Customers', value: 72, color: '#f093fb' },
          { id: '3', label: 'Product Launches', value: 90, color: '#43e97b' }
        ]
      }
    },
    {
      id: 'w6',
      title: 'Customer Satisfaction',
      type: 'gauge',
      size: 'small',
      data: { value: 87, label: 'Overall Score', color: '#43e97b' }
    }
  ]);

  widgetCategories = signal<WidgetCategory[]>([
    { id: 'metrics', name: 'Metrics' },
    { id: 'charts', name: 'Charts' },
    { id: 'tables', name: 'Tables' },
    { id: 'gauges', name: 'Gauges' }
  ]);

  widgetTemplates = signal<WidgetTemplate[]>([
    {
      id: 'revenue-metric',
      name: 'Revenue Metric',
      description: 'Display total revenue with trend',
      category: 'metrics',
      icon: 'trending-up',
      color: '#667eea',
      type: 'metric',
      size: 'small',
      defaultData: { value: '$0', label: 'Revenue', change: 0 }
    },
    {
      id: 'deals-metric',
      name: 'Deals Count',
      description: 'Show active deals count',
      category: 'metrics',
      icon: 'activity',
      color: '#f093fb',
      type: 'metric',
      size: 'small',
      defaultData: { value: '0', label: 'Deals', change: 0 }
    },
    {
      id: 'team-chart',
      name: 'Team Performance',
      description: 'Bar chart of team metrics',
      category: 'charts',
      icon: 'bar-chart',
      color: '#4facfe',
      type: 'chart',
      size: 'medium',
      defaultData: {
        bars: [
          { label: 'Team A', value: 75, color: '#667eea' },
          { label: 'Team B', value: 60, color: '#f093fb' },
          { label: 'Team C', value: 85, color: '#4facfe' }
        ]
      }
    },
    {
      id: 'top-list',
      name: 'Top Performers',
      description: 'List of top performers',
      category: 'metrics',
      icon: 'users',
      color: '#43e97b',
      type: 'list',
      size: 'medium',
      defaultData: {
        items: [
          { id: '1', icon: '👤', name: 'User 1', value: '$100K', color: '#667eea' },
          { id: '2', icon: '👤', name: 'User 2', value: '$90K', color: '#f093fb' }
        ]
      }
    },
    {
      id: 'progress-goals',
      name: 'Goal Progress',
      description: 'Track goal completion',
      category: 'metrics',
      icon: 'activity',
      color: '#ffa502',
      type: 'progress',
      size: 'medium',
      defaultData: {
        items: [
          { id: '1', label: 'Goal 1', value: 75, color: '#667eea' },
          { id: '2', label: 'Goal 2', value: 60, color: '#f093fb' }
        ]
      }
    },
    {
      id: 'satisfaction-gauge',
      name: 'Satisfaction Score',
      description: 'Gauge chart for scores',
      category: 'gauges',
      icon: 'activity',
      color: '#43e97b',
      type: 'gauge',
      size: 'small',
      defaultData: { value: 75, label: 'Score', color: '#43e97b' }
    },
    {
      id: 'data-table',
      name: 'Data Table',
      description: 'Tabular data display',
      category: 'tables',
      icon: 'bar-chart',
      color: '#667eea',
      type: 'table',
      size: 'large',
      defaultData: {
        columns: ['Name', 'Value', 'Status'],
        rows: [
          ['Item 1', '100', 'Active'],
          ['Item 2', '200', 'Pending'],
          ['Item 3', '150', 'Active']
        ]
      }
    }
  ]);

  ngOnInit() {
    this.navigationService.setCurrentPage('analytics');
  }

  toggleEditMode() {
    this.editMode.update(mode => !mode);
  }

  getFilteredWidgets(): WidgetTemplate[] {
    return this.widgetTemplates().filter(w => w.category === this.selectedCategory());
  }

  addWidget(template: WidgetTemplate) {
    const newWidget: Widget = {
      id: `w${Date.now()}`,
      title: template.name,
      type: template.type,
      size: template.size,
      data: { ...template.defaultData }
    };
    this.activeWidgets.update(widgets => [...widgets, newWidget]);
    this.showWidgetLibrary.set(false);
  }

  removeWidget(id: string) {
    this.activeWidgets.update(widgets => widgets.filter(w => w.id !== id));
  }
}
