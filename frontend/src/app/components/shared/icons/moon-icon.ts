import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-moon-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      [attr.width]="size"
      [attr.height]="size"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      [attr.stroke-width]="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="moon-icon">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>
    </svg>
  `,
  styles: [`
    .moon-icon { display: block; overflow: visible; }
  `]
})
export class MoonIconComponent {
  @Input() size: number = 18;
  @Input() strokeWidth: number = 2;
}
