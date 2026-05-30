import { Component, ElementRef, HostListener, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GeminiLessonsComponent } from './gemini-lessons';
import { ClaudeLessonsComponent } from './claude-lessons';
import { ChatgptLessonsComponent } from './chatgpt-lessons';
import { KeyboardNavigationService } from '../../services/keyboard-navigation.service';

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
export class AiGuidelinesComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  readonly keyboardNavigation = inject(KeyboardNavigationService);
  @ViewChild('detailPanel') detailPanelRef?: ElementRef<HTMLElement>;

  aiTabs = [
    { id: 'gemini', name: 'Gemini', icon: 'ti-database' },
    { id: 'claude', name: 'Claude', icon: 'ti-sparkles' },
    { id: 'chatgpt', name: 'ChatGPT', icon: 'ti-message-chatbot' }
  ];

  currentCategory: string = 'gemini';
  activeTabIndex: number = 0;
  currentZone: 'TABS' | 'ITEMS' | 'DETAIL' = 'TABS';
  highlightedIndex: number = 0;
  lessons: any[] = [];
  currentLesson: any = null;
  private wasFocusLocked = false;

  get currentAiTab() {
    return this.aiTabs.find(t => t.id === this.currentCategory) ?? this.aiTabs[0];
  }

  get isFocusLocked(): boolean {
    return this.keyboardNavigation.isFocusLocked();
  }

  ngOnInit() {
    // Liên tục lắng nghe sự thay đổi của URL
    this.route.paramMap.subscribe(params => {
      const cat = params.get('category') || 'gemini';
      const no = params.get('lessonNo');

      this.currentCategory = cat;
      this.syncActiveTabIndex();

      // API 1: Lấy danh sách bài của con AI đó
      this.http.get<any[]>(`http://localhost:8080/api/ai-guidelines/${cat}`)
        .subscribe({
          next: (res) => {
            this.lessons = res;
            this.highlightedIndex = 0;
          },
          error: (err) => console.error('Lỗi tải danh sách bài:', err)
        });

      // API 2: Nếu URL có số bài (ví dụ: /1) thì lấy chi tiết bài viết
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
        this.currentLesson = null; // Trở về màn hình chờ nếu chưa chọn bài cụ thể
      }
    });
  }

  changeCategory(catId: string) {
    this.router.navigate(['/ai-guidelines', catId]);
  }

  selectLesson(lessonId: string) {
    const no = lessonId.split('-')[1];
    this.router.navigate(['/ai-guidelines', this.currentCategory, no]);
  }

  private syncActiveTabIndex(): void {
    const index = this.aiTabs.findIndex(tab => tab.id === this.currentCategory);
    this.activeTabIndex = index >= 0 ? index : 0;
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.isFocusLocked) {
      this.wasFocusLocked = false;
      return;
    }

    // Ignore the same Enter keystroke that just activated lock mode from Sidebar.
    if (!this.wasFocusLocked) {
      this.wasFocusLocked = true;
      if (event.key.toLowerCase() === 'enter') {
        event.preventDefault();
        this.currentZone = 'TABS';
        return;
      }
    }

    const key = event.key.toLowerCase();
    const isAiGuidelinesZone = this.keyboardNavigation.focusedSidebarModule() === 'ai-guidelines';
    if (!isAiGuidelinesZone) {
      return;
    }

    if (key === 'escape') {
      event.preventDefault();
      if (this.currentZone === 'DETAIL') {
        this.currentZone = 'ITEMS';
        this.scrollHighlightedItemIntoView();
        return;
      }
      this.currentZone = 'TABS';
      this.keyboardNavigation.setFocusLocked(false);
      return;
    }

    if (this.currentZone === 'TABS') {
      if (key === 'd' || key === 'arrowright') {
        event.preventDefault();
        this.moveTabFocus(1);
        return;
      }

      if (key === 'a' || key === 'arrowleft') {
        event.preventDefault();
        this.moveTabFocus(-1);
        return;
      }

      if (key === 's' || key === 'arrowdown' || key === 'enter') {
        event.preventDefault();
        this.currentZone = 'ITEMS';
        this.highlightedIndex = 0;
        this.scrollHighlightedItemIntoView();
        return;
      }
      return;
    }

    if (this.currentZone === 'DETAIL') {
      if (key === 'backspace') {
        event.preventDefault();
        this.currentZone = 'ITEMS';
        this.scrollHighlightedItemIntoView();
        return;
      }

      const detailContainer = this.getDetailContainer();
      if (!detailContainer) {
        return;
      }

      if (key === 's' || key === 'arrowdown') {
        event.preventDefault();
        this.scrollDetailContent(50, detailContainer);
        return;
      }

      if (key === 'w' || key === 'arrowup') {
        event.preventDefault();
        this.scrollDetailContent(-50, detailContainer);
        return;
      }

      return;
    }

    if (this.lessons.length === 0) {
      return;
    }

    if (key === 'w' || key === 'arrowup') {
      event.preventDefault();
      if (this.highlightedIndex === 0) {
        this.currentZone = 'TABS';
        return;
      }
      this.highlightedIndex = Math.max(this.highlightedIndex - 1, 0);
      this.scrollHighlightedItemIntoView();
      return;
    }

    if (key === 's' || key === 'arrowdown') {
      event.preventDefault();
      this.highlightedIndex = Math.min(this.highlightedIndex + 1, this.lessons.length - 1);
      this.scrollHighlightedItemIntoView();
      return;
    }

    if (key === 'backspace') {
      event.preventDefault();
      this.currentZone = 'TABS';
      return;
    }

    if (key === 'enter') {
      event.preventDefault();
      const targetedLesson = this.lessons[this.highlightedIndex];
      if (targetedLesson) {
        this.selectLesson(targetedLesson.id);
        this.currentZone = 'DETAIL';
        this.focusDetailPanel();
      }
    }
  }

  private moveTabFocus(delta: number): void {
    const nextIndex = Math.max(0, Math.min(this.activeTabIndex + delta, this.aiTabs.length - 1));
    if (nextIndex === this.activeTabIndex) {
      return;
    }

    this.activeTabIndex = nextIndex;
    const nextTab = this.aiTabs[this.activeTabIndex];
    if (nextTab && nextTab.id !== this.currentCategory) {
      this.changeCategory(nextTab.id);
    }
  }

  private focusDetailPanel(): void {
    const detailContainer = this.getDetailContainer();
    if (!detailContainer) {
      return;
    }

    // Wait for next frame so route/content updates settle before moving focus.
    requestAnimationFrame(() => detailContainer.focus());
  }

  private getDetailContainer(): HTMLElement | null {
    return this.detailPanelRef?.nativeElement ?? document.querySelector('.ai-detail');
  }

  private scrollHighlightedItemIntoView(): void {
    const listItems = document.querySelectorAll('.ai-lesson-item');
    const item = listItems[this.highlightedIndex] as HTMLElement | undefined;
    item?.scrollIntoView({ block: 'nearest' });
  }

  private scrollDetailContent(delta: number, detailContainer: HTMLElement): void {
    detailContainer.scrollBy({ top: delta, behavior: 'smooth' });
    detailContainer.scrollTop += delta;
  }
}
