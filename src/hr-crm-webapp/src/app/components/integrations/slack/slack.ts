import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { NavigationService } from '../../../services/navigation.service';
import { FormsModule } from '@angular/forms';

interface SlackChannel {
  id: string;
  name: string;
  type: 'public' | 'private' | 'direct';
  members: number;
  isActive: boolean;
  lastActivity: Date;
  unreadCount: number;
}

interface SlackNotification {
  id: string;
  event: string;
  channel: string;
  enabled: boolean;
  description: string;
}

interface SlackStats {
  totalChannels: number;
  activeChannels: number;
  totalMessages: number;
  notifications: number;
}

@Component({
  selector: 'app-slack',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './slack.html',
  styleUrl: './slack.css',
})
export class Slack implements OnInit {
  private navigationService = inject(NavigationService);

  isConnected = signal(true);
  workspaceName = signal('Syntra Workspace');

  channels = signal<SlackChannel[]>([
    {
      id: 'C001',
      name: 'general',
      type: 'public',
      members: 45,
      isActive: true,
      lastActivity: new Date('2026-04-25T11:30:00'),
      unreadCount: 3
    },
    {
      id: 'C002',
      name: 'hr-notifications',
      type: 'public',
      members: 12,
      isActive: true,
      lastActivity: new Date('2026-04-25T10:15:00'),
      unreadCount: 0
    },
    {
      id: 'C003',
      name: 'sales-team',
      type: 'private',
      members: 8,
      isActive: true,
      lastActivity: new Date('2026-04-25T09:45:00'),
      unreadCount: 5
    },
    {
      id: 'C004',
      name: 'support-alerts',
      type: 'public',
      members: 15,
      isActive: true,
      lastActivity: new Date('2026-04-25T11:00:00'),
      unreadCount: 2
    },
    {
      id: 'C005',
      name: 'dev-team',
      type: 'private',
      members: 10,
      isActive: false,
      lastActivity: new Date('2026-04-24T16:30:00'),
      unreadCount: 0
    }
  ]);

  notifications = signal<SlackNotification[]>([
    {
      id: 'N001',
      event: 'New Customer',
      channel: 'sales-team',
      enabled: true,
      description: 'Notify when a new customer is added'
    },
    {
      id: 'N002',
      event: 'Support Ticket',
      channel: 'support-alerts',
      enabled: true,
      description: 'Alert on new support tickets'
    },
    {
      id: 'N003',
      event: 'Leave Request',
      channel: 'hr-notifications',
      enabled: true,
      description: 'Notify HR team of leave requests'
    },
    {
      id: 'N004',
      event: 'Deal Closed',
      channel: 'sales-team',
      enabled: true,
      description: 'Celebrate closed deals'
    },
    {
      id: 'N005',
      event: 'System Alert',
      channel: 'dev-team',
      enabled: false,
      description: 'Critical system notifications'
    }
  ]);

  stats = computed<SlackStats>(() => {
    const chans = this.channels();
    return {
      totalChannels: chans.length,
      activeChannels: chans.filter(c => c.isActive).length,
      totalMessages: 1247,
      notifications: this.notifications().filter(n => n.enabled).length
    };
  });

  searchQuery = signal('');
  filterType = signal<string>('all');
  selectedChannel = signal<SlackChannel | null>(null);

  filteredChannels = computed(() => {
    let filtered = this.channels();

    if (this.searchQuery()) {
      const query = this.searchQuery().toLowerCase();
      filtered = filtered.filter(channel =>
        channel.name.toLowerCase().includes(query)
      );
    }

    if (this.filterType() !== 'all') {
      filtered = filtered.filter(channel => channel.type === this.filterType());
    }

    return filtered.sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime());
  });

  ngOnInit() {
    this.navigationService.setCurrentPage('integrations');
  }

  toggleNotification(notification: SlackNotification) {
    const updated = this.notifications().map(n =>
      n.id === notification.id ? { ...n, enabled: !n.enabled } : n
    );
    this.notifications.set(updated);
  }

  toggleChannel(channel: SlackChannel) {
    const updated = this.channels().map(c =>
      c.id === channel.id ? { ...c, isActive: !c.isActive } : c
    );
    this.channels.set(updated);
  }

  selectChannel(channel: SlackChannel) {
    this.selectedChannel.set(channel);
  }

  closeDetails() {
    this.selectedChannel.set(null);
  }

  getChannelIcon(type: string): string {
    const icons: Record<string, string> = {
      public: '#',
      private: '🔒',
      direct: '💬'
    };
    return icons[type] || '#';
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

  disconnect() {
    this.isConnected.set(false);
  }

  reconnect() {
    this.isConnected.set(true);
  }
}
