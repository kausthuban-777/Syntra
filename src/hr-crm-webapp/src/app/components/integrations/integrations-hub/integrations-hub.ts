import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { NavigationService } from '../../../services/navigation.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Integration {
  id: string;
  name: string;
  category: 'communication' | 'productivity' | 'finance' | 'development' | 'marketing';
  description: string;
  icon: string;
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  isPopular: boolean;
  lastSync?: Date;
  syncFrequency?: string;
  dataPoints?: number;
  route?: string;
  features: string[];
  setupComplexity: 'easy' | 'medium' | 'advanced';
}

interface IntegrationStats {
  total: number;
  connected: number;
  pending: number;
  errors: number;
}

@Component({
  selector: 'app-integrations-hub',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './integrations-hub.html',
  styleUrl: './integrations-hub.css'
})
export class IntegrationsHub implements OnInit {
  private navigationService = inject(NavigationService);
  private router = inject(Router);

  integrations = signal<Integration[]>([
    {
      id: 'slack',
      name: 'Slack',
      category: 'communication',
      description: 'Team communication and collaboration platform',
      icon: '💬',
      status: 'connected',
      isPopular: true,
      lastSync: new Date('2026-04-25T10:30:00'),
      syncFrequency: 'Real-time',
      dataPoints: 1247,
      route: '/integrations/slack',
      features: ['Notifications', 'Team Chat', 'File Sharing', 'Webhooks'],
      setupComplexity: 'easy'
    },
    {
      id: 'google-workspace',
      name: 'Google Workspace',
      category: 'productivity',
      description: 'Gmail, Calendar, Drive, and Docs integration',
      icon: '🔷',
      status: 'connected',
      isPopular: true,
      lastSync: new Date('2026-04-25T09:15:00'),
      syncFrequency: 'Every 15 min',
      dataPoints: 3421,
      route: '/integrations/google-workspace',
      features: ['Email Sync', 'Calendar', 'Drive Storage', 'Docs'],
      setupComplexity: 'medium'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      category: 'communication',
      description: 'Customer messaging via WhatsApp API',
      icon: '📱',
      status: 'connected',
      isPopular: true,
      lastSync: new Date('2026-04-25T11:00:00'),
      syncFrequency: 'Real-time',
      dataPoints: 892,
      route: '/integrations/whatsapp-api',
      features: ['Customer Chat', 'Broadcasts', 'Templates', 'Analytics'],
      setupComplexity: 'medium'
    },
    {
      id: 'quickbooks',
      name: 'QuickBooks',
      category: 'finance',
      description: 'Accounting and financial management',
      icon: '💰',
      status: 'connected',
      isPopular: true,
      lastSync: new Date('2026-04-25T08:00:00'),
      syncFrequency: 'Daily',
      dataPoints: 567,
      route: '/integrations/accounting',
      features: ['Invoicing', 'Expenses', 'Reports', 'Tax Management'],
      setupComplexity: 'advanced'
    },
    {
      id: 'stripe',
      name: 'Stripe',
      category: 'finance',
      description: 'Payment processing and subscription management',
      icon: '💳',
      status: 'connected',
      isPopular: true,
      lastSync: new Date('2026-04-25T10:45:00'),
      syncFrequency: 'Real-time',
      dataPoints: 2134,
      route: '/integrations/payment-gateway',
      features: ['Payments', 'Subscriptions', 'Invoices', 'Refunds'],
      setupComplexity: 'medium'
    },
    {
      id: 'github',
      name: 'GitHub',
      category: 'development',
      description: 'Code repository and project management',
      icon: '🐙',
      status: 'pending',
      isPopular: true,
      features: ['Repositories', 'Issues', 'Pull Requests', 'Actions'],
      setupComplexity: 'easy'
    },
    {
      id: 'jira',
      name: 'Jira',
      category: 'development',
      description: 'Project tracking and agile management',
      icon: '📊',
      status: 'disconnected',
      isPopular: false,
      features: ['Issue Tracking', 'Sprints', 'Boards', 'Reports'],
      setupComplexity: 'medium'
    },
    {
      id: 'mailchimp',
      name: 'Mailchimp',
      category: 'marketing',
      description: 'Email marketing and automation',
      icon: '📧',
      status: 'disconnected',
      isPopular: true,
      features: ['Campaigns', 'Automation', 'Analytics', 'Templates'],
      setupComplexity: 'easy'
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      category: 'marketing',
      description: 'CRM and marketing automation platform',
      icon: '🎯',
      status: 'error',
      isPopular: true,
      lastSync: new Date('2026-04-24T15:30:00'),
      features: ['CRM', 'Marketing', 'Sales', 'Service'],
      setupComplexity: 'advanced'
    },
    {
      id: 'zoom',
      name: 'Zoom',
      category: 'communication',
      description: 'Video conferencing and webinars',
      icon: '🎥',
      status: 'disconnected',
      isPopular: false,
      features: ['Meetings', 'Webinars', 'Recording', 'Chat'],
      setupComplexity: 'easy'
    },
    {
      id: 'salesforce',
      name: 'Salesforce',
      category: 'productivity',
      description: 'Enterprise CRM and sales platform',
      icon: '☁️',
      status: 'disconnected',
      isPopular: false,
      features: ['Sales Cloud', 'Service Cloud', 'Analytics', 'AppExchange'],
      setupComplexity: 'advanced'
    },
    {
      id: 'dropbox',
      name: 'Dropbox',
      category: 'productivity',
      description: 'Cloud storage and file synchronization',
      icon: '📦',
      status: 'disconnected',
      isPopular: false,
      features: ['File Storage', 'Sharing', 'Sync', 'Backup'],
      setupComplexity: 'easy'
    }
  ]);

  stats = computed<IntegrationStats>(() => {
    const integs = this.integrations();
    return {
      total: integs.length,
      connected: integs.filter(i => i.status === 'connected').length,
      pending: integs.filter(i => i.status === 'pending').length,
      errors: integs.filter(i => i.status === 'error').length
    };
  });

  selectedIntegration = signal<Integration | null>(null);
  searchQuery = signal('');
  filterCategory = signal<string>('all');
  filterStatus = signal<string>('all');
  viewMode = signal<'grid' | 'list'>('grid');

  filteredIntegrations = computed(() => {
    let filtered = this.integrations();

    if (this.searchQuery()) {
      const query = this.searchQuery().toLowerCase();
      filtered = filtered.filter(integration =>
        integration.name.toLowerCase().includes(query) ||
        integration.description.toLowerCase().includes(query) ||
        integration.category.toLowerCase().includes(query)
      );
    }

    if (this.filterCategory() !== 'all') {
      filtered = filtered.filter(integration => integration.category === this.filterCategory());
    }

    if (this.filterStatus() !== 'all') {
      filtered = filtered.filter(integration => integration.status === this.filterStatus());
    }

    return filtered.sort((a, b) => {
      if (a.isPopular && !b.isPopular) return -1;
      if (!a.isPopular && b.isPopular) return 1;
      if (a.status === 'connected' && b.status !== 'connected') return -1;
      if (a.status !== 'connected' && b.status === 'connected') return 1;
      return a.name.localeCompare(b.name);
    });
  });

  ngOnInit() {
    this.navigationService.setCurrentPage('integrations');
  }

  selectIntegration(integration: Integration) {
    this.selectedIntegration.set(integration);
  }

  closeDetails() {
    this.selectedIntegration.set(null);
  }

  navigateToIntegration(integration: Integration) {
    if (integration.route) {
      this.router.navigate([integration.route]);
    }
  }

  connectIntegration(integration: Integration) {
    if (integration.route) {
      this.router.navigate([integration.route]);
    } else {
      const updated = this.integrations().map(i =>
        i.id === integration.id ? { ...i, status: 'pending' as const } : i
      );
      this.integrations.set(updated);
    }
  }

  disconnectIntegration(integration: Integration) {
    const updated = this.integrations().map(i =>
      i.id === integration.id ? { ...i, status: 'disconnected' as const, lastSync: undefined, dataPoints: undefined } : i
    );
    this.integrations.set(updated);
    this.closeDetails();
  }

  retryConnection(integration: Integration) {
    const updated = this.integrations().map(i =>
      i.id === integration.id ? { ...i, status: 'pending' as const } : i
    );
    this.integrations.set(updated);
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      connected: 'status-connected',
      disconnected: 'status-disconnected',
      error: 'status-error',
      pending: 'status-pending'
    };
    return classes[status] || '';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      connected: 'Connected',
      disconnected: 'Not Connected',
      error: 'Error',
      pending: 'Pending'
    };
    return labels[status] || status;
  }

  getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      communication: 'Communication',
      productivity: 'Productivity',
      finance: 'Finance',
      development: 'Development',
      marketing: 'Marketing'
    };
    return labels[category] || category;
  }

  getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      communication: '💬',
      productivity: '⚡',
      finance: '💰',
      development: '⚙️',
      marketing: '📈'
    };
    return icons[category] || '🔌';
  }

  formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }
}
