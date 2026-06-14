import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wcag-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      [attr.width]="width"
      [attr.height]="height"
      viewBox="0 0 56 24"
      class="wcag-icon">
      <rect x="0" y="0" width="56" height="24" rx="4" fill="currentColor" opacity="0.15"/>
      <text
        x="28"
        y="16"
        text-anchor="middle"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="12"
        font-weight="700"
        fill="currentColor"
        letter-spacing="0.04em">WCAG</text>
    </svg>
  `,
  styles: [`
    .wcag-icon { display: block; overflow: visible; }
  `]
})
export class WcagIconComponent {
  @Input() width: number = 56;
  @Input() height: number = 24;
}
