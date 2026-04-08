import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-crm',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './crm.html',
  styleUrl: './crm.css',
})
export class Crm implements OnInit {
  private navigationService = inject(NavigationService);

  ngOnInit() {
    this.navigationService.setCurrentPage('crm');
  }
}
