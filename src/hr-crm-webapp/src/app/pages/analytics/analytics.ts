import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './analytics.html',
  styleUrl: './analytics.css',
})
export class Analytics implements OnInit {
  private navigationService = inject(NavigationService);

  ngOnInit() {
    this.navigationService.setCurrentPage('analytics');
  }
}
