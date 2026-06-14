import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      [attr.width]="size"
      [attr.height]="size"
      viewBox="0 0 48 48"
      fill="none"
      [attr.stroke]="color"
      [attr.stroke-width]="strokeWidth"
      stroke-miterlimit="10"
      stroke-linecap="square"
      class="book-icon">
      <path class="book-spine" d="M24 40.5V41L24 10V10.5" />
      <path
        class="book-cover"
        d="M24 41C31.0005 36.9995 37.9995 36.9995 45 41V10.0003C37.9995 5.99989 31.0005 5.99989 24 10.0003C16.9995 5.99989 10.0005 5.99989 3 10.0003V41C10.0005 36.9995 16.9995 36.9995 24 41Z" />
      <path class="book-line book-line-1" d="M30 16.5C32.8362 15.1345 36.5662 15.06 39.5 16.2763" />
      <path class="book-line book-line-2" d="M30 23.5832C32.8362 22.2178 36.5662 22.1432 39.5 23.3596" />
      <path class="book-line book-line-3" d="M30 30.6665C32.8362 29.301 36.5662 29.2265 39.5 30.4428" />
    </svg>
  `,
  styles: [`
    .book-icon {
      overflow: visible;
      cursor: pointer;
    }
    .book-icon:hover .book-line-1 {
      animation: book-line1 0.3s ease-in-out 0.1s;
    }
    .book-icon:hover .book-line-2 {
      animation: book-line2 0.3s ease-in-out 0.15s;
    }
    .book-icon:hover .book-line-3 {
      animation: book-line3 0.3s ease-in-out 0.2s;
    }
    @keyframes book-line1 {
      0%   { opacity: 0; transform: translateX(-3px); }
      100% { opacity: 1; transform: translateX(0); }
    }
    @keyframes book-line2 {
      0%   { opacity: 0; transform: translateX(-3px); }
      100% { opacity: 1; transform: translateX(0); }
    }
    @keyframes book-line3 {
      0%   { opacity: 0; transform: translateX(-3px); }
      100% { opacity: 1; transform: translateX(0); }
    }
  `]
})
export class BookIconComponent {
  @Input() size: number = 20;
  @Input() color: string = 'currentColor';
  @Input() strokeWidth: number = 2;
}
