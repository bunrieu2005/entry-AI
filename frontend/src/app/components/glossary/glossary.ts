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

type FilterGroup = 'all' | 'basic' | 'hot';

interface GroupedTerms {
  label: string;
  key: FilterGroup;
  terms: GlossaryTerm[];
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
  activeTermId: number | null = null;
  activeItemIndex: number = 0;
  isLoading: boolean = true;
  isGroupLoading: boolean = false;
  errorMessage: string | null = null;

  activeGroup: FilterGroup = 'all';
  filterGroups: { key: FilterGroup; label: string }[] = [
    { key: 'all', label: 'Tất cả' },
    { key: 'basic', label: 'Cơ bản' },
    { key: 'hot', label: 'Hot 2026' },
  ];

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
        this.selectFirstIfNeeded();
      },
      error: (err: HttpErrorResponse): void => {
        this.errorMessage = 'Không thể tải danh sách thuật ngữ. Vui lòng thử lại sau.';
        this.isLoading = false;
        console.error('Error loading glossary terms:', err);
      }
    });
  }

  setGroup(group: FilterGroup): void {
    if (this.activeGroup === group && !this.isGroupLoading) return;
    this.activeGroup = group;
    this.searchQuery = '';
    this.activeItemIndex = 0;

    this.isGroupLoading = true;
    this.isLoading = true;

    this.http.get<GlossaryTerm[]>(`${this.API_URL}/filter?group=${group}`).subscribe({
      next: (data: GlossaryTerm[]): void => {
        this.filteredTerms = data;
        this.isLoading = false;
        this.isGroupLoading = false;
        this.selectFirstIfNeeded();
      },
      error: (err: HttpErrorResponse): void => {
        this.errorMessage = 'Không thể lọc thuật ngữ. Vui lòng thử lại.';
        this.isLoading = false;
        this.isGroupLoading = false;
        console.error('Error filtering glossary terms:', err);
      }
    });
  }

  filterTerms(): void {
    const query = this.searchQuery.trim().toLowerCase();

    if (!query) {
      // Restore full group list
      this.setGroup(this.activeGroup);
      return;
    }

    // Client-side search within already-loaded terms
    this.filteredTerms = this.terms.filter((term: GlossaryTerm): boolean => {
      const termMatch = term.term.toLowerCase().includes(query);
      const tagsMatch = term.tags ? term.tags.toLowerCase().includes(query) : false;
      return termMatch || tagsMatch;
    });

    this.activeItemIndex = 0;
  }

  private selectFirstIfNeeded(): void {
    if (this.filteredTerms.length > 0 && this.activeTermId === null) {
      this.selectTerm(this.filteredTerms[0]);
    }
  }

  selectTerm(term: GlossaryTerm): void {
    this.activeTermId = term.id;
    const idx = this.filteredTerms.findIndex(t => t.id === term.id);
    if (idx !== -1) this.activeItemIndex = idx;
  }

  isActive(term: GlossaryTerm): boolean {
    return this.activeTermId === term.id;
  }

  navigateToRelated(slug: string): void {
    const found = this.terms.find(t => t.slug === slug);
    if (found) this.selectTerm(found);
  }

  parseTags(tags: string | null): string[] {
    if (!tags) return [];
    return tags.split(',').map((t: string): string => t.trim()).filter((t: string): boolean => t.length > 0);
  }

  get groupedTerms(): GroupedTerms[] {
    if (this.activeGroup !== 'all') return [];

    const groups: GroupedTerms[] = [];
    const basicTerms = this.filteredTerms.filter(t => this.parseTags(t.tags).some(tag =>
      tag.toLowerCase().includes('cơ-bản')
    ));
    const hotTerms = this.filteredTerms.filter(t => this.parseTags(t.tags).some(tag =>
      tag.toLowerCase().includes('hot') || tag.toLowerCase().includes('xu-hướng') || tag.includes('2026')
    ));

    if (basicTerms.length > 0) {
      groups.push({ label: 'Cơ bản', key: 'basic', terms: basicTerms });
    }
    if (hotTerms.length > 0) {
      groups.push({ label: 'Hot 2026', key: 'hot', terms: hotTerms });
    }

    const otherTerms = this.filteredTerms.filter(t => {
      const tags = this.parseTags(t.tags);
      const isBasic = tags.some(tag => tag.toLowerCase().includes('cơ-bản'));
      const isHot = tags.some(tag => tag.toLowerCase().includes('hot') || tag.toLowerCase().includes('xu-hướng') || tag.includes('2026'));
      return !isBasic && !isHot;
    });
    if (otherTerms.length > 0) {
      groups.push({ label: 'Khác', key: 'all', terms: otherTerms });
    }

    return groups;
  }

  trackByTermId(index: number, term: GlossaryTerm): number {
    return term.id;
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.isFocusLocked || this.isLoading || this.filteredTerms.length === 0) {
      return;
    }

    const key = event.key.toLowerCase();

    if (key === 's' || key === 'arrowdown') {
      event.preventDefault();
      if (this.activeItemIndex < this.filteredTerms.length - 1) {
        this.activeItemIndex++;
        this.selectTerm(this.filteredTerms[this.activeItemIndex]);
      }
      return;
    }

    if (key === 'w' || key === 'arrowup') {
      event.preventDefault();
      if (this.activeItemIndex > 0) {
        this.activeItemIndex--;
        this.selectTerm(this.filteredTerms[this.activeItemIndex]);
      }
      return;
    }

    if (key === 'enter') {
      event.preventDefault();
      const term = this.filteredTerms[this.activeItemIndex];
      if (term) {
        this.selectTerm(term);
      }
    }
  }
}
