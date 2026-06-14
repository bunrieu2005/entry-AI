import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hand-heart-icon',
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
      class="hand-heart-icon">
      <g class="hand">
        <path d="M11 12.5V19a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-6.5" />
        <path d="M7 12.5V19a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-6.5" />
        <path d="M3 12.5V19a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-6.5" />
        <path d="M15 8.5l1.5-1.5l1.5 1.5" />
        <path d="M11 8.5l1.5-1.5l1.5 1.5" />
      </g>
      <path
        class="heart"
        d="m14.45 13.39 5.05-4.694C20.196 8 21 6.85 21 5.75a2.75 2.75 0 0 0-4.797-1.837.276.276 0 0 1-.406 0A2.75 2.75 0 0 0 11 5.75c0 1.2.802 2.248 1.5 2.946L16 11.95" />
    </svg>
  `,
  styles: [`
    .hand-heart-icon {
      overflow: visible;
      cursor: pointer;
    }
    .hand-heart-icon:hover .heart {
      animation: hh-heart 0.5s ease-in-out;
    }
    .hand-heart-icon:hover .hand {
      animation: hh-hand 0.5s ease-in-out;
    }
    @keyframes hh-heart {
      0%   { transform: scale(1); }
      30%  { transform: scale(1.3); }
      60%  { transform: scale(1); }
      100% { transform: scale(1); }
    }
    @keyframes hh-hand {
      0%, 100% { transform: translateY(0); }
      50%       { transform: translateY(2px); }
    }
  `]
})
export class HandHeartIconComponent {
  @Input() size: number = 20;
  @Input() color: string = 'currentColor';
  @Input() strokeWidth: number = 2;
}
