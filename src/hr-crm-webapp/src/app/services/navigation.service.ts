import { Injectable, signal } from '@angular/core';

export interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  iconType?: 'fa' | 'bi'; // 'fa' for FontAwesome, 'bi' for Bootstrap Icons (default: 'bi')
}

export interface SidebarSection {
  id: string;
  label: string;
  items: SidebarItem[];
}

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  currentPage = signal<string>('home');
  sidebarOpen = signal<boolean>(true);

  private sidebarStructure: Record<string, SidebarItem[]> = {
    home: [
      { id: 'dashboard', label: 'Dashboard', icon: 'graph-up', route: '/home/dashboard' },
      { id: 'reports', label: 'Reports', icon: 'file-earmark-bar-graph', route: '/home/reports' }
    ],
    hr: [
      { id: 'employees', label: 'Employees', icon: 'people', route: '/hr/employees' },
      { id: 'attendance', label: 'Attendance', icon: 'clock', route: '/hr/attendance' },
      { id: 'payroll', label: 'Payroll', icon: 'cash-coin', route: '/hr/payroll' },
      { id: 'leave-requests', label: 'Leave Requests', icon: 'calendar-check', route: '/hr/leave-requests' },
      { id: 'documents', label: 'Documents', icon: 'file-earmark', route: '/hr/documents' }
    ],
    recruitment: [
      { id: 'candidates', label: 'Candidates', icon: 'person-workspace', route: '/recruitment/candidates' },
      { id: 'open-positions', label: 'Open Positions', icon: 'briefcase', route: '/recruitment/positions' },
      { id: 'job-postings', label: 'Job Postings', icon: 'newspaper', route: '/recruitment/postings' },
      { id: 'interviews', label: 'Interviews', icon: 'handshake', route: '/recruitment/interviews', iconType: 'fa' }
    ],
    crm: [
      { id: 'leads', label: 'Leads', icon: 'gem', route: '/crm/leads' },
      { id: 'customers', label: 'Customers', icon: 'address-book', route: '/crm/customers', iconType: 'fa' },
      { id: 'deals', label: 'Deals', icon: 'handshake', route: '/crm/deals', iconType: 'fa' },
      { id: 'sales-pipeline', label: 'Sales Pipeline', icon: 'graph-up-arrow', route: '/crm/sales-pipeline' },
      { id: 'quotations', label: 'Quotations', icon: 'quote', route: '/crm/quotations' },
      { id: 'invoices', label: 'Invoices', icon: 'receipt', route: '/crm/invoices' },
      { id: 'payments', label: 'Payments', icon: 'credit-card', route: '/crm/payments' }
    ],
    analytics: [
      { id: 'sales-analytics', label: 'Sales Analytics', icon: 'graph-up', route: '/analytics/sales' },
      { id: 'hr-analytics', label: 'HR Analytics', icon: 'bar-chart', route: '/analytics/hr' },
      { id: 'recruitment-analytics', label: 'Recruitment Analytics', icon: 'pie-chart', route: '/analytics/recruitment' },
      { id: 'custom-reports', label: 'Custom Reports', icon: 'file-earmark-pdf', route: '/analytics/custom' }
    ],
    support: [
      { id: 'inbox', label: 'Inbox', icon: 'inbox', route: '/support/inbox' },
      { id: 'tickets', label: 'Tickets', icon: 'ticket', route: '/support/tickets' },
      { id: 'chat-channels', label: 'Chat Channels', icon: 'chat-dots', route: '/support/chat' },
      { id: 'automation', label: 'Automation', icon: 'robot', route: '/support/automation' }
    ],
    administration: [
      { id: 'users', label: 'Users', icon: 'gear', route: '/administration/users' },
      { id: 'roles', label: 'Roles', icon: 'shield-check', route: '/administration/roles' },
      { id: 'settings', label: 'Settings', icon: 'sliders', route: '/administration/settings' },
      { id: 'audit-logs', label: 'Audit Logs', icon: 'arrow-clockwise', route: '/administration/audit-logs' },
      { id: 'notifications', label: 'Notifications', icon: 'bell', route: '/administration/notifications' }
    ],
    integrations: [
      { id: 'slack', label: 'Slack', icon: 'slack', route: '/integrations/slack' },
      { id: 'google-workspace', label: 'Google Workspace', icon: 'google', route: '/integrations/google' },
      { id: 'payment-gateway', label: 'Payment Gateway', icon: 'credit-card', route: '/integrations/payment' },
      { id: 'accounting', label: 'Accounting', icon: 'calculator', route: '/integrations/accounting' },
      { id: 'whatsapp', label: 'WhatsApp', icon: 'whatsapp', route: '/integrations/whatsapp' }
    ]
  };

  getSidebarItems(): SidebarItem[] {
    const page = this.currentPage();
    return this.sidebarStructure[page] || this.sidebarStructure['home'];
  }

  setCurrentPage(page: string) {
    this.currentPage.set(page);
  }

  toggleSidebar() {
    this.sidebarOpen.set(!this.sidebarOpen());
  }
}
