import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

import { FavoriteService } from '../../services/favorite.service';
import { AuthModalService } from '../../services/auth-modal.service';
import { AuthService } from '../../services/auth.service';

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
  imports: [CommonModule],
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

  constructor(
    private readonly http: HttpClient,
    private readonly favoriteService: FavoriteService,
    private readonly authModalService: AuthModalService,
    private readonly authService: AuthService,
  ) {}

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
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  loadFavorites(): void {
    this.isLoading = true;
    this.errorMessage = null;
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.isLoading = false;
      return;
    }
    this.http.get<Prompt[]>(`http://localhost:8080/api/favorites/${userId}`).subscribe({
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
}
