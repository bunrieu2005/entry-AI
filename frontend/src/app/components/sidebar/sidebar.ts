import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  HostListener
} from '@angular/core';

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
    BookIconComponent
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
    {
      id: 'home',
      name: 'Trang chủ',
      desc: 'Giới thiệu',
      icon: 'ti-home',
      customIcon: 'home'
    },
    {
      id: 'explore',
      name: 'Khám phá',
      desc: 'Bài báo - AI tools',
      icon: 'ti-compass',
      customIcon: 'openai'
    },
    {
      id: 'glossary',
      name: 'Thuật ngữ AI',
      desc: 'Từ điển - Ví dụ',
      icon: 'ti-book',
      customIcon: 'library'
    },
    {
      id: 'prompts',
      name: 'Thư viện Prompt',
      desc: 'Theo lĩnh vực',
      icon: 'ti-terminal-2',
      customIcon: 'paypal'
    },
    {
      id: 'favorite-prompts',
      name: 'Yêu thích',
      desc: 'Prompt đã lưu',
      icon: 'ti-heart',
      customIcon: 'hand-heart'
    },
    {
      id: 'ai-guidelines',
      name: 'Hướng dẫn AI',
      desc: 'Gemini · Claude · ChatGPT',
      icon: 'ti-sparkles',
      customIcon: 'book'
    }
  ];

  activeModuleId = 'explore';

  expandedIds = new Set<string>();

  isWcagModeActive = false;

  private routerSub?: Subscription;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.syncExpandedFromUrl(this.router.url);

    this.routerSub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(e => {
        this.syncExpandedFromUrl(
          (e as NavigationEnd).url
        );
      });

    // Capture phase để bắt phím trước browser
    document.addEventListener('keydown', this.captureShortcut.bind(this), true);
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
    document.removeEventListener('keydown', this.captureShortcut.bind(this), true);
  }

  captureShortcut(event: KeyboardEvent): void {
    if (!this.isWcagModeActive) return;

    const target = event.target as HTMLElement;
    const tag = target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable) return;
    if (document.querySelector('.modal-overlay')) return;

    const keyMap: Record<string, string> = {
      '1': 'home', '2': 'explore', '3': 'glossary',
      '4': 'prompts', '5': 'favorite-prompts', '6': 'ai-guidelines'
    };

    if (keyMap[event.key]) {
      event.preventDefault();
      event.stopPropagation();
      this.selectModule(keyMap[event.key]);
    }
  }

  @HostListener('document:keyup.alt', ['$event'])
  handleAlt(event: Event): void {
    event.preventDefault();
    this.toggleWcagMode();
  }

  toggleWcagMode(event?: Event): void {

    event?.stopPropagation();

    this.isWcagModeActive = !this.isWcagModeActive;

    if (this.isWcagModeActive) {
      document.body.classList.add('wcag-on');
    } else {
      document.body.classList.remove('wcag-on');
    }
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

    if (moduleId === 'home') {
      this.router.navigateByUrl('/');
    }

    if (moduleId === 'ai-guidelines') {
      this.router.navigateByUrl('/ai-guidelines');
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
    return mod.children?.some(
      c => this.router.url.startsWith(c.path)
    ) ?? false;
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