import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-triangle-alert-icon',
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
      class="triangle-alert-icon">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  `,
  styles: [`
    .triangle-alert-icon {
      overflow: visible;
      cursor: pointer;
    }
  `]
})
export class TriangleAlertIconComponent {
  @Input() size: number = 18;
  @Input() color: string = 'currentColor';
  @Input() strokeWidth: number = 2;
}
