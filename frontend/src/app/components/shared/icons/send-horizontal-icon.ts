import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-send-horizontal-icon',
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
      class="send-horizontal-icon">
      <path d="M3 12h18M8 17l5-5-5-5M16 7l-5 5 5 5"/>
    </svg>
  `,
  styles: [`
    .send-horizontal-icon { display: block; overflow: visible; }
  `]
})
export class SendHorizontalIconComponent {
  @Input() size: number = 18;
  @Input() strokeWidth: number = 2;
}
