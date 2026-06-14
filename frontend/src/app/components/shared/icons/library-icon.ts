import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-library-icon',
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
      class="library-icon">
      <path class="book-1" d="m16 6 4 14" />
      <path class="book-2" d="M12 6v14" />
      <path class="book-3" d="M8 8v12" />
      <path class="book-4" d="M4 4v16" />
    </svg>
  `,
  styles: [`
    .library-icon {
      overflow: visible;
      cursor: pointer;
    }
    .library-icon:hover .book-1 {
      animation: lib-book1 0.4s ease-out;
    }
    .library-icon:hover .book-2 {
      animation: lib-book2 0.4s ease-out;
    }
    .library-icon:hover .book-3 {
      animation: lib-book3 0.4s ease-out;
    }
    .library-icon:hover .book-4 {
      animation: lib-book4 0.4s ease-out;
    }
    @keyframes lib-book1 {
      0%, 100% { transform: rotate(0); }
      50%       { transform: rotate(12deg); }
    }
    @keyframes lib-book2 {
      0%   { transform: translateY(0) rotate(0); }
      50%  { transform: translateY(-3px) rotate(-8deg); }
      100% { transform: translateY(0) rotate(0); }
    }
    @keyframes lib-book3 {
      0%, 100% { transform: rotate(0); }
      50%       { transform: rotate(-12deg); }
    }
    @keyframes lib-book4 {
      0%, 100% { transform: rotate(0); }
      50%       { transform: rotate(-5deg); }
    }
  `]
})
export class LibraryIconComponent {
  @Input() size: number = 20;
  @Input() color: string = 'currentColor';
  @Input() strokeWidth: number = 2;
}
