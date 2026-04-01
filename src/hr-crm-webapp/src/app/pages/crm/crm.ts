import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-crm',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './crm.html',
  styleUrl: './crm.css',
})
export class Crm implements OnInit {
  private navigationService = inject(NavigationService);

  ngOnInit() {
    this.navigationService.setCurrentPage('crm');
  }
}
