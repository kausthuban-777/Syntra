import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="progress-bar-container" [class.indeterminate]="indeterminate">
      <div
        class="progress-bar-fill"
        [style.width.%]="indeterminate ? 100 : value"
        [class.animated]="animated">
      </div>
    </div>
  `,
  styles: [`
    .progress-bar-container {
      width: 100%;
      height: 4px;
      background: var(--bg-primary);
      border-radius: 2px;
      overflow: hidden;
      position: relative;
    }

    .progress-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      border-radius: 2px;
      transition: width var(--animation-duration-normal) var(--animation-easing);
    }

    .progress-bar-fill.animated {
      animation: progressLoad 1.5s var(--animation-easing) forwards;
    }

    .indeterminate .progress-bar-fill {
      width: 30% !important;
      animation: indeterminateProgress 1.5s infinite var(--animation-easing);
    }

    @keyframes progressLoad {
      from {
        width: 0%;
      }
    }

    @keyframes indeterminateProgress {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(400%);
      }
    }
  `]
})
export class ProgressBarComponent {
  @Input() value: number = 0;
  @Input() indeterminate: boolean = false;
  @Input() animated: boolean = true;
}
