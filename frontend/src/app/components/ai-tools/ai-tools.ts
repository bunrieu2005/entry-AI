import { Component, HostListener, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

export interface AiTool {
  id: number;
  slug: string;
  name: string;
  taglineVi: string;
  descriptionVi: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  category: {
    id: number;
    name: string;
  };
  useCaseTag: string;
  isFree: boolean;
  isFeatured: boolean;
  viewCount: number;
  createdAt: string;
}

@Component({
  selector: 'app-ai-tools',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-tools.html',
  styleUrl: './ai-tools.css'
})
export class AiToolsComponent implements OnInit, OnChanges {
  private readonly API_URL = 'http://localhost:8080/api/ai-tools';

  @Input() isFocusLocked: boolean = false;

  tools: AiTool[] = [];
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
    this.loadTools();
  }

  loadTools(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.http.get<AiTool[]>(this.API_URL).subscribe({
      next: (data: AiTool[]): void => {
        this.tools = data;
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse): void => {
        this.errorMessage = 'Không thể tải danh sách công cụ AI. Vui lòng thử lại sau.';
        this.isLoading = false;
        console.error('Error loading AI tools:', err);
      }
    });
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.isFocusLocked || this.isLoading || this.tools.length === 0) {
      return;
    }

    const key = event.key.toLowerCase();

    if (key === 'd' || key === 'arrowright') {
      event.preventDefault();
      this.activeCardIndex = Math.min(this.activeCardIndex + 1, this.tools.length - 1);
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
      this.activeCardIndex = Math.min(this.activeCardIndex + 1, this.tools.length - 1);
      return;
    }

    if (key === 'enter') {
      event.preventDefault();
      const tool = this.tools[this.activeCardIndex];
      if (tool) {
        this.openToolWebsite(tool.websiteUrl);
      }
    }
  }

  openToolWebsite(url: string | null): void {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  trackByToolId(index: number, tool: AiTool): number {
    return tool.id;
  }
}
