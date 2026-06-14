import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-icon',
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
      class="home-icon">
      <path class="roof" d="M5 12l-2 0l9 -9l9 9l-2 0" />
      <path class="house" d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
      <path class="door" d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
    </svg>
  `,
  styles: [`
    .home-icon {
      overflow: visible;
      cursor: pointer;
    }
    .home-icon:hover .roof {
      animation: home-roof 0.4s ease-out;
    }
    .home-icon:hover .house {
      animation: home-house 0.3s ease-out 0.1s;
    }
    .home-icon:hover .door {
      animation: home-door 0.3s ease-out 0.2s;
    }
    @keyframes home-roof {
      0%   { transform: translateY(-2px); opacity: 0.6; }
      100% { transform: translateY(0); opacity: 1; }
    }
    @keyframes home-house {
      0%   { transform: scale(0.95); }
      100% { transform: scale(1); }
    }
    @keyframes home-door {
      0%   { transform: scaleY(0); }
      100% { transform: scaleY(1); }
    }
  `]
})
export class HomeIconComponent {
  @Input() size: number = 20;
  @Input() color: string = 'currentColor';
  @Input() strokeWidth: number = 2;
}
