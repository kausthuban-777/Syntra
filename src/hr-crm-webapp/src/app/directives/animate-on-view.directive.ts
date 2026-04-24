import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appAnimateOnView]',
  standalone: true
})
export class AnimateOnViewDirective implements OnInit, OnDestroy {
  @Input() appAnimateOnView: string = 'animate-fade-in-up';
  @Input() animationDelay: number = 0;
  @Input() threshold: number = 0.1;

  private observer: IntersectionObserver | null = null;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.el.nativeElement.style.opacity = '0';

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              this.el.nativeElement.classList.add(this.appAnimateOnView);
              this.el.nativeElement.style.opacity = '1';
            }, this.animationDelay);

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

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
