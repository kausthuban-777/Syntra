import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notifications',
  imports: [CommonModule, FormsModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
})
export class Notifications {
  selectedTab = signal('all');
  showTemplateModal = signal(false);

  notifications = signal([
    { id: '1', type: 'system', title: 'System Update Available', message: 'A new version of the system is ready to install', time: '5 mins ago', read: false, priority: 'high', icon: 'download' },
    { id: '2', type: 'user', title: 'New User Registration', message: 'John Doe has registered and is awaiting approval', time: '15 mins ago', read: false, priority: 'medium', icon: 'user-plus' },
    { id: '3', type: 'security', title: 'Failed Login Attempts', message: 'Multiple failed login attempts detected from IP 203.45.67.89', time: '1 hour ago', read: false, priority: 'high', icon: 'alert-triangle' },
    { id: '4', type: 'backup', title: 'Backup Completed', message: 'Daily backup completed successfully at 2:00 AM', time: '3 hours ago', read: true, priority: 'low', icon: 'check-circle' },
    { id: '5', type: 'integration', title: 'Slack Integration Active', message: 'Slack workspace has been successfully connected', time: '5 hours ago', read: true, priority: 'low', icon: 'link' },
    { id: '6', type: 'user', title: 'Role Updated', message: 'Sarah Johnson\'s role has been changed to Manager', time: '1 day ago', read: true, priority: 'medium', icon: 'shield' },
  ]);

  templates = signal([
    { id: '1', name: 'Welcome Email', type: 'email', trigger: 'User Registration', status: 'active', lastUsed: '2 hours ago' },
    { id: '2', name: 'Password Reset', type: 'email', trigger: 'Password Request', status: 'active', lastUsed: '5 hours ago' },
    { id: '3', name: 'Invoice Generated', type: 'email', trigger: 'Invoice Creation', status: 'active', lastUsed: '1 day ago' },
    { id: '4', name: 'Task Assigned', type: 'push', trigger: 'Task Assignment', status: 'active', lastUsed: '3 hours ago' },
    { id: '5', name: 'Meeting Reminder', type: 'push', trigger: 'Calendar Event', status: 'inactive', lastUsed: '1 week ago' },
  ]);

  stats = signal([
    { label: 'Unread', value: '12', icon: 'bell', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { label: 'Today', value: '45', icon: 'calendar', color: 'linear-gradient(135deg, #00B894 0%, #00856F 100%)' },
    { label: 'High Priority', value: '3', icon: 'alert-circle', color: 'linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)' },
    { label: 'Templates', value: '8', icon: 'file-text', color: 'linear-gradient(135deg, #6C5CE7 0%, #5F3DC4 100%)' },
  ]);

  selectTab(tab: string) {
    this.selectedTab.set(tab);
  }

  markAsRead(notificationId: string) {
    const notifs = this.notifications();
    const updated = notifs.map(n => n.id === notificationId ? { ...n, read: true } : n);
    this.notifications.set(updated);
  }

  markAllAsRead() {
    const notifs = this.notifications();
    const updated = notifs.map(n => ({ ...n, read: true }));
    this.notifications.set(updated);
  }

  deleteNotification(notificationId: string) {
    const notifs = this.notifications();
    const updated = notifs.filter(n => n.id !== notificationId);
    this.notifications.set(updated);
  }

  openTemplateModal() {
    this.showTemplateModal.set(true);
  }

  closeTemplateModal() {
    this.showTemplateModal.set(false);
  }

  toggleTemplateStatus(templateId: string) {
    console.log('Toggle template:', templateId);
  }
}
