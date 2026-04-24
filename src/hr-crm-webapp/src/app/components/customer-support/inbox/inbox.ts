import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

interface Message {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  timestamp: Date;
  isRead: boolean;
  isStarred: boolean;
  hasAttachment: boolean;
  category: 'primary' | 'support' | 'billing' | 'updates';
  avatar?: string;
}

interface Conversation {
  id: string;
  messages: ConversationMessage[];
  participant: string;
  lastMessage: Date;
}

interface ConversationMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isOwn: boolean;
  attachments?: Attachment[];
}

interface Attachment {
  name: string;
  size: string;
  type: string;
}

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inbox.html',
  styleUrl: './inbox.css'
})
export class Inbox implements OnInit {
  messages: Message[] = [
    {
      id: 'msg-1',
      sender: 'Sarah Johnson',
      subject: 'Re: Dashboard Access Issue',
      preview: 'Thank you for the quick response. I tried clearing my cache and cookies but still experiencing the same issue...',
      timestamp: new Date('2024-04-24T11:30:00'),
      isRead: false,
      isStarred: true,
      hasAttachment: false,
      category: 'support'
    },
    {
      id: 'msg-2',
      sender: 'Michael Chen',
      subject: 'Payment Confirmation Required',
      preview: 'I received the invoice but the payment gateway is showing an error. Can you please check on your end?',
      timestamp: new Date('2024-04-24T10:45:00'),
      isRead: false,
      isStarred: false,
      hasAttachment: true,
      category: 'billing'
    },
    {
      id: 'msg-3',
      sender: 'Lisa Anderson',
      subject: 'Feature Request Follow-up',
      preview: 'Just wanted to follow up on my previous request about PDF export functionality. Any updates on the timeline?',
      timestamp: new Date('2024-04-24T09:15:00'),
      isRead: true,
      isStarred: false,
      hasAttachment: false,
      category: 'primary'
    },
    {
      id: 'msg-4',
      sender: 'David Brown',
      subject: 'Account Settings Not Saving',
      preview: 'Every time I update my profile settings and click save, the changes don\'t persist. This has been happening...',
      timestamp: new Date('2024-04-24T08:20:00'),
      isRead: true,
      isStarred: true,
      hasAttachment: false,
      category: 'support'
    },
    {
      id: 'msg-5',
      sender: 'System Notification',
      subject: 'Weekly Support Summary',
      preview: 'Here\'s your weekly summary: 24 tickets resolved, 8 pending, average response time: 2.5 hours...',
      timestamp: new Date('2024-04-23T18:00:00'),
      isRead: true,
      isStarred: false,
      hasAttachment: false,
      category: 'updates'
    },
    {
      id: 'msg-6',
      sender: 'Jennifer Lee',
      subject: 'API Integration Documentation',
      preview: 'Could you please send me the latest API documentation? I need to integrate our system with your platform...',
      timestamp: new Date('2024-04-23T16:30:00'),
      isRead: true,
      isStarred: false,
      hasAttachment: false,
      category: 'primary'
    }
  ];

  selectedMessage: Message | null = null;
  selectedCategory: string = 'all';
  searchQuery: string = '';
  filteredMessages: Message[] = [];
  showCompose: boolean = false;

  categoryCounts = {
    all: 0,
    primary: 0,
    support: 0,
    billing: 0,
    updates: 0,
    starred: 0,
    unread: 0
  };

  ngOnInit() {
    this.calculateCategoryCounts();
    this.applyFilters();
  }

  calculateCategoryCounts() {
    this.categoryCounts.all = this.messages.length;
    this.categoryCounts.primary = this.messages.filter(m => m.category === 'primary').length;
    this.categoryCounts.support = this.messages.filter(m => m.category === 'support').length;
    this.categoryCounts.billing = this.messages.filter(m => m.category === 'billing').length;
    this.categoryCounts.updates = this.messages.filter(m => m.category === 'updates').length;
    this.categoryCounts.starred = this.messages.filter(m => m.isStarred).length;
    this.categoryCounts.unread = this.messages.filter(m => !m.isRead).length;
  }

  applyFilters() {
    let filtered = [...this.messages];

    if (this.selectedCategory !== 'all') {
      if (this.selectedCategory === 'starred') {
        filtered = filtered.filter(m => m.isStarred);
      } else if (this.selectedCategory === 'unread') {
        filtered = filtered.filter(m => !m.isRead);
      } else {
        filtered = filtered.filter(m => m.category === this.selectedCategory);
      }
    }

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(m =>
        m.sender.toLowerCase().includes(query) ||
        m.subject.toLowerCase().includes(query) ||
        m.preview.toLowerCase().includes(query)
      );
    }

    filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    this.filteredMessages = filtered;
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.applyFilters();
  }

  selectMessage(message: Message) {
    this.selectedMessage = message;
    if (!message.isRead) {
      message.isRead = true;
      this.calculateCategoryCounts();
      this.applyFilters();
    }
  }

  toggleStar(message: Message, event: Event) {
    event.stopPropagation();
    message.isStarred = !message.isStarred;
    this.calculateCategoryCounts();
    this.applyFilters();
  }

  markAsRead(message: Message, event: Event) {
    event.stopPropagation();
    message.isRead = true;
    this.calculateCategoryCounts();
    this.applyFilters();
  }

  markAsUnread(message: Message, event: Event) {
    event.stopPropagation();
    message.isRead = false;
    this.calculateCategoryCounts();
    this.applyFilters();
  }

  deleteMessage(message: Message, event: Event) {
    event.stopPropagation();
    const index = this.messages.indexOf(message);
    if (index > -1) {
      this.messages.splice(index, 1);
      this.calculateCategoryCounts();
      this.applyFilters();
      if (this.selectedMessage?.id === message.id) {
        this.selectedMessage = null;
      }
    }
  }

  onSearch(event: Event) {
    this.searchQuery = (event.target as HTMLInputElement).value;
    this.applyFilters();
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

  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      primary: '📧',
      support: '🎫',
      billing: '💳',
      updates: '📢'
    };
    return icons[category] || '📧';
  }

  toggleCompose() {
    this.showCompose = !this.showCompose;
  }

  closeMessageView() {
    this.selectedMessage = null;
  }
}
