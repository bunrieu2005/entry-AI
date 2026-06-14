import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logout-icon',
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
      class="logout-icon">
      <path class="logout-door" d="M14 8v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-2" />
      <path class="logout-arrow" d="M9 12h12" />
      <path class="logout-arrow-bottom" d="M18 15l3-3l-3-3" />
    </svg>
  `,
  styles: [`
    .logout-icon {
      overflow: visible;
      cursor: pointer;
    }
    .logout-icon:hover .logout-arrow,
    .logout-icon:hover .logout-arrow-bottom {
      animation: logout-slide 0.3s ease-in-out;
    }
    .logout-icon:hover .logout-door {
      animation: logout-door 0.25s ease-out;
    }
    @keyframes logout-slide {
      0%   { transform: translateX(0); }
      40%  { transform: translateX(5px); }
      100% { transform: translateX(0); }
    }
    @keyframes logout-door {
      0%   { transform: translateX(0); }
      40%  { transform: translateX(-2px); }
      100% { transform: translateX(0); }
    }
  `]
})
export class LogoutIconComponent {
  @Input() size: number = 20;
  @Input() color: string = 'currentColor';
  @Input() strokeWidth: number = 2;
}
