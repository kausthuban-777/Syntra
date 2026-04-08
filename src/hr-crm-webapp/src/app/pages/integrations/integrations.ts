import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-integrations',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './integrations.html',
  styleUrl: './integrations.css',
})
export class Integrations implements OnInit {
  private navigationService = inject(NavigationService);

  ngOnInit() {
    this.navigationService.setCurrentPage('integrations');
  }
}
