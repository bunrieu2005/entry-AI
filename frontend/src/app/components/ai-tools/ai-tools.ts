import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { KeyboardNavigationService } from '../../services/keyboard-navigation.service';

export interface AiTool {
  id: number;
  slug: string;
  name: string;
  taglineVi: string;
  descriptionVi: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  category: { id: number; name: string };
  useCaseTag: string;
  isFree: boolean;
  isFeatured: boolean;
  viewCount: number;
  createdAt: string;
}

export interface GroupedAiToolDto {
  category: { id: number; name: string }; // <--- ĐANG THIẾU Ở ĐÂY
  tools: AiTool[];
}
type Zone = 'ZONE_FILTERS' | 'ZONE_MAIN';

@Component({
  selector: 'app-ai-tools',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-tools.html',
  styleUrl: './ai-tools.css'
})
export class AiToolsComponent implements OnInit {
  private readonly API_URL = '/api/ai-tools/grouped';
  private http = inject(HttpClient);
  private keyboardNav = inject(KeyboardNavigationService);

  // API Data
  groupedTools: GroupedAiToolDto[] = [];
  activeCategoryIndex = 0;

  // Zone Navigation State (AWDS Pattern)
  currentZone: Zone = 'ZONE_FILTERS';
  highlightedIndex = 0;
  private isKeyboardReady = false;

  // UI State
  isLoading = true;
  errorMessage: string | null = null;

  get isFocusLocked(): boolean {
    return this.keyboardNav.isFocusLocked();
  }

  get currentTools(): AiTool[] {
    return this.groupedTools[this.activeCategoryIndex]?.tools || [];
  }

  get highlightedTool(): AiTool | null {
    return this.currentTools[this.highlightedIndex] || null;
  }

  ngOnInit(): void {
    this.loadGroupedTools();
    this.resetKeyboardReady();
  }

  private resetKeyboardReady(): void {
    this.isKeyboardReady = false;
    // Bỏ focus DOM thật (nếu có) để không còn viền outline mặc định của
    // trình duyệt tồn đọng trên một nút khác — chỉ còn duy nhất highlight
    // đen (.is-keyboard-highlighted / .active) do component tự vẽ.
    (document.activeElement as HTMLElement)?.blur();
    setTimeout(() => {
      this.isKeyboardReady = true;
      this.currentZone = 'ZONE_FILTERS';
      this.highlightedIndex = 0;
    }, 100);
  }

  loadGroupedTools(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.http.get<GroupedAiToolDto[]>(this.API_URL).subscribe({
      next: (data) => {
        this.groupedTools = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Không thể tải danh sách công cụ AI.';
        this.isLoading = false;
        console.error('Error:', err);
      }
    });
  }

  selectCategory(index: number): void {
    if (index >= 0 && index < this.groupedTools.length) {
      this.activeCategoryIndex = index;
      
      // CHỈ reset về 0 nếu đang ở dưới mảng Grid, còn đang ở trên Tab thì đi theo index
      if (this.currentZone === 'ZONE_MAIN') {
          this.highlightedIndex = 0; 
      } else {
          this.highlightedIndex = index;
      }
      
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }
  }

  openToolWebsite(url: string | null): void {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  trackByToolId(_: number, tool: AiTool): number {
    return tool.id;
  }

  trackByCategoryId(_: number, group: GroupedAiToolDto): number {
    return group.category.id;
  }

  // ========== WASD KEYBOARD NAVIGATION (AWDS Pattern) ==========

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.isKeyboardReady || !this.isFocusLocked || this.isLoading) return;

    const key = event.key.toLowerCase();

    if (key === 'escape') {
      event.preventDefault();
      event.stopPropagation();
      (document.activeElement as HTMLElement)?.blur();
      return;
    }

    // ZONE_FILTERS: Category tabs
    if (this.currentZone === 'ZONE_FILTERS') {
      if (key === 'a' || key === 'arrowleft') {
        event.preventDefault();
        event.stopPropagation();
        if (this.highlightedIndex > 0) {
          this.highlightedIndex--;
          this.selectCategory(this.highlightedIndex);
        }
        return;
      }
      if (key === 'd' || key === 'arrowright') {
        event.preventDefault();
        event.stopPropagation();
        if (this.highlightedIndex < this.groupedTools.length - 1) {
          this.highlightedIndex++;
          this.selectCategory(this.highlightedIndex);
        }
        return;
      }
      if (key === 's' || key === 'arrowdown') {
        event.preventDefault();
        event.stopPropagation();
        if (this.currentTools.length > 0) {
          this.highlightedIndex = 0;
          this.currentZone = 'ZONE_MAIN';
          this.scrollHighlightIntoView();
        }
        return;
      }
      return;
    }

    // ZONE_MAIN: Tools grid
    if (this.currentZone === 'ZONE_MAIN') {
      if (key === 'w' || key === 'arrowup') {
        event.preventDefault();
        event.stopPropagation();
        if (this.highlightedIndex === 0) {
          this.currentZone = 'ZONE_FILTERS';
          this.highlightedIndex = this.activeCategoryIndex;
        } else {
          this.highlightedIndex--;
          this.scrollHighlightIntoView();
        }
        return;
      }
      if (key === 's' || key === 'arrowdown') {
        event.preventDefault();
        event.stopPropagation();
        if (this.highlightedIndex < this.currentTools.length - 1) {
          this.highlightedIndex++;
          this.scrollHighlightIntoView();
        }
        return;
      }
      if (key === 'a' || key === 'arrowleft') {
        event.preventDefault();
        event.stopPropagation();
        if (this.highlightedIndex > 0) {
          this.highlightedIndex--;
          this.scrollHighlightIntoView();
        }
        return;
      }
      if (key === 'd' || key === 'arrowright') {
        event.preventDefault();
        event.stopPropagation();
        if (this.highlightedIndex < this.currentTools.length - 1) {
          this.highlightedIndex++;
          this.scrollHighlightIntoView();
        }
        return;
      }
      if (key === 'enter') {
        event.preventDefault();
        event.stopPropagation();
        const tool = this.highlightedTool;
        if (tool) this.openToolWebsite(tool.websiteUrl);
        return;
      }
    }
  }

  private scrollHighlightIntoView(): void {
    setTimeout(() => {
      // Đã sửa thành .card-wrap cho khớp với CSS
      const card = document.querySelector('.card-wrap.is-keyboard-highlighted');
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 10);
  }
}