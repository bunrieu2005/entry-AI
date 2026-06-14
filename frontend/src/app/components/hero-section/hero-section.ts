import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

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

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.css'
})
export class HeroSectionComponent {
  @Input() title: string = 'Trang Chủ';
  @Input() subtitle: string = 'Nền tảng học và làm chủ AI cho người Việt';
  @Input() isHome: boolean = true;

  @Output() cardSelected = new EventEmitter<string>();

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

  private dragStartX = 0;
  private dragCurrentX = 0;
  private dragDeltaX = 0;

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

  videoGuides: VideoGuide[] = [
    {
      title: 'Hướng Dẫn Sử Dụng Trang Web',
    
      videoId: '2BpCk4d2Cc0',
    },
    {
      title: 'Hướng dẫn WCAG — Dành cho người hạn chế sử dụng chuột',
   
      videoId: '6bs5b4FltCU',
    },
  ];

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
    const index = parseInt(cardId.replace('video-', ''), 10);
    const guide = this.videoGuides[index];
    if (guide?.videoId) {
      window.open(`https://youtu.be/${guide.videoId}`, '_blank');
    }
  }

  onSearchKeydown(event: Event): void {
    // future: emit search event
  }
}
