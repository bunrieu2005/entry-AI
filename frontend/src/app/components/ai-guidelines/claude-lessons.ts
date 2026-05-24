import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-claude-lessons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './claude-lessons.html',
  styleUrl: './claude-lessons.css'
})
export class ClaudeLessonsComponent {
  @Input() lessonId: string = '';
}
