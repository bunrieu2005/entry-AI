import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter, Subscription } from 'rxjs';
import { SidebarModuleId } from '../../services/keyboard-navigation.service';

export interface SidebarModule {
  id: string;
  name: string;
  desc: string;
  icon: string;
  children?: {
    id: string;
    name: string;
    path: string;
  }[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Output() moduleSelected = new EventEmitter<string>();
  @Input() activeId: string = '';
  @Input() focusedModuleId: SidebarModuleId = 'guides';
  @Input() isKeyboardLocked: boolean = false;

  modules: SidebarModule[] = [
    { id: 'guides', name: 'Hướng dẫn', desc: 'WCAG', icon: 'ti-device-gamepad' },
    { id: 'explore', name: 'Khám phá', desc: 'Bài báo - AI tools', icon: 'ti-compass' },
    { id: 'glossary', name: 'Thuật ngữ AI', desc: 'Từ điển - Ví dụ', icon: 'ti-book' },
    { id: 'prompts', name: 'Thư viện Prompt', desc: 'Theo lĩnh vực', icon: 'ti-terminal-2' },
    { id: 'ai-guidelines', name: 'Hướng dẫn AI', desc: 'Gemini · Claude · ChatGPT', icon: 'ti-sparkles' },
    { id: 'vibe-coding', name: 'Vibe Coding', desc: 'Tạo web - Series', icon: 'ti-code', children: [
      { id: 'intro', name: 'Giới thiệu', path: '/vibe-coding/intro' },
      { id: 'series', name: 'Series Bài học', path: '/vibe-coding/series' }
    ] },
  ]

  activeModuleId: string = 'guides';
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
