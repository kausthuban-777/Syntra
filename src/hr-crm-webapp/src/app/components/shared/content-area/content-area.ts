import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-content-area',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './content-area.html',
  styleUrl: './content-area.css'
})
export class ContentArea {}
