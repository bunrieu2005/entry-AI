import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-copy-icon',
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
      class="copy-icon">
      <rect
        class="copy-rect"
        x="7" y="7"
        width="10.667" height="10.667"
        rx="2.667" ry="2.667" />
    </svg>
  `,
  styles: [`
    .copy-icon {
      overflow: visible;
      cursor: pointer;
      transition: transform 0.15s ease;
    }

    .copy-icon:hover .copy-rect {
      animation: copy-jump 0.3s ease-in-out;
    }

    @keyframes copy-jump {
      0%   { transform: translate(0, 0); }
      25%  { transform: translate(1px, 1px); }
      50%  { transform: translate(0, 0); }
      75%  { transform: translate(-1px, -1px); }
      100% { transform: translate(0, 0); }
    }
  `]
})
export class CopyIconComponent {
  @Input() size: number = 18;
  @Input() color: string = 'currentColor';
  @Input() strokeWidth: number = 2;
}
