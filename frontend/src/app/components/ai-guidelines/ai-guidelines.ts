import { Component, HostListener, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GeminiLessonsComponent } from './gemini-lessons';
import { ClaudeLessonsComponent } from './claude-lessons';
import { ChatgptLessonsComponent } from './chatgpt-lessons';
import { KeyboardNavigationService } from '../../services/keyboard-navigation.service';

type Zone = 'ZONE_FILTERS' | 'ZONE_MAIN' | 'ZONE_DETAIL';

@Component({
  selector: 'app-ai-guidelines',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    GeminiLessonsComponent,
    ClaudeLessonsComponent,
    ChatgptLessonsComponent
  ],
  templateUrl: './ai-guidelines.html',
  styleUrl: './ai-guidelines.css'
})
export class AiGuidelinesComponent implements OnInit, OnChanges {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  private keyboardNav = inject(KeyboardNavigationService);

  // 4-Zone Spatial Navigation State
  currentZone: Zone = 'ZONE_FILTERS';
  highlightedIndex: number = 0;
  private isKeyboardReady = false;

  // Computed signals from service
  get isFocusLocked(): boolean {
    return this.keyboardNav.isFocusLocked();
  }

  // AI Tabs
  aiTabs = [
    { id: 'gemini', name: 'Gemini', icon: 'ti-database' },
    { id: 'claude', name: 'Claude', icon: 'ti-sparkles' },
    { id: 'chatgpt', name: 'ChatGPT', icon: 'ti-message-chatbot' }
  ];

  currentCategory: string = 'gemini';
  lessons: any[] = [];
  currentLesson: any = null;

  get currentAiTab() {
    return this.aiTabs.find(t => t.id === this.currentCategory) ?? this.aiTabs[0];
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Reactive to signal changes
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const cat = params.get('category') || 'gemini';
      const no = params.get('lessonNo');

      // Chỉ reset highlightedIndex khi chuyển category
      if (this.currentCategory !== cat) {
        this.highlightedIndex = 0;
      }
      this.currentCategory = cat;

      this.http.get<any[]>(`http://localhost:8080/api/ai-guidelines/${cat}`)
        .subscribe({
          next: (res) => this.lessons = res,
          error: (err) => console.error('Lỗi tải danh sách bài:', err)
        });

      if (no) {
        this.http.get(`http://localhost:8080/api/ai-guidelines/${cat}/${no}`)
          .subscribe({
            next: (res) => this.currentLesson = res,
            error: (err) => {
              console.error('Lỗi tải chi tiết bài:', err);
              this.currentLesson = null;
            }
          });
      } else {
        this.currentLesson = null;
      }
    });

    this.resetKeyboardReady();
  }

  private resetKeyboardReady(): void {
    this.isKeyboardReady = false;
    setTimeout(() => {
      this.isKeyboardReady = true;
      this.currentZone = 'ZONE_FILTERS';
      this.highlightedIndex = 0;
    }, 100);
  }

  changeCategory(catId: string) {
    this.currentCategory = catId;
    this.router.navigate(['/ai-guidelines', catId]);
    this.highlightedIndex = 0;
  }

  selectLesson(lessonId: string) {
    const no = lessonId.split('-')[1];
    this.router.navigate(['/ai-guidelines', this.currentCategory, no]);
    // Sync highlightedIndex với lesson đang chọn
    const idx = this.lessons.findIndex(l => l.id === lessonId);
    if (idx !== -1) {
      this.highlightedIndex = idx;
    }
  }

  private scrollActiveLessonIntoView(): void {
    setTimeout(() => {
      const activeElement = document.querySelector('.ai-lesson-item__btn.is-keyboard-highlighted');
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }, 10);
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.isKeyboardReady || !this.isFocusLocked) return;

    const key = event.key.toLowerCase();

    // GLOBAL: ESC - Exit keyboard mode
    if (key === 'escape') {
      event.preventDefault();
      event.stopPropagation();
      (document.activeElement as HTMLElement)?.blur();
      return;
    }

    // ZONE_FILTERS: AI Tabs
    if (this.currentZone === 'ZONE_FILTERS') {
      // A / ←: Move left to previous AI tab
      if (key === 'a' || key === 'arrowleft') {
        event.preventDefault();
        event.stopPropagation();
        const currentIdx = this.aiTabs.findIndex(t => t.id === this.currentCategory);
        if (currentIdx > 0) {
          this.changeCategory(this.aiTabs[currentIdx - 1].id);
        }
        return;
      }

      // D / →: Move right to next AI tab
      if (key === 'd' || key === 'arrowright') {
        event.preventDefault();
        event.stopPropagation();
        const currentIdx = this.aiTabs.findIndex(t => t.id === this.currentCategory);
        if (currentIdx < this.aiTabs.length - 1) {
          this.changeCategory(this.aiTabs[currentIdx + 1].id);
        }
        return;
      }

      // S / ↓: Drop to ZONE_MAIN (first lesson)
      if (key === 's' || key === 'arrowdown') {
        event.preventDefault();
        event.stopPropagation();
        if (this.lessons.length > 0) {
          this.highlightedIndex = 0;
          this.selectLesson(this.lessons[0].id);
          this.currentZone = 'ZONE_MAIN';
          setTimeout(() => this.scrollActiveLessonIntoView(), 50);
        }
        return;
      }
      return;
    }

    // ZONE_MAIN: Lesson List
    if (this.currentZone === 'ZONE_MAIN') {
      // W / ↑: Move up
      if (key === 'w' || key === 'arrowup') {
        event.preventDefault();
        event.stopPropagation();
        if (this.highlightedIndex === 0) {
          this.currentZone = 'ZONE_FILTERS';
        } else {
          this.highlightedIndex--;
          if (this.lessons[this.highlightedIndex]) {
            this.selectLesson(this.lessons[this.highlightedIndex].id);
            this.scrollActiveLessonIntoView();
          }
        }
        return;
      }

      // S / ↓: Move down
      if (key === 's' || key === 'arrowdown') {
        event.preventDefault();
        event.stopPropagation();
        if (this.highlightedIndex < this.lessons.length - 1) {
          this.highlightedIndex++;
          if (this.lessons[this.highlightedIndex]) {
            this.selectLesson(this.lessons[this.highlightedIndex].id);
            this.scrollActiveLessonIntoView();
          }
        }
        return;
      }

      // D / →: Go to ZONE_DETAIL
      if (key === 'd' || key === 'arrowright') {
        event.preventDefault();
        event.stopPropagation();
        if (this.currentLesson) {
          this.currentZone = 'ZONE_DETAIL';
          const detailPane = document.querySelector('.ai-detail');
          if (detailPane instanceof HTMLElement) {
            detailPane.focus();
          }
        }
        return;
      }

      // A / ←: Back to ZONE_FILTERS
      if (key === 'a' || key === 'arrowleft') {
        event.preventDefault();
        event.stopPropagation();
        this.currentZone = 'ZONE_FILTERS';
        return;
      }
      return;
    }

    // ZONE_DETAIL: Lesson Detail (scroll content)
    if (this.currentZone === 'ZONE_DETAIL') {
      // W / ↑: Scroll up
      if (key === 'w' || key === 'arrowup') {
        event.preventDefault();
        event.stopPropagation();
        const detailPane = document.querySelector('.ai-detail');
        if (detailPane) detailPane.scrollTop -= 60;
        return;
      }

      // S / ↓: Scroll down
      if (key === 's' || key === 'arrowdown') {
        event.preventDefault();
        event.stopPropagation();
        const detailPane = document.querySelector('.ai-detail');
        if (detailPane) detailPane.scrollTop += 60;
        return;
      }

      // A / ← or Backspace: Back to ZONE_MAIN
      if (key === 'a' || key === 'arrowleft' || key === 'backspace') {
        event.preventDefault();
        event.stopPropagation();
        this.currentZone = 'ZONE_MAIN';
        this.scrollActiveLessonIntoView();
        return;
      }
      return;
    }
  }
}
