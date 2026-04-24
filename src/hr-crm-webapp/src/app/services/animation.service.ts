import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  private prefersReducedMotion: boolean;

  constructor() {
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  shouldAnimate(): boolean {
    return !this.prefersReducedMotion;
  }

  getAnimationDuration(type: 'fast' | 'normal' | 'slow' = 'normal'): number {
    if (!this.shouldAnimate()) return 0;

    const durations = {
      fast: 200,
      normal: 300,
      slow: 500
    };

    return durations[type];
  }

  animateElement(element: HTMLElement, animation: string, duration: number = 300): Promise<void> {
    if (!this.shouldAnimate()) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      element.classList.add(animation);

      setTimeout(() => {
        element.classList.remove(animation);
        resolve();
      }, duration);
    });
  }

  staggerElements(elements: HTMLElement[], animation: string, delay: number = 50): void {
    if (!this.shouldAnimate()) {
      return;
    }

    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add(animation);
      }, index * delay);
    });
  }
}
