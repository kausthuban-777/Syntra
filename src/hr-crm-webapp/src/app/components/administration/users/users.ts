import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users {
  searchQuery = signal('');
  selectedFilter = signal('all');
  selectedRole = signal('all');
  selectedStatus = signal('all');
  showUserModal = signal(false);
  showBulkActions = signal(false);
  selectedUsers = signal<Set<string>>(new Set());
  sortBy = signal('name');
  sortDirection = signal<'asc' | 'desc'>('asc');

  users = signal([
    { id: '1', name: 'Sarah Johnson', email: 'sarah.johnson@company.com', role: 'Admin', department: 'IT', status: 'active', lastActive: '2 mins ago', avatar: 'SJ', avatarColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { id: '2', name: 'Michael Chen', email: 'michael.chen@company.com', role: 'Manager', department: 'Sales', status: 'active', lastActive: '15 mins ago', avatar: 'MC', avatarColor: 'linear-gradient(135deg, #d946ef 0%, #e91e63 100%)' },
    { id: '3', name: 'Emily Rodriguez', email: 'emily.rodriguez@company.com', role: 'User', department: 'Marketing', status: 'active', lastActive: '1 hour ago', avatar: 'ER', avatarColor: 'linear-gradient(135deg, #ff8c42 0%, #ff6b35 100%)' },
    { id: '4', name: 'David Kim', email: 'david.kim@company.com', role: 'User', department: 'HR', status: 'inactive', lastActive: '2 days ago', avatar: 'DK', avatarColor: 'linear-gradient(135deg, #00B894 0%, #00856F 100%)' },
    { id: '5', name: 'Jessica Martinez', email: 'jessica.martinez@company.com', role: 'Manager', department: 'Operations', status: 'active', lastActive: '30 mins ago', avatar: 'JM', avatarColor: 'linear-gradient(135deg, #6C5CE7 0%, #5F3DC4 100%)' },
    { id: '6', name: 'Robert Taylor', email: 'robert.taylor@company.com', role: 'User', department: 'Finance', status: 'pending', lastActive: 'Never', avatar: 'RT', avatarColor: 'linear-gradient(135deg, #E67E22 0%, #D35400 100%)' },
    { id: '7', name: 'Amanda White', email: 'amanda.white@company.com', role: 'Admin', department: 'IT', status: 'active', lastActive: '5 mins ago', avatar: 'AW', avatarColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { id: '8', name: 'James Anderson', email: 'james.anderson@company.com', role: 'User', department: 'Sales', status: 'active', lastActive: '45 mins ago', avatar: 'JA', avatarColor: 'linear-gradient(135deg, #d946ef 0%, #e91e63 100%)' },
  ]);

  sortedUsers = computed(() => {
    const usersList = [...this.users()];
    const sortField = this.sortBy();
    const direction = this.sortDirection();

    return usersList.sort((a: any, b: any) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();

      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  });

  stats = signal([
    { label: 'Total Users', value: '248', change: '+12', trend: 'up', icon: 'users', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { label: 'Active Now', value: '89', change: '+5', trend: 'up', icon: 'activity', color: 'linear-gradient(135deg, #00B894 0%, #00856F 100%)' },
    { label: 'Pending', value: '12', change: '-3', trend: 'down', icon: 'clock', color: 'linear-gradient(135deg, #E67E22 0%, #D35400 100%)' },
    { label: 'Inactive', value: '24', change: '+2', trend: 'up', icon: 'pause', color: 'linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)' },
  ]);

  toggleUserSelection(userId: string) {
    const selected = new Set(this.selectedUsers());
    if (selected.has(userId)) {
      selected.delete(userId);
    } else {
      selected.add(userId);
    }
    this.selectedUsers.set(selected);
    this.showBulkActions.set(selected.size > 0);
  }

  toggleSelectAll() {
    const allSelected = this.selectedUsers().size === this.sortedUsers().length;
    if (allSelected) {
      this.selectedUsers.set(new Set());
      this.showBulkActions.set(false);
    } else {
      this.selectedUsers.set(new Set(this.sortedUsers().map(u => u.id)));
      this.showBulkActions.set(true);
    }
  }

  isSelected(userId: string): boolean {
    return this.selectedUsers().has(userId);
  }

  sortUsers(field: string) {
    if (this.sortBy() === field) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortBy.set(field);
      this.sortDirection.set('asc');
    }
  }

  openUserModal() {
    this.showUserModal.set(true);
  }

  closeUserModal() {
    this.showUserModal.set(false);
  }

  deactivateUser(userId: string) {
    console.log('Deactivate user:', userId);
  }

  deleteUser(userId: string) {
    console.log('Delete user:', userId);
  }

  bulkAction(action: string) {
    console.log('Bulk action:', action, Array.from(this.selectedUsers()));
  }
}
