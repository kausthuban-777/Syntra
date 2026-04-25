import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { NavigationService } from '../../../services/navigation.service';
import { FormsModule } from '@angular/forms';

interface GoogleService {
  id: string;
  name: string;
  icon: string;
  color: string;
  status: 'active' | 'inactive' | 'syncing';
  lastSync: Date;
  itemCount: number;
  description: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  attendees: number;
  type: 'meeting' | 'reminder' | 'task';
}

interface EmailStats {
  inbox: number;
  sent: number;
  drafts: number;
  unread: number;
}

interface DriveFile {
  id: string;
  name: string;
  type: 'doc' | 'sheet' | 'slide' | 'pdf' | 'folder';
  size: string;
  modified: Date;
  shared: boolean;
}

@Component({
  selector: 'app-google-workspace',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './google-workspace.html',
  styleUrl: './google-workspace.css',
})
export class GoogleWorkspace implements OnInit {
  private navigationService = inject(NavigationService);

  isConnected = signal(true);
  accountEmail = signal('team@syntra.com');
  activeTab = signal<'overview' | 'calendar' | 'email' | 'drive'>('overview');

  services = signal<GoogleService[]>([
    {
      id: 'gmail',
      name: 'Gmail',
      icon: '📧',
      color: '#EA4335',
      status: 'active',
      lastSync: new Date('2026-04-25T11:45:00'),
      itemCount: 1247,
      description: 'Email synchronization and management'
    },
    {
      id: 'calendar',
      name: 'Calendar',
      icon: '📅',
      color: '#4285F4',
      status: 'active',
      lastSync: new Date('2026-04-25T11:40:00'),
      itemCount: 34,
      description: 'Event and meeting scheduling'
    },
    {
      id: 'drive',
      name: 'Drive',
      icon: '📁',
      color: '#0F9D58',
      status: 'syncing',
      lastSync: new Date('2026-04-25T11:30:00'),
      itemCount: 892,
      description: 'Cloud storage and file sharing'
    },
    {
      id: 'docs',
      name: 'Docs',
      icon: '📝',
      color: '#4285F4',
      status: 'active',
      lastSync: new Date('2026-04-25T11:35:00'),
      itemCount: 156,
      description: 'Document creation and collaboration'
    },
    {
      id: 'sheets',
      name: 'Sheets',
      icon: '📊',
      color: '#0F9D58',
      status: 'active',
      lastSync: new Date('2026-04-25T11:38:00'),
      itemCount: 89,
      description: 'Spreadsheet management'
    },
    {
      id: 'meet',
      name: 'Meet',
      icon: '🎥',
      color: '#00897B',
      status: 'inactive',
      lastSync: new Date('2026-04-24T16:00:00'),
      itemCount: 0,
      description: 'Video conferencing integration'
    }
  ]);

  upcomingEvents = signal<CalendarEvent[]>([
    {
      id: 'E001',
      title: 'Team Standup',
      start: new Date('2026-04-25T14:00:00'),
      end: new Date('2026-04-25T14:30:00'),
      attendees: 8,
      type: 'meeting'
    },
    {
      id: 'E002',
      title: 'Client Presentation',
      start: new Date('2026-04-25T15:30:00'),
      end: new Date('2026-04-25T16:30:00'),
      attendees: 5,
      type: 'meeting'
    },
    {
      id: 'E003',
      title: 'Project Deadline',
      start: new Date('2026-04-26T09:00:00'),
      end: new Date('2026-04-26T09:00:00'),
      attendees: 0,
      type: 'reminder'
    },
    {
      id: 'E004',
      title: 'Review Documents',
      start: new Date('2026-04-25T17:00:00'),
      end: new Date('2026-04-25T17:30:00'),
      attendees: 0,
      type: 'task'
    }
  ]);

  emailStats = signal<EmailStats>({
    inbox: 1247,
    sent: 892,
    drafts: 23,
    unread: 45
  });

  recentFiles = signal<DriveFile[]>([
    {
      id: 'F001',
      name: 'Q1 Financial Report',
      type: 'sheet',
      size: '2.4 MB',
      modified: new Date('2026-04-25T10:30:00'),
      shared: true
    },
    {
      id: 'F002',
      name: 'Project Proposal',
      type: 'doc',
      size: '1.8 MB',
      modified: new Date('2026-04-25T09:15:00'),
      shared: false
    },
    {
      id: 'F003',
      name: 'Marketing Deck',
      type: 'slide',
      size: '5.2 MB',
      modified: new Date('2026-04-24T16:45:00'),
      shared: true
    },
    {
      id: 'F004',
      name: 'Contract Template',
      type: 'pdf',
      size: '856 KB',
      modified: new Date('2026-04-24T14:20:00'),
      shared: false
    }
  ]);

  stats = computed(() => {
    const servs = this.services();
    return {
      total: servs.length,
      active: servs.filter(s => s.status === 'active').length,
      syncing: servs.filter(s => s.status === 'syncing').length,
      totalItems: servs.reduce((sum, s) => sum + s.itemCount, 0)
    };
  });

  ngOnInit() {
    this.navigationService.setCurrentPage('integrations');
  }

  toggleService(service: GoogleService) {
    const updated = this.services().map(s =>
      s.id === service.id ? { ...s, status: s.status === 'active' ? 'inactive' as const : 'active' as const } : s
    );
    this.services.set(updated);
  }

  syncService(service: GoogleService) {
    const updated = this.services().map(s =>
      s.id === service.id ? { ...s, status: 'syncing' as const, lastSync: new Date() } : s
    );
    this.services.set(updated);

    setTimeout(() => {
      const final = this.services().map(s =>
        s.id === service.id ? { ...s, status: 'active' as const } : s
      );
      this.services.set(final);
    }, 2000);
  }

  getFileIcon(type: string): string {
    const icons: Record<string, string> = {
      doc: '📄',
      sheet: '📊',
      slide: '📽️',
      pdf: '📕',
      folder: '📁'
    };
    return icons[type] || '📄';
  }

  getEventIcon(type: string): string {
    const icons: Record<string, string> = {
      meeting: '👥',
      reminder: '⏰',
      task: '✓'
    };
    return icons[type] || '📅';
  }

  formatTime(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
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
      day: 'numeric'
    }).format(date);
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  disconnect() {
    this.isConnected.set(false);
  }

  reconnect() {
    this.isConnected.set(true);
  }
}
