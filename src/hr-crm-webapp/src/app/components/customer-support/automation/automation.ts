import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: string;
  action: string;
  status: 'active' | 'inactive' | 'draft';
  executionCount: number;
  successRate: number;
  lastExecuted?: Date;
  category: 'ticket' | 'response' | 'assignment' | 'notification';
}

interface AutomationTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  color: string;
}

interface AutomationMetric {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down';
  icon: string;
}

@Component({
  selector: 'app-automation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './automation.html',
  styleUrl: './automation.css'
})
export class Automation implements OnInit {
  automationRules: AutomationRule[] = [
    {
      id: 'rule-1',
      name: 'Auto-assign urgent tickets',
      description: 'Automatically assign tickets marked as urgent to senior support agents',
      trigger: 'Ticket priority set to urgent',
      action: 'Assign to senior agent pool',
      status: 'active',
      executionCount: 234,
      successRate: 98,
      lastExecuted: new Date('2024-04-24T11:30:00'),
      category: 'assignment'
    },
    {
      id: 'rule-2',
      name: 'Send welcome message',
      description: 'Send automated welcome message when customer initiates chat',
      trigger: 'New chat session started',
      action: 'Send welcome template',
      status: 'active',
      executionCount: 1456,
      successRate: 100,
      lastExecuted: new Date('2024-04-24T11:45:00'),
      category: 'response'
    },
    {
      id: 'rule-3',
      name: 'Escalate unresolved tickets',
      description: 'Escalate tickets that remain unresolved for more than 24 hours',
      trigger: 'Ticket open for 24+ hours',
      action: 'Escalate to manager',
      status: 'active',
      executionCount: 45,
      successRate: 95,
      lastExecuted: new Date('2024-04-24T09:00:00'),
      category: 'ticket'
    },
    {
      id: 'rule-4',
      name: 'Customer satisfaction survey',
      description: 'Send satisfaction survey after ticket is resolved',
      trigger: 'Ticket status changed to resolved',
      action: 'Send CSAT survey',
      status: 'active',
      executionCount: 567,
      successRate: 92,
      lastExecuted: new Date('2024-04-24T10:15:00'),
      category: 'notification'
    },
    {
      id: 'rule-5',
      name: 'Tag billing inquiries',
      description: 'Automatically tag tickets containing billing keywords',
      trigger: 'Ticket contains billing keywords',
      action: 'Add billing tag',
      status: 'active',
      executionCount: 189,
      successRate: 97,
      lastExecuted: new Date('2024-04-24T11:00:00'),
      category: 'ticket'
    },
    {
      id: 'rule-6',
      name: 'After-hours auto-response',
      description: 'Send automated response during non-business hours',
      trigger: 'Message received outside business hours',
      action: 'Send after-hours message',
      status: 'inactive',
      executionCount: 0,
      successRate: 0,
      category: 'response'
    }
  ];

  templates: AutomationTemplate[] = [
    {
      id: 'temp-1',
      name: 'Auto-assign by keyword',
      description: 'Route tickets to specific teams based on keywords',
      category: 'Assignment',
      icon: '🎯',
      color: '#667eea'
    },
    {
      id: 'temp-2',
      name: 'Priority escalation',
      description: 'Automatically escalate high-priority tickets',
      category: 'Escalation',
      icon: '⚡',
      color: '#d946ef'
    },
    {
      id: 'temp-3',
      name: 'Response templates',
      description: 'Send pre-defined responses based on ticket type',
      category: 'Response',
      icon: '💬',
      color: '#06b6d4'
    },
    {
      id: 'temp-4',
      name: 'SLA monitoring',
      description: 'Monitor and alert on SLA breaches',
      category: 'Monitoring',
      icon: '⏱️',
      color: '#f59e0b'
    }
  ];

  metrics: AutomationMetric[] = [
    {
      label: 'Active Rules',
      value: 5,
      change: 2,
      trend: 'up',
      icon: '⚙️'
    },
    {
      label: 'Executions Today',
      value: 2491,
      change: 12,
      trend: 'up',
      icon: '🚀'
    },
    {
      label: 'Success Rate',
      value: 96,
      change: 3,
      trend: 'up',
      icon: '✅'
    },
    {
      label: 'Time Saved',
      value: 18,
      change: 5,
      trend: 'up',
      icon: '⏰'
    }
  ];

  filteredRules: AutomationRule[] = [];
  selectedCategory: string = 'all';
  selectedStatus: string = 'all';
  showCreateModal: boolean = false;

  ngOnInit() {
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.automationRules];

    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(r => r.category === this.selectedCategory);
    }

    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(r => r.status === this.selectedStatus);
    }

    filtered.sort((a, b) => {
      if (a.status === 'active' && b.status !== 'active') return -1;
      if (a.status !== 'active' && b.status === 'active') return 1;
      return b.executionCount - a.executionCount;
    });

    this.filteredRules = filtered;
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;
    this.applyFilters();
  }

  filterByStatus(status: string) {
    this.selectedStatus = status;
    this.applyFilters();
  }

  toggleRuleStatus(rule: AutomationRule, event: Event) {
    event.stopPropagation();
    rule.status = rule.status === 'active' ? 'inactive' : 'active';
    this.applyFilters();
  }

  editRule(rule: AutomationRule) {
  }

  deleteRule(rule: AutomationRule, event: Event) {
    event.stopPropagation();
    const index = this.automationRules.indexOf(rule);
    if (index > -1) {
      this.automationRules.splice(index, 1);
      this.applyFilters();
    }
  }

  duplicateRule(rule: AutomationRule, event: Event) {
    event.stopPropagation();
    const newRule = { ...rule, id: `rule-${Date.now()}`, name: `${rule.name} (Copy)`, status: 'draft' as const };
    this.automationRules.push(newRule);
    this.applyFilters();
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      ticket: '🎫',
      response: '💬',
      assignment: '👥',
      notification: '🔔'
    };
    return icons[category] || '⚙️';
  }

  getTimeAgo(date?: Date): string {
    if (!date) return 'Never';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }

  openCreateModal() {
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
  }

  useTemplate(template: AutomationTemplate) {
    this.openCreateModal();
  }
}
