import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-hr-management',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './hr-management.html',
  styleUrl: './hr-management.css',
  standalone: true
})
export class HrManagement implements OnInit {
  private navigationService = inject(NavigationService);

  ngOnInit() {
    this.navigationService.setCurrentPage('hr');
  }
}
