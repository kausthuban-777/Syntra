import { trigger, transition, style, query, animate, group } from '@angular/animations';

export const fadeAnimation = trigger('fadeAnimation', [
  transition('* <=> *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(10px)' })
    ], { optional: true }),
    query(':leave', [
      animate('200ms ease-out', style({ opacity: 0, transform: 'translateY(-10px)' }))
    ], { optional: true }),
    query(':enter', [
      animate('300ms 100ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
    ], { optional: true })
  ])
]);

export const slideAnimation = trigger('slideAnimation', [
  transition('* <=> *', [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        width: '100%'
      })
    ], { optional: true }),
    group([
      query(':leave', [
        animate('300ms ease-out', style({
          opacity: 0,
          transform: 'translateX(-50px)'
        }))
      ], { optional: true }),
      query(':enter', [
        style({ opacity: 0, transform: 'translateX(50px)' }),
        animate('300ms 100ms ease-out', style({
          opacity: 1,
          transform: 'translateX(0)'
        }))
      ], { optional: true })
    ])
  ])
]);

export const scaleAnimation = trigger('scaleAnimation', [
  transition('* <=> *', [
    query(':enter', [
      style({ opacity: 0, transform: 'scale(0.95)' })
    ], { optional: true }),
    query(':leave', [
      animate('200ms ease-out', style({ opacity: 0, transform: 'scale(1.05)' }))
    ], { optional: true }),
    query(':enter', [
      animate('300ms 100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
    ], { optional: true })
  ])
]);
