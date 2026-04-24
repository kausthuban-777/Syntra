import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appCountUp]',
  standalone: true
})
export class CountUpDirective implements OnInit, OnDestroy {
  @Input() appCountUp: number = 0;
  @Input() duration: number = 1000;
  @Input() threshold: number = 0.1;

  private observer: IntersectionObserver | null = null;
  private hasAnimated = false;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.hasAnimated) {
            this.hasAnimated = true;
            this.animateCount();

            if (this.observer) {
              this.observer.unobserve(this.el.nativeElement);
            }
          }
        });
      },
      { threshold: this.threshold }
    );

    this.observer.observe(this.el.nativeElement);
  }

  private animateCount() {
    const start = 0;
    const end = this.appCountUp;
    const startTime = performance.now();

    const updateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / this.duration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(easeOutQuart * (end - start) + start);

      this.el.nativeElement.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        this.el.nativeElement.textContent = end.toLocaleString();
      }
    };

    requestAnimationFrame(updateCount);
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
