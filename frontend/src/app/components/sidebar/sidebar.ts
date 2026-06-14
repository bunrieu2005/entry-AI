import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter, Subscription } from 'rxjs';
import { SidebarModuleId } from '../../services/keyboard-navigation.service';
import { HomeIconComponent } from '../shared/icons/home-icon';
import { OpenaiIconComponent } from '../shared/icons/openai-icon';
import { LibraryIconComponent } from '../shared/icons/library-icon';
import { PaypalIconComponent } from '../shared/icons/paypal-icon';
import { HandHeartIconComponent } from '../shared/icons/hand-heart-icon';
import { BookIconComponent } from '../shared/icons/book-icon';

export interface SidebarModule {
  id: string;
  name: string;
  desc: string;
  icon: string;
  customIcon?: string;
  children?: {
    id: string;
    name: string;
    path: string;
  }[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HomeIconComponent,
    OpenaiIconComponent,
    LibraryIconComponent,
    PaypalIconComponent,
    HandHeartIconComponent,
    BookIconComponent,
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Output() moduleSelected = new EventEmitter<string>();
  @Input() activeId: string = '';
  @Input() focusedModuleId: SidebarModuleId = 'home';
  @Input() isKeyboardLocked: boolean = false;

  modules: SidebarModule[] = [
    { id: 'home', name: 'Trang chủ', desc: 'Giới thiệu', icon: 'ti-home', customIcon: 'home' },
    { id: 'explore', name: 'Khám phá', desc: 'Bài báo - AI tools', icon: 'ti-compass', customIcon: 'openai' },
    { id: 'glossary', name: 'Thuật ngữ AI', desc: 'Từ điển - Ví dụ', icon: 'ti-book', customIcon: 'library' },
    { id: 'prompts', name: 'Thư viện Prompt', desc: 'Theo lĩnh vực', icon: 'ti-terminal-2', customIcon: 'paypal' },
    { id: 'favorite-prompts', name: 'Yêu thích', desc: 'Prompt đã lưu', icon: 'ti-heart', customIcon: 'hand-heart' },
    { id: 'ai-guidelines', name: 'Hướng dẫn AI', desc: 'Gemini · Claude · ChatGPT', icon: 'ti-sparkles', customIcon: 'book' },
  ]

  activeModuleId: string = 'explore';
  expandedIds = new Set<string>();
  private routerSub?: Subscription;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.syncExpandedFromUrl(this.router.url);
    this.routerSub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e) => this.syncExpandedFromUrl((e as NavigationEnd).url));
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  private syncExpandedFromUrl(url: string): void {
    for (const mod of this.modules) {
      if (mod.children?.some(c => url.startsWith(c.path))) {
        this.expandedIds.add(mod.id);
        this.activeModuleId = mod.id;
      }
    }
  }

  selectModule(moduleId: string): void {
    this.activeModuleId = moduleId;
    if (moduleId === 'ai-guidelines') {
      this.router.navigateByUrl('/ai-guidelines');
    }
    if (moduleId === 'home') {
      this.router.navigateByUrl('/');
    }

    if (this.modules.find(m => m.id === moduleId)?.children) {
      this.expandedIds.add(moduleId);
    } else {
      this.expandedIds.delete(moduleId);
    }
    this.moduleSelected.emit(moduleId);
  }

  isActive(moduleId: string): boolean {
    return (this.activeId || this.activeModuleId) === moduleId;
  }

  isExpanded(moduleId: string): boolean {
    return this.expandedIds.has(moduleId);
  }

  hasActiveChild(mod: SidebarModule): boolean {
    return mod.children?.some(c => this.router.url.startsWith(c.path)) ?? false;
  }

  isFocused(moduleId: string): boolean {
    return this.focusedModuleId === moduleId;
  }

  toggleExpand(moduleId: string, event?: Event): void {
    event?.stopPropagation();
    if (this.expandedIds.has(moduleId)) {
      this.expandedIds.delete(moduleId);
    } else {
      this.expandedIds.add(moduleId);
    }
  }
}