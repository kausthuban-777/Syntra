import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

interface Ticket {
  id: string;
  subject: string;
  customer: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee: string;
  createdAt: Date;
  updatedAt: Date;
  category: string;
  tags: string[];
  unreadCount?: number;
}

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ticket-list.html',
  styleUrl: './ticket-list.css'
})
export class TicketList implements OnInit {
  tickets: Ticket[] = [
    {
      id: 'TKT-1001',
      subject: 'Unable to access dashboard after login',
      customer: 'Sarah Johnson',
      status: 'open',
      priority: 'urgent',
      assignee: 'John Doe',
      createdAt: new Date('2024-04-24T09:30:00'),
      updatedAt: new Date('2024-04-24T10:15:00'),
      category: 'Technical',
      tags: ['login', 'dashboard', 'access'],
      unreadCount: 3
    },
    {
      id: 'TKT-1002',
      subject: 'Payment processing failed for invoice #4521',
      customer: 'Michael Chen',
      status: 'in-progress',
      priority: 'high',
      assignee: 'Emma Wilson',
      createdAt: new Date('2024-04-24T08:45:00'),
      updatedAt: new Date('2024-04-24T11:20:00'),
      category: 'Billing',
      tags: ['payment', 'invoice', 'urgent'],
      unreadCount: 1
    },
    {
      id: 'TKT-1003',
      subject: 'Request for feature: Export reports to PDF',
      customer: 'Lisa Anderson',
      status: 'open',
      priority: 'medium',
      assignee: 'Alex Martinez',
      createdAt: new Date('2024-04-23T14:20:00'),
      updatedAt: new Date('2024-04-24T09:00:00'),
      category: 'Feature Request',
      tags: ['export', 'reports', 'pdf']
    },
    {
      id: 'TKT-1004',
      subject: 'Account settings not saving changes',
      customer: 'David Brown',
      status: 'in-progress',
      priority: 'high',
      assignee: 'John Doe',
      createdAt: new Date('2024-04-23T16:10:00'),
      updatedAt: new Date('2024-04-24T08:30:00'),
      category: 'Technical',
      tags: ['settings', 'account', 'bug'],
      unreadCount: 2
    },
    {
      id: 'TKT-1005',
      subject: 'How to integrate with third-party API?',
      customer: 'Jennifer Lee',
      status: 'resolved',
      priority: 'medium',
      assignee: 'Emma Wilson',
      createdAt: new Date('2024-04-22T11:30:00'),
      updatedAt: new Date('2024-04-23T15:45:00'),
      category: 'Integration',
      tags: ['api', 'integration', 'documentation']
    },
    {
      id: 'TKT-1006',
      subject: 'Slow performance on mobile app',
      customer: 'Robert Taylor',
      status: 'open',
      priority: 'low',
      assignee: 'Alex Martinez',
      createdAt: new Date('2024-04-22T09:15:00'),
      updatedAt: new Date('2024-04-23T10:00:00'),
      category: 'Performance',
      tags: ['mobile', 'performance', 'optimization']
    },
    {
      id: 'TKT-1007',
      subject: 'Data export contains incorrect information',
      customer: 'Amanda White',
      status: 'in-progress',
      priority: 'urgent',
      assignee: 'John Doe',
      createdAt: new Date('2024-04-24T07:00:00'),
      updatedAt: new Date('2024-04-24T11:45:00'),
      category: 'Data',
      tags: ['export', 'data', 'accuracy'],
      unreadCount: 4
    },
    {
      id: 'TKT-1008',
      subject: 'Request to upgrade subscription plan',
      customer: 'Chris Martinez',
      status: 'resolved',
      priority: 'low',
      assignee: 'Emma Wilson',
      createdAt: new Date('2024-04-21T13:20:00'),
      updatedAt: new Date('2024-04-22T16:30:00'),
      category: 'Billing',
      tags: ['subscription', 'upgrade', 'billing']
    }
  ];

  filteredTickets: Ticket[] = [];
  selectedStatus: string = 'all';
  selectedPriority: string = 'all';
  searchQuery: string = '';
  sortBy: 'date' | 'priority' | 'status' = 'date';
  viewMode: 'list' | 'grid' = 'list';

  statusCounts = {
    all: 0,
    open: 0,
    'in-progress': 0,
    resolved: 0,
    closed: 0
  };

  ngOnInit() {
    this.calculateStatusCounts();
    this.applyFilters();
  }

  calculateStatusCounts() {
    this.statusCounts.all = this.tickets.length;
    this.statusCounts.open = this.tickets.filter(t => t.status === 'open').length;
    this.statusCounts['in-progress'] = this.tickets.filter(t => t.status === 'in-progress').length;
    this.statusCounts.resolved = this.tickets.filter(t => t.status === 'resolved').length;
    this.statusCounts.closed = this.tickets.filter(t => t.status === 'closed').length;
  }

  applyFilters() {
    let filtered = [...this.tickets];

    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(t => t.status === this.selectedStatus);
    }

    if (this.selectedPriority !== 'all') {
      filtered = filtered.filter(t => t.priority === this.selectedPriority);
    }

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.subject.toLowerCase().includes(query) ||
        t.customer.toLowerCase().includes(query) ||
        t.id.toLowerCase().includes(query)
      );
    }

    filtered.sort((a, b) => {
      if (this.sortBy === 'date') {
        return b.updatedAt.getTime() - a.updatedAt.getTime();
      } else if (this.sortBy === 'priority') {
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      } else {
        return a.status.localeCompare(b.status);
      }
    });

    this.filteredTickets = filtered;
  }

  filterByStatus(status: string) {
    this.selectedStatus = status;
    this.applyFilters();
  }

  filterByPriority(priority: string) {
    this.selectedPriority = priority;
    this.applyFilters();
  }

  onSearch(event: Event) {
    this.searchQuery = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  changeSortBy(sort: 'date' | 'priority' | 'status') {
    this.sortBy = sort;
    this.applyFilters();
  }

  toggleViewMode() {
    this.viewMode = this.viewMode === 'list' ? 'grid' : 'list';
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  getPriorityClass(priority: string): string {
    return `priority-${priority}`;
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }

  selectTicket(ticket: Ticket) {
  }
}
