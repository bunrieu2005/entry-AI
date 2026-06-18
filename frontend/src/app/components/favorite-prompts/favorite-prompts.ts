import { Component, HostListener, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

import { FavoriteService } from '../../services/favorite.service';
import { AuthModalService } from '../../services/auth-modal.service';
import { AuthService } from '../../services/auth.service';
import { KeyboardNavigationService } from '../../services/keyboard-navigation.service';
import { HeartIconComponent } from '../shared/icons/heart-icon';
import { CopyIconComponent } from '../shared/icons/copy-icon';

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

@Component({
  selector: 'app-favorite-prompts',
  standalone: true,
  imports: [CommonModule, HeartIconComponent, CopyIconComponent],
  templateUrl: './favorite-prompts.html',
  styleUrl: './favorite-prompts.css',
})
export class FavoritePromptsComponent implements OnInit, OnDestroy {
  promptsList: Prompt[] = [];
  favoriteIds: Set<number> = new Set();
  isLoading = true;
  errorMessage: string | null = null;
  copiedPromptId: number | null = null;
  isLoggedIn = false;

  private subs = new Subscription();
  private keyboardNav = inject(KeyboardNavigationService);
  private isKeyboardReady = false;
  currentZone: 'ZONE_MAIN' = 'ZONE_MAIN';
  highlightedIndex = 0;

  constructor(
    private readonly http: HttpClient,
    private readonly favoriteService: FavoriteService,
    private readonly authModalService: AuthModalService,
    private readonly authService: AuthService,
  ) {}

  get isFocusLocked(): boolean {
    return this.keyboardNav.isFocusLocked();
  }

  get highlightedPrompt(): Prompt | null {
    return this.promptsList[this.highlightedIndex] || null;
  }

  ngOnInit(): void {
    this.isLoggedIn = !!this.authService.getCurrentUserId();

    this.subs.add(
      this.authService.currentUser$.subscribe((user) => {
        this.isLoggedIn = !!user;
        if (user) {
          this.loadFavorites();
        } else {
          this.promptsList = [];
          this.isLoading = false;
        }
      })
    );

    this.subs.add(
      this.favoriteService.favoriteIds$.subscribe((ids) => {
        this.favoriteIds = ids;
      })
    );

    this.resetKeyboardReady();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private resetKeyboardReady(): void {
    this.isKeyboardReady = false;
    (document.activeElement as HTMLElement)?.blur();
    setTimeout(() => {
      this.isKeyboardReady = true;
      this.currentZone = 'ZONE_MAIN';
      this.highlightedIndex = 0;
    }, 100);
  }

  loadFavorites(): void {
    this.isLoading = true;
    this.errorMessage = null;
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.isLoading = false;
      return;
    }
    this.http.get<Prompt[]>(`/api/favorites/${userId}`).subscribe({
      next: (data) => {
        this.promptsList = data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Không thể tải danh sách yêu thích.';
        this.isLoading = false;
      },
    });
  }

  openLogin(): void {
    this.authModalService.open('login');
  }

  toggleFavorite(promptId: number, event?: Event): void {
    event?.stopPropagation();
    this.favoriteService.toggleFavorite(promptId).subscribe({
      error: (err) => {
        if (err?.status === 401) {
          this.authModalService.open('login');
        }
      },
      next: (isFavorited: boolean) => {
        if (!isFavorited) {
          this.promptsList = this.promptsList.filter((p) => p.id !== promptId);
        }
      },
    });
  }

  isFavorited(promptId: number): boolean {
    return this.favoriteIds.has(promptId);
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

  trackByPromptId(_: number, prompt: Prompt): number {
    return prompt.id;
  }

  // ========== KEYBOARD NAVIGATION ==========

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

    if (this.currentZone === 'ZONE_MAIN') {
      if (key === 'arrowup' || key === 'arrowleft') {
        event.preventDefault();
        event.stopPropagation();
        if (this.highlightedIndex > 0) {
          this.highlightedIndex--;
          this.scrollHighlightIntoView();
        }
        return;
      }
      if (key === 'arrowdown' || key === 'arrowright') {
        event.preventDefault();
        event.stopPropagation();
        if (this.highlightedIndex < this.promptsList.length - 1) {
          this.highlightedIndex++;
          this.scrollHighlightIntoView();
        }
        return;
      }
      if (key === 'enter') {
        event.preventDefault();
        event.stopPropagation();
        const prompt = this.highlightedPrompt;
        if (prompt) this.copyPromptContent(prompt.content, prompt.id);
        return;
      }
    }
  }

  private scrollHighlightIntoView(): void {
    setTimeout(() => {
      const card = document.querySelector('.prompt-card.is-keyboard-highlighted');
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 10);
  }
}
