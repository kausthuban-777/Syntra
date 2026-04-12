import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Tab Navigation Interface
 */
export interface TabItem {
  id: string;
  label: string;
  icon?: string; // SVG path or icon identifier
  badge?: number; // Optional badge count
}

/**
 * Generic Tab Navigation Component
 *
 * A reusable tab navigation component for switching between sections.
 * Can be used with any content sections that need tabbed navigation.
 *
 * Usage:
 * <app-tab-navigation
 *   [tabs]="tabs"
 *   [activeTabId]="activeSection()"
 *   (onTabChange)="onSectionChange($event)"
 * ></app-tab-navigation>
 */
@Component({
  selector: 'app-tab-navigation',
  imports: [CommonModule],
  templateUrl: './tab-navigation.html',
  styleUrl: './tab-navigation.css'
})
export class TabNavigation {
  /**
   * Array of tab items
   */
  @Input() tabs: TabItem[] = [];

  /**
   * Currently active tab ID
   */
  @Input() activeTabId = '';

  /**
   * Emits when user changes tab
   */
  @Output() onTabChange = new EventEmitter<string>();

  /**
   * Handle tab click
   */
  selectTab(tabId: string): void {
    this.onTabChange.emit(tabId);
  }

  /**
   * Check if tab is active
   */
  isTabActive(tabId: string): boolean {
    return this.activeTabId === tabId;
  }
}
