import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-heart-icon',
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
      class="heart-icon"
      [class.heart-icon--filled]="filled"
      [class.heart-icon--sm]="size <= 16">
      <path
        class="heart-path"
        d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"
        [attr.fill]="filled ? color : 'none'" />
    </svg>
  `,
  styles: [`
    .heart-icon {
      overflow: visible;
      cursor: pointer;
      transition: transform 0.15s ease;
    }

    .heart-icon:hover .heart-path {
      animation: heart-pop 0.6s ease-out;
    }

    @keyframes heart-pop {
      0%   { transform: scale(1); }
      15%  { transform: scale(1.15); }
      30%  { transform: scale(1); }
      50%  { transform: scale(1.25); }
      100% { transform: scale(1); }
    }
  `]
})
export class HeartIconComponent {
  @Input() size: number = 18;
  @Input() color: string = 'currentColor';
  @Input() strokeWidth: number = 2;
  @Input() filled: boolean = false;
}
