import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { NotFound } from './pages/not-found/not-found';
import { Analytics } from './pages/analytics/analytics';
import { HrManagement } from './pages/hr-management/hr-management';
import { Recruitment } from './pages/recruitment/recruitment';
import { Crm } from './pages/crm/crm';
import { CustomerSupport } from './pages/customer-support/customer-support';
import { Administration } from './pages/administration/administration';
import { Integrations } from './pages/integrations/integrations';
import { AuthGuard } from './services/auth.guard';
import { Dashboard } from './components/home/dashboard/dashboard';
import { Employees } from './components/hr/employees/employees';
import { Attendance } from './components/hr/attendance/attendance';
import { Payroll } from './components/hr/payroll/payroll';
import { LeaveRequests } from './components/hr/leave-requests/leave-requests';
import { EmployeeDocuments } from './components/hr/employee-documents/employee-documents';
import { Candidates } from './components/recruitment/candidates/candidates';
import { HiringPipeline } from './components/recruitment/hiring-pipeline/hiring-pipeline';
import { JobOpenings } from './components/recruitment/job-openings/job-openings';
import { InterviewScheduling } from './components/recruitment/interview-scheduling/interview-scheduling';
import { Leads } from './components/crm/leads/leads';
import { Customers } from './components/crm/customers/customers';
import { Deals } from './components/crm/deals/deals';
import { SalesPipeline } from './components/crm/sales-pipeline/sales-pipeline';
import { Quotations } from './components/crm/quotations/quotations';
import { Invoices } from './components/crm/invoices/invoices';
import { Payments } from './components/crm/payments/payments';
import { SalesReports } from './components/analytics/sales-reports/sales-reports';
import { HrReports } from './components/analytics/hr-reports/hr-reports';
import { RecruitmentReports } from './components/analytics/recruitment-reports/recruitment-reports';
import { CustomReports } from './components/analytics/custom-reports/custom-reports';
import { Inbox } from './components/customer-support/inbox/inbox';
import { Tickets } from './components/customer-support/tickets/tickets';
import { ChatChannels } from './components/customer-support/chat-channels/chat-channels';
import { Automation } from './components/customer-support/automation/automation';
import { Users } from './components/administration/users/users';
import { Roles } from './components/administration/roles/roles';
import { SystemSettings } from './components/administration/system-settings/system-settings';
import { AuditLogs } from './components/administration/audit-logs/audit-logs';
import { Notifications } from './components/administration/notifications/notifications';
import { Slack } from './components/integrations/slack/slack';
import { GoogleWorkspace } from './components/integrations/google-workspace/google-workspace';
import { PaymentGateway } from './components/integrations/payment-gateway/payment-gateway';
import { Accounting } from './components/integrations/accounting/accounting';
import { WhatsappApi } from './components/integrations/whatsapp-api/whatsapp-api';
import { ReportsComponent } from './components/home/reports/reports';


export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: Login, pathMatch: 'full' },

  // Home routes
  {
    path: 'home',
    component: Home,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
      { path: 'reports', component: ReportsComponent }
    ]
  },

  // HR routes
  {
    path: 'hr',
    component: HrManagement,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'employees', pathMatch: 'full' },
      { path: 'employees', component: Employees },
      { path: 'attendance', component: Attendance },
      { path: 'payroll', component: Payroll },
      { path: 'leave-requests', component: LeaveRequests },
      { path: 'documents', component: EmployeeDocuments }
    ]
  },

  // Recruitment routes
  {
    path: 'recruitment',
    component: Recruitment,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'candidates', pathMatch: 'full' },
      { path: 'candidates', component: Candidates },
      { path: 'positions', component: HiringPipeline },
      { path: 'postings', component: JobOpenings },
      { path: 'interviews', component: InterviewScheduling }
    ]
  },

  // CRM routes
  {
    path: 'crm',
    component: Crm,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'leads', pathMatch: 'full' },
      { path: 'leads', component: Leads },
      { path: 'customers', component: Customers },
      { path: 'deals', component: Deals },
      { path: 'sales-pipeline', component: SalesPipeline },
      { path: 'quotations', component: Quotations },
      { path: 'invoices', component: Invoices },
      { path: 'payments', component: Payments }
    ]
  },

  // Analytics routes
  {
    path: 'analytics',
    component: Analytics,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'sales', pathMatch: 'full' },
      { path: 'sales', component: SalesReports },
      { path: 'hr', component: HrReports },
      { path: 'recruitment', component: RecruitmentReports },
      { path: 'custom', component: CustomReports }
    ]
  },

  // Support routes
  {
    path: 'support',
    component: CustomerSupport,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'inbox', pathMatch: 'full' },
      { path: 'inbox', component: Inbox },
      { path: 'tickets', component: Tickets },
      { path: 'chat', component: ChatChannels },
      { path: 'automation', component: Automation}
    ]
  },

  // Administration routes
  {
    path: 'administration',
    component: Administration,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      { path: 'users', component: Users },
      { path: 'roles', component: Roles },
      { path: 'settings', component: SystemSettings },
      { path: 'audit-logs', component: AuditLogs },
      { path: 'notifications', component: Notifications }
    ]
  },

  // Integrations routes
  {
    path: 'integrations',
    component: Integrations,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'slack', pathMatch: 'full' },
      { path: 'slack', component: Slack },
      { path: 'google', component: GoogleWorkspace },
      { path: 'payment', component: PaymentGateway },
      { path: 'accounting', component: Accounting },
      { path: 'whatsapp', component: WhatsappApi }
    ]
  },

  // Legacy routes
  {path: 'leads', redirectTo: 'crm/leads', pathMatch: 'full'},
  {path: 'sales', redirectTo: 'crm/sales-pipeline', pathMatch: 'full'},

  // 404 handling
  { path: 'not-found', component: NotFound, pathMatch: 'full' },
  { path: '**', redirectTo: 'not-found' },
];
