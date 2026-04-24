import { Directive, ElementRef, Input, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appStaggerAnimation]',
  standalone: true
})
export class StaggerAnimationDirective implements AfterViewInit, OnDestroy {
  @Input() appStaggerAnimation: string = 'animate-fade-in-up';
  @Input() staggerDelay: number = 50;
  @Input() threshold: number = 0.1;

  private observer: IntersectionObserver | null = null;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    const children = Array.from(this.el.nativeElement.children) as HTMLElement[];

    children.forEach((child) => {
      child.style.opacity = '0';
    });

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            children.forEach((child, index) => {
              setTimeout(() => {
                child.classList.add(this.appStaggerAnimation);
                child.style.opacity = '1';
              }, index * this.staggerDelay);
            });

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
