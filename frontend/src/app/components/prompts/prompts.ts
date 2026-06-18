import {
  Component,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';

import { FavoriteService } from '../../services/favorite.service';
import { AuthModalService } from '../../services/auth-modal.service';
import { HeartIconComponent } from '../shared/icons/heart-icon';
import { CopyIconComponent } from '../shared/icons/copy-icon';

export interface SubCategoryDto {
  id: number;
  name: string;
  slug: string;
}

export interface CategoryHierarchyDto {
  id: number;
  name: string;
  slug: string;
  icon: string;
  subs: SubCategoryDto[];
}

export interface Prompt {
  id: number;
  subcategoryId: number;
  slug: string;
  titleVi: string;
  content: string;
  copyCount: number;
  compatibleTools: string[];
  isFeatured: boolean;
}

// ZONE_SUBS thêm mới
type Zone = 'ZONE_FILTERS' | 'ZONE_SUBS' | 'ZONE_MAIN';

@Component({
  selector: 'app-prompts',
  standalone: true,
  imports: [CommonModule, HeartIconComponent, CopyIconComponent],
  templateUrl: './prompts.html',
  styleUrl: './prompts.css',
})
export class PromptsComponent implements OnInit, OnChanges, OnDestroy {
  private readonly API_URL = '/api';

  categories: CategoryHierarchyDto[] = [];
  activeCategoryId: number = 0;
  activeSubId: number = 0;
  promptsList: Prompt[] = [];
  copiedPromptId: number | null = null;

  isLoadingHierarchy = true;
  isLoadingPrompts = false;
  errorMessage: string | null = null;

  favoriteIds: Set<number> = new Set();
  private favSub?: Subscription;

  @Input() isFocusLocked: boolean = false;

  currentZone: Zone = 'ZONE_FILTERS';
  highlightedIndex: number = 0;
  highlightedSubIndex: number = 0; // ← index cho ZONE_SUBS
  private isKeyboardReady = false;

  constructor(
    private readonly http: HttpClient,
    private readonly favoriteService: FavoriteService,
    private readonly authModalService: AuthModalService,
  ) {}

  ngOnInit(): void {
    this.loadHierarchy();
    this.resetKeyboardReady();
    this.favSub = this.favoriteService.favoriteIds$.subscribe((ids) => {
      this.favoriteIds = ids;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isFocusLocked']) {
      if (changes['isFocusLocked'].currentValue && !changes['isFocusLocked'].previousValue) {
        this.resetKeyboardReady();
      } else if (!changes['isFocusLocked'].currentValue) {
        this.isKeyboardReady = false;
      }
    }
  }

  ngOnDestroy(): void {
    this.favSub?.unsubscribe();
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
      this.highlightedSubIndex = 0;
    }, 100);
  }

  loadHierarchy(): void {
    this.isLoadingHierarchy = true;
    this.http.get<CategoryHierarchyDto[]>(`${this.API_URL}/prompts/hierarchy`).subscribe({
      next: (data) => {
        this.categories = data;
        this.isLoadingHierarchy = false;
        if (data.length > 0) {
          this.activeCategoryId = data[0].id;
          const firstSub = data[0].subs[0];
          if (firstSub) this.loadPromptsBySubcategory(firstSub.id);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.isLoadingHierarchy = false;
        this.errorMessage = 'Không thể tải danh mục.';
        console.error('Hierarchy error:', err);
      },
    });
  }

  loadPromptsBySubcategory(subcategoryId: number): void {
    this.activeSubId = subcategoryId;
    this.isLoadingPrompts = true;
    this.errorMessage = null;
    this.copiedPromptId = null;

    this.http.get<Prompt[]>(`${this.API_URL}/prompts/subcategory/${subcategoryId}`).subscribe({
      next: (data) => {
        this.promptsList = data;
        this.highlightedIndex = 0;
        this.isLoadingPrompts = false;
        setTimeout(() => {
          document.querySelector('.prompts__grid-container')?.scrollTo({ top: 0 });
        }, 50);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = 'Không thể tải danh sách prompt.';
        this.isLoadingPrompts = false;
        this.promptsList = [];
        console.error('Prompts error:', err);
      },
    });
  }

  selectCategory(cat: CategoryHierarchyDto): void {
    this.activeCategoryId = cat.id;
    this.highlightedSubIndex = 0;
    if (cat.subs.length > 0) {
      this.loadPromptsBySubcategory(cat.subs[0].id);
    } else {
      this.promptsList = [];
    }
  }

  get activeSubs(): SubCategoryDto[] {
    return this.categories.find((c) => c.id === this.activeCategoryId)?.subs ?? [];
  }

  get activeCategoryName(): string {
    return this.categories.find((c) => c.id === this.activeCategoryId)?.name ?? '';
  }

  get activeSubName(): string {
    for (const cat of this.categories) {
      const sub = cat.subs.find((s) => s.id === this.activeSubId);
      if (sub) return sub.name;
    }
    return '';
  }

  copyPromptContent(content: string, promptId: number): void {
    const fallback = (): void => {
      const ta = document.createElement('textarea');
      ta.value = content;
      ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    };
    navigator.clipboard.writeText(content).catch(() => fallback());
    this.copiedPromptId = promptId;
    setTimeout(() => (this.copiedPromptId = null), 3000);
  }

  openVideo(url: string): void {
    const match = url.match(/[?&]v=([^&]+)/);
    const videoId = match ? match[1] : url;
    window.open(`https://youtu.be/${videoId}`, '_blank');
  }

  toggleFavorite(promptId: number, event?: Event): void {
    event?.stopPropagation();
    this.favoriteService.toggleFavorite(promptId).subscribe({
      error: (err) => {
        if (err?.status === 401) this.authModalService.open('login');
      },
    });
  }

  isFavorited(promptId: number): boolean {
    return this.favoriteIds.has(promptId);
  }

  trackByPromptId(_: number, prompt: Prompt): number {
    return prompt.id;
  }

  private scrollActiveSubIntoView(): void {
    setTimeout(() => {
      const el = document.querySelector('.sub-btn.is-keyboard-highlighted');
      if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }, 10);
  }

  private scrollActiveCardIntoView(): void {
    setTimeout(() => {
      const card = document.querySelector('.prompt-card.is-keyboard-highlighted');
      if (card) card.scrollIntoView({ block: 'nearest', behavior: 'smooth', inline: 'nearest' });
    }, 10);
  }

  // ── Keyboard Navigation ───────────────────────────────────────────────────
  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.isKeyboardReady || !this.isFocusLocked || this.isLoadingPrompts) return;

    const key = event.key.toLowerCase();

    if (key === 'escape') {
      event.preventDefault();
      event.stopPropagation();
      (document.activeElement as HTMLElement)?.blur();
      return;
    }

    // ── ZONE_FILTERS: Category tab ngang ─────────────────────────────────
    if (this.currentZone === 'ZONE_FILTERS') {
      if (key === 'a' || key === 'arrowleft') {
        event.preventDefault();
        event.stopPropagation();
        const idx = this.categories.findIndex((c) => c.id === this.activeCategoryId);
        if (idx > 0) this.selectCategory(this.categories[idx - 1]);
        return;
      }
      if (key === 'd' || key === 'arrowright') {
        event.preventDefault();
        event.stopPropagation();
        const idx = this.categories.findIndex((c) => c.id === this.activeCategoryId);
        if (idx < this.categories.length - 1) this.selectCategory(this.categories[idx + 1]);
        return;
      }
      // ↓ S: xuống ZONE_SUBS (sidebar sub-category)
      if (key === 's' || key === 'arrowdown') {
        event.preventDefault();
        event.stopPropagation();
        if (this.activeSubs.length > 0) {
          this.currentZone = 'ZONE_SUBS';
          // highlight sub đang active
          const activeIdx = this.activeSubs.findIndex((s) => s.id === this.activeSubId);
          this.highlightedSubIndex = activeIdx >= 0 ? activeIdx : 0;
          this.scrollActiveSubIntoView();
        }
        return;
      }
      return;
    }

    // ── ZONE_SUBS: Sidebar sub-category dọc ──────────────────────────────
    if (this.currentZone === 'ZONE_SUBS') {
      // W / ↑: lên item trước, hoặc về ZONE_FILTERS
      if (key === 'w' || key === 'arrowup') {
        event.preventDefault();
        event.stopPropagation();
        if (this.highlightedSubIndex === 0) {
          this.currentZone = 'ZONE_FILTERS';
        } else {
          this.highlightedSubIndex--;
          this.scrollActiveSubIntoView();
        }
        return;
      }
      // S / ↓: xuống item tiếp theo, hoặc vào ZONE_MAIN
      if (key === 's' || key === 'arrowdown') {
        event.preventDefault();
        event.stopPropagation();
        if (this.highlightedSubIndex < this.activeSubs.length - 1) {
          this.highlightedSubIndex++;
          this.scrollActiveSubIntoView();
        } else {
          // cuối danh sách sub → vào ZONE_MAIN
          if (this.promptsList.length > 0) {
            this.highlightedIndex = 0;
            this.currentZone = 'ZONE_MAIN';
            this.scrollActiveCardIntoView();
          }
        }
        return;
      }
      // Enter: load prompts của sub đang highlight → chuyển luôn sang ZONE_MAIN
      if (key === 'enter') {
        event.preventDefault();
        event.stopPropagation();
        const sub = this.activeSubs[this.highlightedSubIndex];
        if (sub) {
          this.loadPromptsBySubcategory(sub.id);
          // Chuyển sang ZONE_MAIN ngay — highlight sub index reset về -1
          // để không còn viền đen tồn đọng trên sub-btn
          this.highlightedSubIndex = -1;
          this.highlightedIndex = 0;
          this.currentZone = 'ZONE_MAIN';
          this.scrollActiveCardIntoView();
        }
        return;
      }
      // D / →: vào ZONE_MAIN nếu có prompt
      if (key === 'd' || key === 'arrowright') {
        event.preventDefault();
        event.stopPropagation();
        if (this.promptsList.length > 0) {
          this.highlightedIndex = 0;
          this.currentZone = 'ZONE_MAIN';
          this.scrollActiveCardIntoView();
        }
        return;
      }
      // A / ←: về ZONE_FILTERS
      if (key === 'a' || key === 'arrowleft') {
        event.preventDefault();
        event.stopPropagation();
        this.currentZone = 'ZONE_FILTERS';
        return;
      }
      return;
    }

    // ── ZONE_MAIN: Grid prompt ────────────────────────────────────────────
    if (this.currentZone === 'ZONE_MAIN') {
      if (key === 'w' || key === 'arrowup') {
        event.preventDefault();
        event.stopPropagation();
        if (this.highlightedIndex === 0) {
          // về ZONE_SUBS thay vì ZONE_FILTERS
          this.currentZone = 'ZONE_SUBS';
          this.scrollActiveSubIntoView();
        } else {
          this.highlightedIndex--;
          this.scrollActiveCardIntoView();
        }
        return;
      }
      if (key === 's' || key === 'arrowdown') {
        event.preventDefault();
        event.stopPropagation();
        if (this.highlightedIndex < this.promptsList.length - 1) {
          this.highlightedIndex++;
          this.scrollActiveCardIntoView();
        }
        return;
      }
      if (key === 'a' || key === 'arrowleft') {
        event.preventDefault();
        event.stopPropagation();
        if (this.highlightedIndex > 0) {
          this.highlightedIndex--;
          this.scrollActiveCardIntoView();
        } else {
          // nếu đang ở card đầu, A → về ZONE_SUBS
          this.currentZone = 'ZONE_SUBS';
          this.scrollActiveSubIntoView();
        }
        return;
      }
      if (key === 'd' || key === 'arrowright') {
        event.preventDefault();
        event.stopPropagation();
        if (this.highlightedIndex < this.promptsList.length - 1) {
          this.highlightedIndex++;
          this.scrollActiveCardIntoView();
        }
        return;
      }
      if (key === 'enter') {
        event.preventDefault();
        event.stopPropagation();
        const prompt = this.promptsList[this.highlightedIndex];
        if (prompt) this.copyPromptContent(prompt.content, prompt.id);
        return;
      }
      // T: toggle favorite card đang highlight
      if (key === 't') {
        event.preventDefault();
        event.stopPropagation();
        const prompt = this.promptsList[this.highlightedIndex];
        if (prompt) this.toggleFavorite(prompt.id);
        return;
      }
    }
  }
}