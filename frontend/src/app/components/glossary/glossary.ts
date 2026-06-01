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
type Zone = 'ZONE_FILTERS' | 'ZONE_INPUT' | 'ZONE_MAIN' | 'ZONE_DETAIL';

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

  // 4-Zone Spatial Navigation State
  currentZone: Zone = 'ZONE_FILTERS';
  highlightedIndex: number = 0;
  private isKeyboardReady = false;

  terms: GlossaryTerm[] = [];
  filteredTerms: GlossaryTerm[] = [];
  searchQuery: string = '';
  activeTermId: number | null = null;
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
    if (changes['isFocusLocked']) {
      if (changes['isFocusLocked'].currentValue && !changes['isFocusLocked'].previousValue) {
        this.resetKeyboardReady();
      } else if (!changes['isFocusLocked'].currentValue) {
        this.isKeyboardReady = false;
      }
    }
  }

  ngOnInit(): void {
    this.loadTerms();
    this.resetKeyboardReady();
  }

  private resetKeyboardReady(): void {
    this.isKeyboardReady = false;
    setTimeout(() => {
      this.isKeyboardReady = true;
    }, 100);
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
        this.errorMessage = 'Không thể tải danh sách thuật ngữ.';
        this.isLoading = false;
        console.error('Error loading glossary terms:', err);
      }
    });
  }

  setGroup(group: FilterGroup): void {
    if (this.activeGroup === group && !this.isGroupLoading) return;
    this.activeGroup = group;
    this.searchQuery = '';

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
        this.errorMessage = 'Không thể lọc thuật ngữ.';
        this.isLoading = false;
        this.isGroupLoading = false;
        console.error('Error filtering glossary terms:', err);
      }
    });
  }

  filterTerms(): void {
    const query = this.searchQuery.trim().toLowerCase();

    if (!query) {
      this.setGroup(this.activeGroup);
      return;
    }

    this.filteredTerms = this.terms.filter((term: GlossaryTerm): boolean => {
      const termMatch = term.term.toLowerCase().includes(query);
      const tagsMatch = term.tags ? term.tags.toLowerCase().includes(query) : false;
      return termMatch || tagsMatch;
    });
  }

  private selectFirstIfNeeded(): void {
    if (this.filteredTerms.length > 0 && this.activeTermId === null) {
      this.selectTerm(this.filteredTerms[0]);
    }
  }

  selectTerm(term: GlossaryTerm): void {
    this.activeTermId = term.id;
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

  private scrollActiveItemIntoView(): void {
    setTimeout(() => {
      const activeElement = document.querySelector('.term-row.is-keyboard-highlighted');
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }, 10);
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.isKeyboardReady || !this.isFocusLocked || this.isLoading) return;

    const key = event.key.toLowerCase();

    // ================================
    // GLOBAL: ESC - Exit keyboard mode
    // ================================
    if (key === 'escape') {
      event.preventDefault();
      event.stopPropagation();
      (document.activeElement as HTMLElement)?.blur();
      return;
    }

    // ================================
    // ZONE_FILTERS: Horizontal filter tabs
    // ================================
    if (this.currentZone === 'ZONE_FILTERS') {
      // A / ←: Move left to previous filter (instant trigger)
      if (key === 'a' || key === 'arrowleft') {
        event.preventDefault();
        event.stopPropagation();
        if (this.highlightedIndex > 0) {
          this.highlightedIndex--;
          this.setGroup(this.filterGroups[this.highlightedIndex].key);
        }
        return;
      }

      // D / →: Move right to next filter (instant trigger)
      if (key === 'd' || key === 'arrowright') {
        event.preventDefault();
        event.stopPropagation();
        if (this.highlightedIndex < this.filterGroups.length - 1) {
          this.highlightedIndex++;
          this.setGroup(this.filterGroups[this.highlightedIndex].key);
        }
        return;
      }

      // W / ↑: Go to ZONE_INPUT (search)
      if (key === 'w' || key === 'arrowup') {
        event.preventDefault();
        event.stopPropagation();
        this.currentZone = 'ZONE_INPUT';
        setTimeout(() => {
          const searchInput = document.getElementById('glossary-search') as HTMLInputElement;
          if (searchInput) searchInput.focus();
        }, 0);
        return;
      }

      // S / ↓: Drop to ZONE_MAIN (first item)
      if (key === 's' || key === 'arrowdown') {
        event.preventDefault();
        event.stopPropagation();
        if (this.filteredTerms.length > 0) {
          this.highlightedIndex = 0;
          this.selectTerm(this.filteredTerms[0]);
          this.currentZone = 'ZONE_MAIN';
        }
        return;
      }
      return;
    }

    // ================================
    // ZONE_INPUT: Search input
    // ================================
    if (this.currentZone === 'ZONE_INPUT') {
      // S / ↓: Go back to ZONE_FILTERS
      if (key === 's' || key === 'arrowdown') {
        event.preventDefault();
        event.stopPropagation();
        const searchInput = document.getElementById('glossary-search') as HTMLInputElement;
        if (searchInput) searchInput.blur();
        this.currentZone = 'ZONE_FILTERS';
        return;
      }
      return;
    }

    // ================================
    // ZONE_MAIN: Main scrollable list
    // ================================
    if (this.currentZone === 'ZONE_MAIN') {
      // W / ↑: Move up
      if (key === 'w' || key === 'arrowup') {
        event.preventDefault();
        event.stopPropagation();
        if (this.highlightedIndex === 0) {
          this.currentZone = 'ZONE_FILTERS';
        } else {
          this.highlightedIndex--;
          this.selectTerm(this.filteredTerms[this.highlightedIndex]);
          this.scrollActiveItemIntoView();
        }
        return;
      }

      // S / ↓: Move down
      if (key === 's' || key === 'arrowdown') {
        event.preventDefault();
        event.stopPropagation();
        if (this.highlightedIndex < this.filteredTerms.length - 1) {
          this.highlightedIndex++;
          this.selectTerm(this.filteredTerms[this.highlightedIndex]);
          this.scrollActiveItemIntoView();
        }
        return;
      }

      // D / →: Activate ZONE_DETAIL
      if (key === 'd' || key === 'arrowright') {
        event.preventDefault();
        event.stopPropagation();
        this.currentZone = 'ZONE_DETAIL';
        const pane = document.getElementById('glossary-detail-pane');
        if (pane) pane.focus();
        return;
      }

      // A / ←: Jump back to ZONE_FILTERS
      if (key === 'a' || key === 'arrowleft') {
        event.preventDefault();
        event.stopPropagation();
        this.currentZone = 'ZONE_FILTERS';
        return;
      }
      return;
    }

    // ================================
    // ZONE_DETAIL: Detail panel (scroll content)
    // ================================
    if (this.currentZone === 'ZONE_DETAIL') {
      const pane = document.getElementById('glossary-detail-pane');

      // W / ↑: Scroll up
      if (key === 'w' || key === 'arrowup') {
        event.preventDefault();
        event.stopPropagation();
        if (pane) pane.scrollTop -= 60;
        return;
      }

      // S / ↓: Scroll down
      if (key === 's' || key === 'arrowdown') {
        event.preventDefault();
        event.stopPropagation();
        if (pane) pane.scrollTop += 60;
        return;
      }

      // A / ← or Backspace: Back to ZONE_MAIN
      if (key === 'a' || key === 'arrowleft' || key === 'backspace') {
        event.preventDefault();
        event.stopPropagation();
        this.currentZone = 'ZONE_MAIN';
        this.scrollActiveItemIntoView();
        return;
      }
      return;
    }
  }
}
