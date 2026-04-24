import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton-wrapper" [class]="wrapperClass">
      @if (type === 'card') {
        <div class="skeleton skeleton-card"></div>
      }
      @if (type === 'title') {
        <div class="skeleton skeleton-title"></div>
      }
      @if (type === 'text') {
        <div class="skeleton skeleton-text" [style.width]="width"></div>
      }
      @if (type === 'circle') {
        <div class="skeleton skeleton-circle" [style.width]="size" [style.height]="size"></div>
      }
      @if (type === 'custom') {
        <div class="skeleton" [style.width]="width" [style.height]="height"></div>
      }
    </div>
  `,
  styles: [`
    .skeleton-wrapper {
      display: block;
    }

    .skeleton {
      background: linear-gradient(
        90deg,
        var(--bg-card) 0%,
        rgba(118, 75, 162, 0.08) 50%,
        var(--bg-card) 100%
      );
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 8px;
    }

    .skeleton-card {
      height: 200px;
      width: 100%;
    }

    .skeleton-title {
      height: 2em;
      width: 60%;
      margin-bottom: 1em;
    }

    .skeleton-text {
      height: 1em;
      margin-bottom: 0.5em;
    }

    .skeleton-circle {
      border-radius: 50%;
    }

    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }
  `]
})
export class LoadingSkeletonComponent {
  @Input() type: 'card' | 'title' | 'text' | 'circle' | 'custom' = 'text';
  @Input() width: string = '100%';
  @Input() height: string = 'auto';
  @Input() size: string = '40px';
  @Input() wrapperClass: string = '';
}
