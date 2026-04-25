import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { NavigationService } from '../../../services/navigation.service';
import { FormsModule } from '@angular/forms';

interface WhatsAppTemplate {
  id: string;
  name: string;
  category: 'marketing' | 'utility' | 'authentication';
  status: 'approved' | 'pending' | 'rejected';
  language: string;
  content: string;
  variables: number;
}

interface Conversation {
  id: string;
  customerName: string;
  customerPhone: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
  status: 'active' | 'resolved' | 'pending';
}

interface MessageStats {
  sent: number;
  delivered: number;
  read: number;
  failed: number;
}

@Component({
  selector: 'app-whatsapp-api',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './whatsapp.html',
  styleUrl: './whatsapp.css',
})
export class WhatsappApi implements OnInit {
  private navigationService = inject(NavigationService);

  isConnected = signal(true);
  phoneNumber = signal('+1 (555) 123-4567');
  activeView = signal<'overview' | 'templates' | 'conversations'>('overview');

  templates = signal<WhatsAppTemplate[]>([
    {
      id: 'T001',
      name: 'Welcome Message',
      category: 'utility',
      status: 'approved',
      language: 'en',
      content: 'Welcome to {{1}}! We\'re excited to have you with us.',
      variables: 1
    },
    {
      id: 'T002',
      name: 'Order Confirmation',
      category: 'utility',
      status: 'approved',
      language: 'en',
      content: 'Your order #{{1}} has been confirmed. Expected delivery: {{2}}',
      variables: 2
    },
    {
      id: 'T003',
      name: 'Promotional Offer',
      category: 'marketing',
      status: 'approved',
      language: 'en',
      content: 'Special offer! Get {{1}}% off on your next purchase. Use code: {{2}}',
      variables: 2
    },
    {
      id: 'T004',
      name: 'Appointment Reminder',
      category: 'utility',
      status: 'approved',
      language: 'en',
      content: 'Reminder: Your appointment is scheduled for {{1}} at {{2}}',
      variables: 2
    },
    {
      id: 'T005',
      name: 'OTP Verification',
      category: 'authentication',
      status: 'pending',
      language: 'en',
      content: 'Your verification code is: {{1}}. Valid for 10 minutes.',
      variables: 1
    },
    {
      id: 'T006',
      name: 'Payment Receipt',
      category: 'utility',
      status: 'rejected',
      language: 'en',
      content: 'Payment received: ${{1}}. Transaction ID: {{2}}',
      variables: 2
    }
  ]);

  conversations = signal<Conversation[]>([
    {
      id: 'C001',
      customerName: 'Sarah Johnson',
      customerPhone: '+1 555-0100',
      lastMessage: 'Thank you for the quick response!',
      timestamp: new Date('2026-04-25T11:30:00'),
      unread: 0,
      status: 'resolved'
    },
    {
      id: 'C002',
      customerName: 'Michael Chen',
      customerPhone: '+1 555-0101',
      lastMessage: 'When will my order be delivered?',
      timestamp: new Date('2026-04-25T11:15:00'),
      unread: 2,
      status: 'active'
    },
    {
      id: 'C003',
      customerName: 'Lisa Anderson',
      customerPhone: '+1 555-0102',
      lastMessage: 'I need help with my account',
      timestamp: new Date('2026-04-25T10:45:00'),
      unread: 1,
      status: 'pending'
    },
    {
      id: 'C004',
      customerName: 'David Park',
      customerPhone: '+1 555-0103',
      lastMessage: 'Perfect, thanks!',
      timestamp: new Date('2026-04-25T09:30:00'),
      unread: 0,
      status: 'resolved'
    },
    {
      id: 'C005',
      customerName: 'Emily Rodriguez',
      customerPhone: '+1 555-0104',
      lastMessage: 'Can I change my delivery address?',
      timestamp: new Date('2026-04-25T08:20:00'),
      unread: 3,
      status: 'active'
    }
  ]);

  messageStats = signal<MessageStats>({
    sent: 1247,
    delivered: 1198,
    read: 1056,
    failed: 12
  });

  stats = computed(() => {
    const temps = this.templates();
    const convs = this.conversations();
    return {
      totalTemplates: temps.length,
      approvedTemplates: temps.filter(t => t.status === 'approved').length,
      totalConversations: convs.length,
      activeConversations: convs.filter(c => c.status === 'active').length,
      unreadMessages: convs.reduce((sum, c) => sum + c.unread, 0)
    };
  });

  searchQuery = signal('');
  filterCategory = signal<string>('all');
  filterStatus = signal<string>('all');

  filteredTemplates = computed(() => {
    let filtered = this.templates();

    if (this.searchQuery()) {
      const query = this.searchQuery().toLowerCase();
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(query) ||
        template.content.toLowerCase().includes(query)
      );
    }

    if (this.filterCategory() !== 'all') {
      filtered = filtered.filter(template => template.category === this.filterCategory());
    }

    if (this.filterStatus() !== 'all') {
      filtered = filtered.filter(template => template.status === this.filterStatus());
    }

    return filtered;
  });

  filteredConversations = computed(() => {
    let filtered = this.conversations();

    if (this.searchQuery()) {
      const query = this.searchQuery().toLowerCase();
      filtered = filtered.filter(conv =>
        conv.customerName.toLowerCase().includes(query) ||
        conv.customerPhone.includes(query)
      );
    }

    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  });

  ngOnInit() {
    this.navigationService.setCurrentPage('integrations');
  }

  getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      marketing: '📢',
      utility: '🔧',
      authentication: '🔐'
    };
    return icons[category] || '📝';
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      approved: '#34A853',
      pending: '#FBBC05',
      rejected: '#EA4335'
    };
    return colors[status] || '#999';
  }

  formatTime(date: Date): string {
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
