import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Customer Support</h1>
      </div>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 20px;
    }

    .page-header {
      margin-bottom: 20px;
    }

    .page-header h1 {
      font-size: 28px;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }
  `]
})
export class Support implements OnInit {
  private navigationService = inject(NavigationService);

  ngOnInit() {
    this.navigationService.setCurrentPage('support');
  }
}
