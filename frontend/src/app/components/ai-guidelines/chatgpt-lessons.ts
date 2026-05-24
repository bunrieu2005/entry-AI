import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chatgpt-lessons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chatgpt-lessons.html',
  styleUrl: './chatgpt-lessons.css'
})
export class ChatgptLessonsComponent {
  @Input() lessonId: string = '';
}
