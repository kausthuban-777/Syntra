import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-roles',
  imports: [CommonModule, FormsModule],
  templateUrl: './roles.html',
  styleUrl: './roles.css',
})
export class Roles {
  selectedRole = signal<any>(null);
  showRoleModal = signal(false);
  searchQuery = signal('');

  roles = signal([
    {
      id: '1',
      name: 'Super Admin',
      description: 'Full system access with all permissions',
      users: 3,
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      permissions: {
        users: { view: true, create: true, edit: true, delete: true },
        roles: { view: true, create: true, edit: true, delete: true },
        hr: { view: true, create: true, edit: true, delete: true },
        crm: { view: true, create: true, edit: true, delete: true },
        analytics: { view: true, create: true, edit: true, delete: true },
        settings: { view: true, create: true, edit: true, delete: true },
      }
    },
    {
      id: '2',
      name: 'Manager',
      description: 'Department management and team oversight',
      users: 12,
      color: 'linear-gradient(135deg, #00B894 0%, #00856F 100%)',
      permissions: {
        users: { view: true, create: false, edit: true, delete: false },
        roles: { view: true, create: false, edit: false, delete: false },
        hr: { view: true, create: true, edit: true, delete: false },
        crm: { view: true, create: true, edit: true, delete: false },
        analytics: { view: true, create: false, edit: false, delete: false },
        settings: { view: true, create: false, edit: false, delete: false },
      }
    },
    {
      id: '3',
      name: 'Sales Representative',
      description: 'CRM and customer management access',
      users: 45,
      color: 'linear-gradient(135deg, #d946ef 0%, #e91e63 100%)',
      permissions: {
        users: { view: false, create: false, edit: false, delete: false },
        roles: { view: false, create: false, edit: false, delete: false },
        hr: { view: false, create: false, edit: false, delete: false },
        crm: { view: true, create: true, edit: true, delete: false },
        analytics: { view: true, create: false, edit: false, delete: false },
        settings: { view: false, create: false, edit: false, delete: false },
      }
    },
    {
      id: '4',
      name: 'HR Specialist',
      description: 'Human resources and employee management',
      users: 8,
      color: 'linear-gradient(135deg, #6C5CE7 0%, #5F3DC4 100%)',
      permissions: {
        users: { view: true, create: true, edit: true, delete: false },
        roles: { view: false, create: false, edit: false, delete: false },
        hr: { view: true, create: true, edit: true, delete: true },
        crm: { view: false, create: false, edit: false, delete: false },
        analytics: { view: true, create: false, edit: false, delete: false },
        settings: { view: false, create: false, edit: false, delete: false },
      }
    },
    {
      id: '5',
      name: 'Support Agent',
      description: 'Customer support and ticket management',
      users: 24,
      color: 'linear-gradient(135deg, #E67E22 0%, #D35400 100%)',
      permissions: {
        users: { view: false, create: false, edit: false, delete: false },
        roles: { view: false, create: false, edit: false, delete: false },
        hr: { view: false, create: false, edit: false, delete: false },
        crm: { view: true, create: false, edit: false, delete: false },
        analytics: { view: false, create: false, edit: false, delete: false },
        settings: { view: false, create: false, edit: false, delete: false },
      }
    },
  ]);

  permissionModules = [
    { id: 'users', label: 'User Management', icon: 'users' },
    { id: 'roles', label: 'Roles & Permissions', icon: 'shield' },
    { id: 'hr', label: 'HR Management', icon: 'briefcase' },
    { id: 'crm', label: 'CRM & Sales', icon: 'trending-up' },
    { id: 'analytics', label: 'Analytics', icon: 'bar-chart' },
    { id: 'settings', label: 'System Settings', icon: 'settings' },
  ];

  selectRole(role: any) {
    this.selectedRole.set(role);
  }

  openRoleModal() {
    this.showRoleModal.set(true);
  }

  closeRoleModal() {
    this.showRoleModal.set(false);
  }

  deleteRole(roleId: string) {
    console.log('Delete role:', roleId);
  }

  duplicateRole(role: any) {
    console.log('Duplicate role:', role);
  }
}
