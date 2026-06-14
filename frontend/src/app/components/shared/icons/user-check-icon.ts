import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-check-icon',
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
      class="user-check-icon">
      <g class="user-avatar">
        <circle cx="10" cy="7" r="4" />
        <path d="M2 21v-2a4 4 0 0 1 4-4h4" />
      </g>
      <path
        class="check-mark"
        d="M15 19l2 2l4 -4" />
    </svg>
  `,
  styles: [`
    .user-check-icon {
      overflow: visible;
      cursor: pointer;
    }
    .user-check-icon:hover .user-avatar {
      animation: user-bounce 0.25s ease-out;
    }
    .user-check-icon:hover .check-mark {
      animation: check-draw 0.4s ease-out;
    }
    @keyframes user-bounce {
      0%   { transform: translateY(0) scale(1); }
      50%  { transform: translateY(-1px) scale(1.05); }
      100% { transform: translateY(0) scale(1); }
    }
    @keyframes check-draw {
      0%   { opacity: 0.4; transform: scale(0.8); }
      60%  { opacity: 1;   transform: scale(1.1); }
      100% { opacity: 1;   transform: scale(1); }
    }
  `]
})
export class UserCheckIconComponent {
  @Input() size: number = 20;
  @Input() color: string = 'currentColor';
  @Input() strokeWidth: number = 2;
}
