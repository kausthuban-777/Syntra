import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-system-settings',
  imports: [CommonModule, FormsModule],
  templateUrl: './system-settings.html',
  styleUrl: './system-settings.css',
})
export class SystemSettings {
  themeService = inject(ThemeService);
  selectedCategory = signal('general');
  twoFactorAuth = signal(false);
  autoBackup = signal(true);
  maintenanceMode = signal(false);

  categories = [
    { id: 'general', label: 'General', icon: 'settings' },
    { id: 'security', label: 'Security', icon: 'shield' },
    { id: 'backup', label: 'Backup & Recovery', icon: 'database' },
    { id: 'advanced', label: 'Advanced', icon: 'code' },
  ];

  selectCategory(categoryId: string) {
    this.selectedCategory.set(categoryId);
  }

  toggleDarkMode() {
    this.themeService.toggleTheme();
  }

  saveSettings() {
    console.log('Settings saved');
  }
}
