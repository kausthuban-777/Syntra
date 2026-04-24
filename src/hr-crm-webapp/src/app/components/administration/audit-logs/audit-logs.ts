import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-audit-logs',
  imports: [CommonModule, FormsModule],
  templateUrl: './audit-logs.html',
  styleUrl: './audit-logs.css',
})
export class AuditLogs {
  searchQuery = signal('');
  selectedFilter = signal('all');
  selectedUser = signal('all');
  dateRange = signal('today');

  logs = signal([
    { id: '1', user: 'Sarah Johnson', action: 'User Login', resource: 'Authentication', status: 'success', ip: '192.168.1.100', timestamp: '2 mins ago', details: 'Successful login from Chrome browser', avatar: 'SJ', avatarColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { id: '2', user: 'Michael Chen', action: 'Updated User Role', resource: 'User Management', status: 'success', ip: '192.168.1.105', timestamp: '15 mins ago', details: 'Changed role from User to Manager for John Doe', avatar: 'MC', avatarColor: 'linear-gradient(135deg, #d946ef 0%, #e91e63 100%)' },
    { id: '3', user: 'System', action: 'Automated Backup', resource: 'System', status: 'success', ip: 'Internal', timestamp: '1 hour ago', details: 'Daily backup completed successfully', avatar: 'SY', avatarColor: 'linear-gradient(135deg, #00B894 0%, #00856F 100%)' },
    { id: '4', user: 'Emily Rodriguez', action: 'Failed Login Attempt', resource: 'Authentication', status: 'failed', ip: '203.45.67.89', timestamp: '2 hours ago', details: 'Invalid password entered 3 times', avatar: 'ER', avatarColor: 'linear-gradient(135deg, #ff8c42 0%, #ff6b35 100%)' },
    { id: '5', user: 'David Kim', action: 'Deleted Record', resource: 'CRM', status: 'warning', ip: '192.168.1.112', timestamp: '3 hours ago', details: 'Deleted customer record #4521', avatar: 'DK', avatarColor: 'linear-gradient(135deg, #6C5CE7 0%, #5F3DC4 100%)' },
    { id: '6', user: 'Jessica Martinez', action: 'Export Data', resource: 'Analytics', status: 'success', ip: '192.168.1.120', timestamp: '4 hours ago', details: 'Exported sales report for Q4 2024', avatar: 'JM', avatarColor: 'linear-gradient(135deg, #E67E22 0%, #D35400 100%)' },
    { id: '7', user: 'Robert Taylor', action: 'Modified Settings', resource: 'System Settings', status: 'success', ip: '192.168.1.115', timestamp: '5 hours ago', details: 'Updated notification preferences', avatar: 'RT', avatarColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { id: '8', user: 'Amanda White', action: 'Created User', resource: 'User Management', status: 'success', ip: '192.168.1.108', timestamp: '6 hours ago', details: 'Added new user account for Jane Smith', avatar: 'AW', avatarColor: 'linear-gradient(135deg, #d946ef 0%, #e91e63 100%)' },
  ]);

  stats = signal([
    { label: 'Total Events', value: '12,458', change: '+342', trend: 'up', icon: 'activity' },
    { label: 'Failed Attempts', value: '23', change: '-5', trend: 'down', icon: 'alert' },
    { label: 'Active Users', value: '89', change: '+12', trend: 'up', icon: 'users' },
    { label: 'System Events', value: '156', change: '+8', trend: 'up', icon: 'server' },
  ]);

  viewDetails(log: any) {
    console.log('View log details:', log);
  }

  exportLogs() {
    console.log('Export logs');
  }
}
