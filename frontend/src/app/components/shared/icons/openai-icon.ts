import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-openai-icon',
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
      class="openai-icon">
      <path d="M11.217 19.384a3.501 3.501 0 0 0 6.783 -1.217v-5.167l-6 -3.35" />
      <path d="M5.214 15.014a3.501 3.501 0 0 0 4.446 5.266l4.34 -2.534v-6.946" />
      <path d="M6 7.63c-1.391 -.236 -2.787 .395 -3.534 1.689a3.474 3.474 0 0 0 1.271 4.745l4.263 2.514l6 -3.348" />
      <path d="M12.783 4.616a3.501 3.501 0 0 0 -6.783 1.217v5.067l6 3.45" />
      <path d="M18.786 8.986a3.501 3.501 0 0 0 -4.446 -5.266l-4.34 2.534v6.946" />
      <path d="M18 16.302c1.391 .236 2.787 -.395 3.534 -1.689a3.474 3.474 0 0 0 -1.271 -4.745l-4.308 -2.514l-5.955 3.42" />
    </svg>
  `,
  styles: [`
    .openai-icon {
      overflow: visible;
      cursor: pointer;
    }
    .openai-icon:hover path:nth-child(1) { animation: openai-path 0.8s ease-in-out 0s; }
    .openai-icon:hover path:nth-child(2) { animation: openai-path 0.8s ease-in-out 0.05s; }
    .openai-icon:hover path:nth-child(3) { animation: openai-path 0.8s ease-in-out 0.1s; }
    .openai-icon:hover path:nth-child(4) { animation: openai-path 0.8s ease-in-out 0.15s; }
    .openai-icon:hover path:nth-child(5) { animation: openai-path 0.8s ease-in-out 0.2s; }
    .openai-icon:hover path:nth-child(6) { animation: openai-path 0.8s ease-in-out 0.25s; }
    @keyframes openai-path {
      0%   { opacity: 1; }
      30%  { opacity: 0.4; }
      60%  { opacity: 1; }
      100% { opacity: 1; }
    }
  `]
})
export class OpenaiIconComponent {
  @Input() size: number = 20;
  @Input() color: string = 'currentColor';
  @Input() strokeWidth: number = 2;
}
