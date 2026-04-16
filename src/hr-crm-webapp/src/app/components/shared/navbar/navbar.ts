import { Component, AfterViewInit, inject, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { ThemeService } from '../../../services/theme.service';
import { AuthService } from '../../../services/auth.service';
import { NavigationService, SidebarItem } from '../../../services/navigation.service';
import { filter } from 'rxjs';

interface NavMenu {
  id: string;
  label: string;
  route: string;
  subroutes: SidebarItem[];
}

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements AfterViewInit {
  themeService = inject(ThemeService);
  authService = inject(AuthService);
  router = inject(Router);
  navigationService = inject(NavigationService);
  private platformId = inject(PLATFORM_ID);
  activeLink = signal('home');
  mobileMenuOpen = signal(false);
  activeDropdown = signal<string | null>(null);

  navMenus: NavMenu[] = [
    { id: 'home', label: 'Dashboard', route: '/home', subroutes: [] },
    { id: 'hr', label: 'HR', route: '/hr', subroutes: [] },
    { id: 'recruitment', label: 'Recruitment', route: '/recruitment', subroutes: [] },
    { id: 'crm', label: 'CRM', route: '/crm', subroutes: [] },
    { id: 'analytics', label: 'Analytics', route: '/analytics', subroutes: [] },
    { id: 'support', label: 'Support', route: '/support', subroutes: [] },
    { id: 'administration', label: 'Administration', route: '/administration', subroutes: [] },
    { id: 'integrations', label: 'Integrations', route: '/integrations', subroutes: [] }
  ];

  constructor() {
    this.initializeNavMenus();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const urlSegments = event.url.split('/').filter((segment: string) => segment && segment !== '?');
      const mainRoute = urlSegments[0] || 'home';
      this.activeLink.set(mainRoute);
      this.navigationService.setCurrentPage(mainRoute);
      this.mobileMenuOpen.set(false);
    });
  }

  private initializeNavMenus() {
    this.navMenus.forEach(menu => {
      const sidebarStructure: Record<string, SidebarItem[]> = {
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
          { id: 'interviews', label: 'Interviews', icon: 'handshake', route: '/recruitment/interviews' }
        ],
        crm: [
          { id: 'leads', label: 'Leads', icon: 'gem', route: '/crm/leads' },
          { id: 'customers', label: 'Customers', icon: 'address-book', route: '/crm/customers' },
          { id: 'deals', label: 'Deals', icon: 'handshake', route: '/crm/deals' },
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
      menu.subroutes = sidebarStructure[menu.id] || [];
    });
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.setupThemeToggle();
    }
  }

  private setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.themeService.toggleTheme());
    }
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.set(!this.mobileMenuOpen());
  }

  toggleDropdown(menuId: string) {
    if (this.activeDropdown() === menuId) {
      this.activeDropdown.set(null);
    } else {
      this.activeDropdown.set(menuId);
    }
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
    this.activeDropdown.set(null);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
