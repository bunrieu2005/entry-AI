import { Component, HostListener, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

export interface Category {
  id: number;
  name: string;
  icon: string;
}

export interface Prompt {
  id: number;
  slug: string;
  titleVi: string;
  content: string;
  copyCount: number;
  compatibleTools: string[];
}

type Zone = 'ZONE_FILTERS' | 'ZONE_MAIN';

@Component({
  selector: 'app-prompts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prompts.html',
  styleUrl: './prompts.css',
})
export class PromptsComponent implements OnChanges {
  private readonly API_URL = 'http://localhost:8080/api';

  readonly categories: Category[] = [
    { id: 1, name: 'Marketing', icon: 'ti ti-speakerphone' },
    { id: 2, name: 'Viết bài', icon: 'ti ti-edit' },
    { id: 3, name: 'Giáo dục', icon: 'ti ti-school' },
    { id: 4, name: 'Lập trình', icon: 'ti ti-code' },
    { id: 11, name: 'Kinh doanh', icon: 'ti ti-briefcase' },
  ];

  @Input() isFocusLocked: boolean = false;

  // 4-Zone Spatial Navigation State
  currentZone: Zone = 'ZONE_FILTERS';
  highlightedIndex: number = 0;
  private isKeyboardReady = false;

  activeCategoryId: number = 1;
  promptsList: Prompt[] = [];
  copiedPromptId: number | null = null;
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(private readonly http: HttpClient) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isFocusLocked']) {
      if (changes['isFocusLocked'].currentValue && !changes['isFocusLocked'].previousValue) {
        this.resetKeyboardReady();
      } else if (!changes['isFocusLocked'].currentValue) {
        this.isKeyboardReady = false;
      }
    }
  }

  private resetKeyboardReady(): void {
    this.isKeyboardReady = false;
    setTimeout(() => {
      this.isKeyboardReady = true;
      this.currentZone = 'ZONE_FILTERS';
      this.highlightedIndex = 0;
    }, 100);
  }

  ngOnInit(): void {
    this.loadPromptsByCategory(this.activeCategoryId);
    this.resetKeyboardReady();
  }

  loadPromptsByCategory(categoryId: number): void {
    this.activeCategoryId = categoryId;
    this.isLoading = true;
    this.errorMessage = null;
    this.copiedPromptId = null;

    this.http.get<Prompt[]>(`${this.API_URL}/prompts/category/${categoryId}`).subscribe({
      next: (data: Prompt[]) => {
        this.promptsList = data;
        this.highlightedIndex = 0;
        this.isLoading = false;
        // Scroll to top when category changes
        setTimeout(() => {
          const gridContainer = document.querySelector('.prompts__grid-container');
          if (gridContainer) gridContainer.scrollTop = 0;
        }, 50);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = 'Không thể tải danh sách prompt.';
        this.isLoading = false;
        this.promptsList = [];
        console.error('Error loading prompts:', err);
      },
    });
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.isKeyboardReady || !this.isFocusLocked || this.isLoading) return;

    const key = event.key.toLowerCase();

    // GLOBAL: ESC - Exit keyboard mode
    if (key === 'escape') {
      event.preventDefault();
      event.stopPropagation();
      (document.activeElement as HTMLElement)?.blur();
      return;
    }

    // ZONE_FILTERS: Category tabs
    if (this.currentZone === 'ZONE_FILTERS') {
      // A / ←: Move left to previous category
      if (key === 'a' || key === 'arrowleft') {
        event.preventDefault();
        event.stopPropagation();
        const currentIdx = this.categories.findIndex(c => c.id === this.activeCategoryId);
        if (currentIdx > 0) {
          this.loadPromptsByCategory(this.categories[currentIdx - 1].id);
        }
        return;
      }

      // D / →: Move right to next category
      if (key === 'd' || key === 'arrowright') {
        event.preventDefault();
        event.stopPropagation();
        const currentIdx = this.categories.findIndex(c => c.id === this.activeCategoryId);
        if (currentIdx < this.categories.length - 1) {
          this.loadPromptsByCategory(this.categories[currentIdx + 1].id);
        }
        return;
      }

      // S / ↓: Drop to ZONE_MAIN (first card)
      if (key === 's' || key === 'arrowdown') {
        event.preventDefault();
        event.stopPropagation();
        if (this.promptsList.length > 0) {
          this.highlightedIndex = 0;
          this.currentZone = 'ZONE_MAIN';
          setTimeout(() => {
            const gridContainer = document.querySelector('.prompts__grid-container');
            if (gridContainer) {
              gridContainer.scrollTop = 0;
            }
            this.scrollActiveCardIntoView();
          }, 50);
        }
        return;
      }
      return;
    }

    // ZONE_MAIN: Prompt cards grid
    if (this.currentZone === 'ZONE_MAIN') {
      // W / ↑: Move up, or back to ZONE_FILTERS if at first card
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

      // S / ↓: Move down (next card) - WITH SCROLL
      if (key === 's' || key === 'arrowdown') {
        event.preventDefault();
        event.stopPropagation();
        if (this.highlightedIndex < this.promptsList.length - 1) {
          this.highlightedIndex++;
          this.scrollActiveCardIntoView();
        }
        return;
      }

      // A / ←: Move to previous card
      if (key === 'a' || key === 'arrowleft') {
        event.preventDefault();
        event.stopPropagation();
        if (this.highlightedIndex > 0) {
          this.highlightedIndex--;
          this.scrollActiveCardIntoView();
        }
        return;
      }

      // D / →: Move to next card
      if (key === 'd' || key === 'arrowright') {
        event.preventDefault();
        event.stopPropagation();
        if (this.highlightedIndex < this.promptsList.length - 1) {
          this.highlightedIndex++;
          this.scrollActiveCardIntoView();
        }
        return;
      }

      // Enter: Copy prompt content
      if (key === 'enter') {
        event.preventDefault();
        event.stopPropagation();
        const prompt = this.promptsList[this.highlightedIndex];
        if (prompt) {
          this.copyPromptContent(prompt.content, prompt.id);
        }
        return;
      }
      return;
    }
  }

  private scrollActiveCardIntoView(): void {
    setTimeout(() => {
      const activeCard = document.querySelector('.prompt-card.is-keyboard-highlighted');
      const gridContainer = document.querySelector('.prompts__grid-container');
      if (activeCard && gridContainer) {
        activeCard.scrollIntoView({ block: 'nearest', behavior: 'smooth', inline: 'nearest' });
      }
    }, 10);
  }

  copyPromptContent(content: string, promptId: number): void {
    const fallbackCopy = (): void => {
      const textarea = document.createElement('textarea');
      textarea.value = content;
      textarea.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    };

    navigator.clipboard.writeText(content).catch(() => fallbackCopy());

    this.copiedPromptId = promptId;
    setTimeout(() => {
      this.copiedPromptId = null;
    }, 3000);
  }

  trackByPromptId(index: number, prompt: Prompt): number {
    return prompt.id;
  }

  getCategoryName(categoryId: number): string {
    return this.categories.find((c) => c.id === categoryId)?.name ?? '';
  }
}
