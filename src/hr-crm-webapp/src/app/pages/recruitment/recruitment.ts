import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-recruitment',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './recruitment.html',
  styleUrl: './recruitment.css',
})
export class Recruitment implements OnInit {
  private navigationService = inject(NavigationService);

  ngOnInit() {
    this.navigationService.setCurrentPage('recruitment');
  }
}
