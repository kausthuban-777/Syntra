import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavigationService } from '../../../services/navigation.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  navigationService = inject(NavigationService);

  get sidebarItems() {
    return this.navigationService.getSidebarItems();
  }

  get isSidebarOpen() {
    return this.navigationService.sidebarOpen();
  }

  toggleSidebar() {
    this.navigationService.toggleSidebar();
  }
}
