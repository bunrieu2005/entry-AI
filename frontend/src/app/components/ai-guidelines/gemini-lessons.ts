import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gemini-lessons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gemini-lessons.html',
  styleUrl: './gemini-lessons.css'
})
export class GeminiLessonsComponent {
  @Input() lessonId: string = '';
}
