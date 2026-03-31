import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { Sidebar } from '../sidebar/sidebar';
import { Footer } from '../footer/footer';
import { ContentArea } from '../content-area/content-area';
import { NavigationService } from '../../../services/navigation.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Navbar, Sidebar, Footer, ContentArea],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {
  navigationService = inject(NavigationService);

  get sidebarOpen() {
    return this.navigationService.sidebarOpen();
  }
}
