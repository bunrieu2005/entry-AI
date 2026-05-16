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

  activeCategoryId: number = 1;
  promptsList: Prompt[] = [];
  copiedPromptId: number | null = null;
  activeCardIndex: number = 0;

  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(private readonly http: HttpClient) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isFocusLocked'] && !changes['isFocusLocked'].previousValue && changes['isFocusLocked'].currentValue) {
      this.activeCardIndex = 0;
    }
  }

  ngOnInit(): void {
    this.loadPromptsByCategory(this.activeCategoryId);
  }

  loadPromptsByCategory(categoryId: number): void {
    this.activeCategoryId = categoryId;
    this.isLoading = true;
    this.errorMessage = null;
    this.copiedPromptId = null;

    this.http.get<Prompt[]>(`${this.API_URL}/prompts/category/${categoryId}`).subscribe({
      next: (data: Prompt[]) => {
        this.promptsList = data;
        this.activeCardIndex = 0;
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = 'Không thể tải danh sách prompt. Vui lòng thử lại sau.';
        this.isLoading = false;
        this.promptsList = [];
        console.error('Error loading prompts:', err);
      },
    });
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.isFocusLocked || this.isLoading || this.promptsList.length === 0) {
      return;
    }

    const key = event.key.toLowerCase();

    if (key === 'd' || key === 'arrowright') {
      event.preventDefault();
      this.activeCardIndex = Math.min(this.activeCardIndex + 1, this.promptsList.length - 1);
      return;
    }

    if (key === 'a' || key === 'arrowleft') {
      event.preventDefault();
      this.activeCardIndex = Math.max(this.activeCardIndex - 1, 0);
      return;
    }

    if (key === 'w' || key === 'arrowup') {
      event.preventDefault();
      this.activeCardIndex = Math.max(this.activeCardIndex - 1, 0);
      return;
    }

    if (key === 's' || key === 'arrowdown') {
      event.preventDefault();
      this.activeCardIndex = Math.min(this.activeCardIndex + 1, this.promptsList.length - 1);
      return;
    }

    if (key === 'enter') {
      event.preventDefault();
      const prompt = this.promptsList[this.activeCardIndex];
      if (prompt) {
        this.copyPromptContent(prompt.content, prompt.id);
      }
    }
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
