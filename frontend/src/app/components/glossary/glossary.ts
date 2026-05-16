import { Component, HostListener, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

export interface GlossaryTerm {
  id: number;
  term: string;
  slug: string;
  shortDefVi: string;
  definitionVi: string;
  exampleVi: string;
  relatedTerms: string[] | null;
  tags: string | null;
  viewCount: number;
  createdAt: string;
}

@Component({
  selector: 'app-glossary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './glossary.html',
  styleUrl: './glossary.css'
})
export class GlossaryComponent implements OnInit, OnChanges {
  private readonly API_URL = 'http://localhost:8080/api/glossary';

  @Input() isFocusLocked: boolean = false;

  terms: GlossaryTerm[] = [];
  filteredTerms: GlossaryTerm[] = [];
  searchQuery: string = '';
  expandedTermId: number | null = null;
  activeItemIndex: number = 0;
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(private readonly http: HttpClient) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isFocusLocked'] && !changes['isFocusLocked'].previousValue && changes['isFocusLocked'].currentValue) {
      this.activeItemIndex = 0;
    }
  }

  ngOnInit(): void {
    this.loadTerms();
  }

  loadTerms(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.http.get<GlossaryTerm[]>(this.API_URL).subscribe({
      next: (data: GlossaryTerm[]): void => {
        this.terms = data;
        this.filteredTerms = data;
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse): void => {
        this.errorMessage = 'Không thể tải danh sách thuật ngữ. Vui lòng thử lại sau.';
        this.isLoading = false;
        console.error('Error loading glossary terms:', err);
      }
    });
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.isFocusLocked || this.isLoading || this.filteredTerms.length === 0) {
      return;
    }

    const key = event.key.toLowerCase();

    if (key === 's' || key === 'arrowdown') {
      event.preventDefault();
      this.activeItemIndex = Math.min(this.activeItemIndex + 1, this.filteredTerms.length - 1);
      return;
    }

    if (key === 'w' || key === 'arrowup') {
      event.preventDefault();
      this.activeItemIndex = Math.max(this.activeItemIndex - 1, 0);
      return;
    }

    if (key === 'enter') {
      event.preventDefault();
      const term = this.filteredTerms[this.activeItemIndex];
      if (term) {
        this.toggleTerm(term.id);
      }
    }
  }

  filterTerms(): void {
    const query = this.searchQuery.trim().toLowerCase();

    if (!query) {
      this.filteredTerms = this.terms;
      return;
    }

    this.filteredTerms = this.terms.filter((term: GlossaryTerm): boolean => {
      const termMatch = term.term.toLowerCase().includes(query);
      const tagsMatch = term.tags ? term.tags.toLowerCase().includes(query) : false;
      return termMatch || tagsMatch;
    });

    this.activeItemIndex = 0;
  }

  toggleTerm(id: number): void {
    this.expandedTermId = this.expandedTermId === id ? null : id;
  }

  isTermExpanded(id: number): boolean {
    return this.expandedTermId === id;
  }

  parseTags(tags: string | null): string[] {
    if (!tags) {
      return [];
    }
    return tags.split(',').map((tag: string): string => tag.trim()).filter((tag: string): boolean => tag.length > 0);
  }

  trackByTermId(index: number, term: GlossaryTerm): number {
    return term.id;
  }
}
