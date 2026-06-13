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

// ── DTOs khớp với API /hierarchy ──────────────────────────────────────────────
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

// ── Entity Prompt khớp với API /subcategory/{id} ──────────────────────────────
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

type Zone = 'ZONE_FILTERS' | 'ZONE_MAIN';

@Component({
  selector: 'app-prompts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prompts.html',
  styleUrl: './prompts.css',
})
export class PromptsComponent implements OnInit, OnChanges, OnDestroy {
  private readonly API_URL = 'http://localhost:8080/api';

  // ── Dữ liệu từ API ────────────────────────────────────────────────────────
  categories: CategoryHierarchyDto[] = [];
  activeCategoryId: number = 0;

  activeSubId: number = 0;
  promptsList: Prompt[] = [];
  copiedPromptId: number | null = null;

  isLoadingHierarchy = true;
  isLoadingPrompts = false;
  errorMessage: string | null = null;

  // ── Favorites ──────────────────────────────────────────────────────────────
  favoriteIds: Set<number> = new Set();
  private favSub?: Subscription;

  // ── Keyboard navigation ───────────────────────────────────────────────────
  @Input() isFocusLocked: boolean = false;

  currentZone: Zone = 'ZONE_FILTERS';
  highlightedIndex: number = 0;
  private isKeyboardReady = false;

  constructor(
    private readonly http: HttpClient,
    private readonly favoriteService: FavoriteService,
    private readonly authModalService: AuthModalService,
  ) {}

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.loadHierarchy();
    this.resetKeyboardReady();
    this.favSub = this.favoriteService.favoriteIds$.subscribe((ids) => {
      this.favoriteIds = ids;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isFocusLocked']) {
      if (
        changes['isFocusLocked'].currentValue &&
        !changes['isFocusLocked'].previousValue
      ) {
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
    setTimeout(() => {
      this.isKeyboardReady = true;
      this.currentZone = 'ZONE_FILTERS';
      this.highlightedIndex = 0;
    }, 100);
  }

  // ── API calls ─────────────────────────────────────────────────────────────

  /** Load cây danh mục, sau đó tự động load subcategory đầu tiên */
  loadHierarchy(): void {
    this.isLoadingHierarchy = true;
    this.http
      .get<CategoryHierarchyDto[]>(`${this.API_URL}/prompts/hierarchy`)
      .subscribe({
        next: (data) => {
          this.categories = data;
          this.isLoadingHierarchy = false;

          if (data.length > 0) {
            this.activeCategoryId = data[0].id;
            const firstSub = data[0].subs[0];
            if (firstSub) {
              this.loadPromptsBySubcategory(firstSub.id);
            }
          }
        },
        error: (err: HttpErrorResponse) => {
          this.isLoadingHierarchy = false;
          this.errorMessage = 'Không thể tải danh mục.';
          console.error('Hierarchy error:', err);
        },
      });
  }

  /** Load prompt theo subcategoryId */
  loadPromptsBySubcategory(subcategoryId: number): void {
    this.activeSubId = subcategoryId;
    this.isLoadingPrompts = true;
    this.errorMessage = null;
    this.copiedPromptId = null;

    this.http
      .get<Prompt[]>(`${this.API_URL}/prompts/subcategory/${subcategoryId}`)
      .subscribe({
        next: (data) => {
          this.promptsList = data;
          this.highlightedIndex = 0;
          this.isLoadingPrompts = false;
          setTimeout(() => {
            const grid = document.querySelector('.prompts__grid-container');
            if (grid) grid.scrollTop = 0;
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

  /** Khi click tab category — chuyển category, load sub đầu tiên */
  selectCategory(cat: CategoryHierarchyDto): void {
    this.activeCategoryId = cat.id;
    if (cat.subs.length > 0) {
      this.loadPromptsBySubcategory(cat.subs[0].id);
    } else {
      this.promptsList = [];
    }
  }

  /** Lấy danh sách sub của category đang active */
  get activeSubs(): SubCategoryDto[] {
    return (
      this.categories.find((c) => c.id === this.activeCategoryId)?.subs ?? []
    );
  }

  /** Tên category đang active */
  get activeCategoryName(): string {
    return (
      this.categories.find((c) => c.id === this.activeCategoryId)?.name ?? ''
    );
  }

  /** Tên sub đang active */
  get activeSubName(): string {
    for (const cat of this.categories) {
      const sub = cat.subs.find((s) => s.id === this.activeSubId);
      if (sub) return sub.name;
    }
    return '';
  }

  // ── Copy ──────────────────────────────────────────────────────────────────
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

  // ── Favorites ─────────────────────────────────────────────────────────────
  toggleFavorite(promptId: number, event?: Event): void {
    event?.stopPropagation();
    this.favoriteService.toggleFavorite(promptId).subscribe({
      error: (err) => {
        if (err?.status === 401) {
          this.authModalService.open('login');
        }
      },
    });
  }

  isFavorited(promptId: number): boolean {
    return this.favoriteIds.has(promptId);
  }

  trackByPromptId(_: number, prompt: Prompt): number {
    return prompt.id;
  }

  // ── Keyboard Navigation ───────────────────────────────────────────────────
  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.isKeyboardReady || !this.isFocusLocked || this.isLoadingPrompts)
      return;

    const key = event.key.toLowerCase();

    if (key === 'escape') {
      event.preventDefault();
      event.stopPropagation();
      (document.activeElement as HTMLElement)?.blur();
      return;
    }

    // ── ZONE_FILTERS: Tab category ngang ──────────────────────────────────
    if (this.currentZone === 'ZONE_FILTERS') {
      if (key === 'a' || key === 'arrowleft') {
        event.preventDefault();
        event.stopPropagation();
        const idx = this.categories.findIndex(
          (c) => c.id === this.activeCategoryId
        );
        if (idx > 0) this.selectCategory(this.categories[idx - 1]);
        return;
      }
      if (key === 'd' || key === 'arrowright') {
        event.preventDefault();
        event.stopPropagation();
        const idx = this.categories.findIndex(
          (c) => c.id === this.activeCategoryId
        );
        if (idx < this.categories.length - 1)
          this.selectCategory(this.categories[idx + 1]);
        return;
      }
      if (key === 's' || key === 'arrowdown') {
        event.preventDefault();
        event.stopPropagation();
        if (this.promptsList.length > 0) {
          this.highlightedIndex = 0;
          this.currentZone = 'ZONE_MAIN';
          setTimeout(() => {
            document.querySelector('.prompts__grid-container')?.scrollTo({
              top: 0,
            });
            this.scrollActiveCardIntoView();
          }, 50);
        }
        return;
      }
      return;
    }

    // ── ZONE_MAIN: Grid prompt ─────────────────────────────────────────────
    if (this.currentZone === 'ZONE_MAIN') {
      if (key === 'w' || key === 'arrowup') {
        event.preventDefault();
        event.stopPropagation();
        if (this.highlightedIndex === 0) {
          this.currentZone = 'ZONE_FILTERS';
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
    }
  }

  private scrollActiveCardIntoView(): void {
    setTimeout(() => {
      const card = document.querySelector('.prompt-card.is-keyboard-highlighted');
      if (card)
        card.scrollIntoView({ block: 'nearest', behavior: 'smooth', inline: 'nearest' });
    }, 10);
  }
}