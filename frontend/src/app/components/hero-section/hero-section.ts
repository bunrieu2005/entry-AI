import { Component, HostListener, OnInit, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KeyboardNavigationService } from '../../services/keyboard-navigation.service';

export interface QuickAccessCard {
  id: string;
  icon: string;
  title: string;
  description: string;
  accent?: string;
}

export interface TimelinePoint {
  year: string;
  active: boolean;
}

export interface TimelineEra {
  year: string;
  era: string;
  headline: string;
  description: string;
  progressPercent: number;
  tag: string;
}

export interface VideoGuide {
  title: string;
  videoId?: string;
}

export interface QuickPill {
  label: string;
}

export interface MainNavItem {
  type: 'prompt' | 'video' | 'blog';
  title?: string;
  videoId?: string;
}

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.css'
})
export class HeroSectionComponent implements OnInit {
  @Input() title: string = 'Trang Chủ';
  @Input() subtitle: string = 'Nền tảng học và làm chủ AI cho người Việt';
  @Input() isHome: boolean = true;

  @Output() cardSelected = new EventEmitter<string>();

  ngOnInit(): void {
    this.resetKeyboardReady();
  }

  timelinePoints: TimelinePoint[] = [
    { year: '2021', active: true },
    { year: '2023', active: false },
    { year: '2025', active: false },
    { year: 'NOW', active: false },
    { year: 'Future', active: false },
  ];

  activeEraIndex = 0;
  isAnimating = false;
  isDragging = false;

  private keyboardNav = inject(KeyboardNavigationService);
  private isKeyboardReady = false;
  currentZone: 'ZONE_FILTERS' | 'ZONE_MAIN' = 'ZONE_FILTERS';
  highlightedIndex = 0;

  private dragStartX = 0;
  private dragCurrentX = 0;
  private dragDeltaX = 0;

  get isFocusLocked(): boolean {
    return this.keyboardNav.isFocusLocked();
  }

  timelineEras: TimelineEra[] = [
    {
      year: '2021',
      era: '2021 — 2023',
      headline: 'Thủ công',
      description: 'Mọi người ngồi trước laptop, tự viết code, viết tài liệu và xử lý mọi thứ bằng tay — AI gần như chưa tham gia vào quy trình làm việc.',
      progressPercent: 0,
      tag: '⟵ Kéo để xem thêm',
    },
    {
      year: '2023',
      era: '2023 — 2025',
      headline: 'Chatbot thế hệ đầu',
      description: 'Viết đoạn code ngắn, tóm tắt, gợi ý ý tưởng. Con người vẫn làm phần lớn.',
      progressPercent: 20,
      tag: '⟵ Kéo để xem thêm',
    },
    {
      year: '2025',
      era: '2025 — 2026',
      headline: 'Viết & Sửa',
      description: 'Trợ lý AI tự viết, chỉnh sửa và quản lý cả tệp tin code hoàn chỉnh — không chỉ gợi ý nữa.',
      progressPercent: 50,
      tag: '⟵ Kéo để xem thêm',
    },
    {
      year: 'NOW',
      era: 'Hiện tại · 2026',
      headline: 'Tự vận hành',
      description: 'AI tự chạy code, kiểm tra kết quả và giao lại từng phần việc cho các AI khác. Con người chuyển sang giám sát.',
      progressPercent: 70,
      tag: '⟵ Kéo để xem thêm',
    },
    {
      year: 'Future',
      era: 'Tương lai',
      headline: 'Tự cải tiến',
      description: 'AI có thể tự xây dựng, huấn luyện và cải tiến mô hình mới. Claude tương lai được nâng cấp bởi chính Claude.',
      progressPercent: 95,
      tag: '⟵ Đã hết giai đoạn',
    },
  ];

  // ZONE_MAIN: GET PROMPT + video guides + Blog (keyboard order)
  mainItems: MainNavItem[] = [
    { type: 'prompt' },
    { type: 'video', title: 'Hướng Dẫn Sử Dụng Trang Web', videoId: '2BpCk4d2Cc0' },
    { type: 'video', title: 'Hướng dẫn WCAG — Dành cho người hạn chế sử dụng chuột', videoId: 'kkmePFcbdws' },
    { type: 'blog' },
  ];

  get highlightedMainItem(): MainNavItem | null {
    return this.mainItems[this.highlightedIndex] || null;
  }

  quickPills: QuickPill[] = [
    { label: 'Prompt cho lập trình' },
    { label: 'Prompt cho viết bài' },
    { label: 'Prompt cho phân tích dữ liệu' },
    { label: 'Prompt cho marketing' },
  ];

  get currentEra(): TimelineEra { return this.timelineEras[this.activeEraIndex]; }
  get isFirstEra(): boolean { return this.activeEraIndex === 0; }
  get isLastEra(): boolean { return this.activeEraIndex === this.timelineEras.length - 1; }

  selectEra(index: number): void {
    this.activeEraIndex = index;
  }

  prevEra(): void {
    if (this.activeEraIndex > 0) this.activeEraIndex--;
  }

  nextEra(): void {
    if (this.activeEraIndex < this.timelineEras.length - 1) this.activeEraIndex++;
  }

  /* ---- Drag / Swipe ---- */
  onDragStart(event: MouseEvent | TouchEvent): void {
    this.isDragging = true;
    this.dragStartX = this.getClientX(event);
    this.dragCurrentX = this.dragStartX;
    this.dragDeltaX = 0;
  }

  onDragMove(event: MouseEvent | TouchEvent): void {
    if (!this.isDragging || this.isAnimating) return;
    const currentX = this.getClientX(event);
    this.dragDeltaX = currentX - this.dragStartX;
  }

  onDragEnd(): void {
    if (!this.isDragging || this.isAnimating) return;
    this.isDragging = false;
    const threshold = 60;
    if (this.dragDeltaX < -threshold) {
      this.nextEra();
    } else if (this.dragDeltaX > threshold) {
      this.prevEra();
    }
    this.dragDeltaX = 0;
  }

  private getClientX(event: MouseEvent | TouchEvent): number {
    return event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
  }

  get cardStyle(): Record<string, string> {
    if (this.isDragging && this.dragDeltaX !== 0) {
      return { transform: `translateX(${this.dragDeltaX}px)`, transition: 'none' };
    }
    return {};
  }

  onCardClick(cardId: string): void {
    if (cardId === 'prompts') {
      this.cardSelected.emit('prompts');
      return;
    }
    if (cardId === 'blog') {
      this.cardSelected.emit('blog');
      return;
    }
    const index = parseInt(cardId.replace('video-', ''), 10);
    const videoItem = this.mainItems[index + 1];
    if (videoItem?.type === 'video' && videoItem.videoId) {
      window.open(`https://youtu.be/${videoItem.videoId}`, '_blank');
    }
  }

  onSearchKeydown(event: Event): void {
    // future: emit search event
  }

  // ========== KEYBOARD NAVIGATION ==========

  private resetKeyboardReady(): void {
    this.isKeyboardReady = false;
    (document.activeElement as HTMLElement)?.blur();
    setTimeout(() => {
      this.isKeyboardReady = true;
      this.currentZone = 'ZONE_FILTERS';
      this.highlightedIndex = 0;
    }, 100);
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.isKeyboardReady || !this.isFocusLocked) return;

    const key = event.key.toLowerCase();

    if (key === 'escape') {
      event.preventDefault();
      event.stopPropagation();
      (document.activeElement as HTMLElement)?.blur();
      return;
    }

    // ZONE_FILTERS: Timeline points
    if (this.currentZone === 'ZONE_FILTERS') {
      if (key === 'arrowleft') {
        event.preventDefault();
        event.stopPropagation();
        if (this.activeEraIndex > 0) {
          this.activeEraIndex--;
        }
        return;
      }
      if (key === 'arrowright') {
        event.preventDefault();
        event.stopPropagation();
        if (this.activeEraIndex < this.timelineEras.length - 1) {
          this.activeEraIndex++;
        }
        return;
      }
      if (key === 'arrowdown' || key === 'enter') {
        event.preventDefault();
        event.stopPropagation();
        this.currentZone = 'ZONE_MAIN';
        this.highlightedIndex = 0;
        this.scrollHighlightIntoView();
        return;
      }
      return;
    }

    // ZONE_MAIN: GET PROMPT → video guides → Blog
    if (this.currentZone === 'ZONE_MAIN') {
      if (key === 'arrowup' || key === 'arrowleft') {
        event.preventDefault();
        event.stopPropagation();
        if (this.highlightedIndex === 0) {
          this.currentZone = 'ZONE_FILTERS';
        } else {
          this.highlightedIndex--;
          this.scrollHighlightIntoView();
        }
        return;
      }
      if (key === 'arrowdown' || key === 'arrowright') {
        event.preventDefault();
        event.stopPropagation();
        if (this.highlightedIndex < this.mainItems.length - 1) {
          this.highlightedIndex++;
          this.scrollHighlightIntoView();
        }
        return;
      }
      if (key === 'enter') {
        event.preventDefault();
        event.stopPropagation();
        const item = this.highlightedMainItem;
        if (!item) return;
        if (item.type === 'prompt') {
          this.cardSelected.emit('prompts');
        } else if (item.type === 'video' && item.videoId) {
          window.open(`https://youtu.be/${item.videoId}`, '_blank');
        } else if (item.type === 'blog') {
          this.cardSelected.emit('blog');
        }
        return;
      }
    }
  }

  private scrollHighlightIntoView(): void {
    setTimeout(() => {
      const card = document.querySelector('.video-widget.is-keyboard-highlighted, .blog-widget.is-keyboard-highlighted, .banner-cta-action.is-keyboard-highlighted');
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 10);
  }
}
