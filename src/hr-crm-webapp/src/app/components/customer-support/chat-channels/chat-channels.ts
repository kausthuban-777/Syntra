import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

interface Channel {
  id: string;
  name: string;
  type: 'live-chat' | 'whatsapp' | 'messenger' | 'telegram' | 'email';
  status: 'active' | 'inactive' | 'paused';
  activeChats: number;
  totalChats: number;
  avgResponseTime: string;
  satisfaction: number;
  icon: string;
  color: string;
}

interface ChatSession {
  id: string;
  customer: string;
  channel: string;
  status: 'active' | 'waiting' | 'resolved';
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  priority: 'low' | 'medium' | 'high';
}

interface ChatMessage {
  id: string;
  sender: 'customer' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  isRead: boolean;
}

@Component({
  selector: 'app-chat-channels',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-channels.html',
  styleUrl: './chat-channels.css'
})
export class ChatChannels implements OnInit {
  channels: Channel[] = [
    {
      id: 'ch-1',
      name: 'Live Chat',
      type: 'live-chat',
      status: 'active',
      activeChats: 12,
      totalChats: 145,
      avgResponseTime: '2.5 min',
      satisfaction: 94,
      icon: '💬',
      color: '#667eea'
    },
    {
      id: 'ch-2',
      name: 'WhatsApp',
      type: 'whatsapp',
      status: 'active',
      activeChats: 8,
      totalChats: 89,
      avgResponseTime: '3.2 min',
      satisfaction: 96,
      icon: '📱',
      color: '#25D366'
    },
    {
      id: 'ch-3',
      name: 'Messenger',
      type: 'messenger',
      status: 'active',
      activeChats: 5,
      totalChats: 67,
      avgResponseTime: '4.1 min',
      satisfaction: 91,
      icon: '💙',
      color: '#0084FF'
    },
    {
      id: 'ch-4',
      name: 'Telegram',
      type: 'telegram',
      status: 'paused',
      activeChats: 0,
      totalChats: 34,
      avgResponseTime: '5.0 min',
      satisfaction: 88,
      icon: '✈️',
      color: '#0088cc'
    },
    {
      id: 'ch-5',
      name: 'Email Support',
      type: 'email',
      status: 'active',
      activeChats: 23,
      totalChats: 234,
      avgResponseTime: '45 min',
      satisfaction: 89,
      icon: '📧',
      color: '#d946ef'
    }
  ];

  chatSessions: ChatSession[] = [
    {
      id: 'chat-1',
      customer: 'Sarah Johnson',
      channel: 'Live Chat',
      status: 'active',
      lastMessage: 'I need help with my account settings',
      timestamp: new Date('2024-04-24T11:45:00'),
      unreadCount: 2,
      priority: 'high'
    },
    {
      id: 'chat-2',
      customer: 'Michael Chen',
      channel: 'WhatsApp',
      status: 'waiting',
      lastMessage: 'When will my order be delivered?',
      timestamp: new Date('2024-04-24T11:30:00'),
      unreadCount: 1,
      priority: 'medium'
    },
    {
      id: 'chat-3',
      customer: 'Lisa Anderson',
      channel: 'Messenger',
      status: 'active',
      lastMessage: 'Thank you for the quick response!',
      timestamp: new Date('2024-04-24T11:15:00'),
      unreadCount: 0,
      priority: 'low'
    },
    {
      id: 'chat-4',
      customer: 'David Brown',
      channel: 'Live Chat',
      status: 'waiting',
      lastMessage: 'Payment failed, please help',
      timestamp: new Date('2024-04-24T11:00:00'),
      unreadCount: 3,
      priority: 'high'
    },
    {
      id: 'chat-5',
      customer: 'Jennifer Lee',
      channel: 'Email Support',
      status: 'resolved',
      lastMessage: 'Issue resolved, thanks!',
      timestamp: new Date('2024-04-24T10:45:00'),
      unreadCount: 0,
      priority: 'low'
    }
  ];

  selectedChannel: Channel | null = null;
  selectedChat: ChatSession | null = null;
  filteredSessions: ChatSession[] = [];
  selectedFilter: string = 'all';

  ngOnInit() {
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.chatSessions];

    if (this.selectedFilter === 'active') {
      filtered = filtered.filter(s => s.status === 'active');
    } else if (this.selectedFilter === 'waiting') {
      filtered = filtered.filter(s => s.status === 'waiting');
    } else if (this.selectedFilter === 'unread') {
      filtered = filtered.filter(s => s.unreadCount > 0);
    }

    if (this.selectedChannel) {
      filtered = filtered.filter(s => s.channel === this.selectedChannel!.name);
    }

    filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    this.filteredSessions = filtered;
  }

  selectChannel(channel: Channel) {
    this.selectedChannel = channel;
    this.applyFilters();
  }

  clearChannelFilter() {
    this.selectedChannel = null;
    this.applyFilters();
  }

  selectChat(chat: ChatSession) {
    this.selectedChat = chat;
    if (chat.unreadCount > 0) {
      chat.unreadCount = 0;
    }
  }

  filterSessions(filter: string) {
    this.selectedFilter = filter;
    this.applyFilters();
  }

  toggleChannelStatus(channel: Channel, event: Event) {
    event.stopPropagation();
    channel.status = channel.status === 'active' ? 'paused' : 'active';
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

    if (minutes < 60) return `${minutes}m ago`;
    return `${hours}h ago`;
  }

  getChannelIcon(channelName: string): string {
    const channel = this.channels.find(c => c.name === channelName);
    return channel?.icon || '💬';
  }
}
