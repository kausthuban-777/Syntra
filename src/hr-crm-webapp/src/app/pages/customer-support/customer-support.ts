import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-customer-support',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './customer-support.html',
  styleUrl: './customer-support.css',
  standalone: true
})
export class CustomerSupport implements OnInit {
  private navigationService = inject(NavigationService);

  ngOnInit() {
    this.navigationService.setCurrentPage('support');
  }
}
