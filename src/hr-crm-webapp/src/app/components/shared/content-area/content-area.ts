import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { fadeAnimation } from '../../../animations/route-animations';

@Component({
  selector: 'app-content-area',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './content-area.html',
  styleUrl: './content-area.css',
  animations: [fadeAnimation]
})
export class ContentArea {
  prepareRoute(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'];
  }
}
