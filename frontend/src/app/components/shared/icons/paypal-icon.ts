import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paypal-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      [attr.width]="size"
      [attr.height]="size"
      viewBox="0 0 24 24"
      fill="none"
      [attr.stroke]="color"
      [attr.stroke-width]="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="paypal-icon">
      <path
        class="p-front"
        d="M10 13l2.5 0c2.5 0 5 -2.5 5 -5c0 -3 -1.9 -5 -5 -5h-5.5c-.5 0 -1 .5 -1 1l-2 14c0 .5 .5 1 1 1h2.8l1.2 -5c.1 -.6 .4 -1 1 -1" />
      <path
        class="p-back"
        d="M17.5 7.2c1.7 1 2.5 2.8 2.5 4.8c0 2.5 -2.5 4.5 -5 4.5h-2.6l-.6 3.6a1 1 0 0 1 -1 .8l-2.7 0a.5 .5 0 0 1 -.5 -.6l.2 -1.4" />
    </svg>
  `,
  styles: [`
    .paypal-icon {
      overflow: visible;
      cursor: pointer;
    }
    .paypal-icon:hover .p-front {
      animation: paypal-front 0.6s ease-out;
    }
    .paypal-icon:hover .p-back {
      animation: paypal-back 0.6s ease-out;
    }
    @keyframes paypal-front {
      0%   { transform: translate(0, 0); }
      30%  { transform: translate(-2px, 2px); }
      60%  { transform: translate(-2px, 2px); }
      100% { transform: translate(0, 0); }
    }
    @keyframes paypal-back {
      0%   { transform: translate(0, 0); }
      30%  { transform: translate(2px, -2px); }
      60%  { transform: translate(2px, -2px); }
      100% { transform: translate(0, 0); }
    }
  `]
})
export class PaypalIconComponent {
  @Input() size: number = 20;
  @Input() color: string = 'currentColor';
  @Input() strokeWidth: number = 2;
}
