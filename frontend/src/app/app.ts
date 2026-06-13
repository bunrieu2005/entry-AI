import { Component, HostListener, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';

import { SidebarComponent } from './components/sidebar/sidebar';
import { HeaderComponent } from './components/header/header';
import { HeroSectionComponent } from './components/hero-section/hero-section';
import { GuidesComponent } from './components/guides/guides';
import { AiToolsComponent } from './components/ai-tools/ai-tools';
import { GlossaryComponent } from './components/glossary/glossary';
import { PromptsComponent } from './components/prompts/prompts';
import { FavoritePromptsComponent } from './components/favorite-prompts/favorite-prompts';
import { KeyboardNavigationService, SidebarModuleId } from './services/keyboard-navigation.service';

export interface ModuleInfo {
  id: string;
  name: string;
  desc: string;
  icon: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarComponent,
    HeaderComponent,
    HeroSectionComponent,
    PromptsComponent,
    FavoritePromptsComponent,
    GuidesComponent,
    AiToolsComponent,
    GlossaryComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  readonly keyboardNavigation = inject(KeyboardNavigationService);

  readonly modulesList: SidebarModuleId[] = [
    'guides',
    'explore',
    'glossary',
    'prompts',
    'favorite-prompts',
    'ai-guidelines'
  ];
  
  private readonly defaultModuleRoutes: Partial<Record<SidebarModuleId, string>> = {
    'ai-guidelines': '/ai-guidelines/gemini'
  };

  activeModuleId: string = 'guides';
  isHomePage: boolean = true;

  private routerSub?: Subscription;

  constructor() {}

  ngOnInit(): void {
    this.syncFromUrl(this.router.url);
    this.routerSub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e) => this.syncFromUrl((e as NavigationEnd).url));
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  private syncFromUrl(url: string): void {
    const path = url.split('?')[0];

    if (path === '/' || path === '') {
      this.isHomePage = true;
      this.activeModuleId = this.keyboardNavigation.focusedSidebarModule();
      return;
    }

    this.isHomePage = false;

    if (path.startsWith('/ai-guidelines')) {
      this.activeModuleId = 'ai-guidelines';
      this.keyboardNavigation.setFocusedSidebarModule('ai-guidelines');
    } else {
      this.keyboardNavigation.setFocusedSidebarModule(this.activeModuleId as SidebarModuleId);
    }
  }

  onModuleSelected(moduleId: string): void {
    this.activeModuleId = moduleId;
    this.isHomePage = false;
    this.keyboardNavigation.setFocusedSidebarModule(moduleId as SidebarModuleId);
  }

  get isGuidesModule(): boolean {
    return this.activeModuleId === 'guides';
  }

  get isExploreModule(): boolean {
    return this.activeModuleId === 'explore';
  }

  get isGlossaryModule(): boolean {
    return this.activeModuleId === 'glossary';
  }

  get isPromptsModule(): boolean {
    return this.activeModuleId === 'prompts';
  }

  get isFavoritePromptsModule(): boolean {
    return this.activeModuleId === 'favorite-prompts';
  }

  get isAiGuidelinesModule(): boolean {
    return this.activeModuleId === 'ai-guidelines';
  }

  get isLockedInsideModule(): boolean {
    return this.keyboardNavigation.isFocusLocked();
  }

  get showHeroSection(): boolean {
    return (
      this.isHomePage &&
      !this.isGuidesModule &&
      !this.isExploreModule &&
      !this.isGlossaryModule &&
      !this.isPromptsModule &&
      !this.isFavoritePromptsModule &&
      !this.isAiGuidelinesModule
    );
  }

  // ==========================================
  //  SỬA LỖI INPUT)
  // ==========================================
  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
  
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      return;
    }

    if (this.keyboardNavigation.isFocusLocked()) {
      if (this.keyboardNavigation.focusedSidebarModule() === 'ai-guidelines') {
        return;
      }

      const key = event.key.toLowerCase();

      if (key === 'escape') {
        event.preventDefault();
        this.keyboardNavigation.setFocusLocked(false);
        return;
      }
      return;
    }

    const key = event.key;

    if (key >= '1' && key <= '6') {
      event.preventDefault();
      const index = parseInt(key, 10) - 1;
      if (index < this.modulesList.length) {
        const moduleId = this.modulesList[index];
        this.selectModuleByShortcut(moduleId);
      }
      return;
    }

    if (key === 'Enter') {
      event.preventDefault();
      this.keyboardNavigation.setFocusLocked(true);
    }
  }

  private selectModuleByShortcut(moduleId: SidebarModuleId): void {
    this.activeModuleId = moduleId;
    this.isHomePage = false;
    this.keyboardNavigation.setFocusedSidebarModule(moduleId);

    const targetRoute = this.defaultModuleRoutes[moduleId];
    if (targetRoute && this.router.url !== targetRoute) {
      this.router.navigateByUrl(targetRoute);
    }
  }

  getHeroTitle(): string {
    switch (this.activeModuleId) {
      case 'guides':
        return 'Hướng Dẫn';
      case 'explore':
        return 'Khám Phá';
      case 'glossary':
        return 'Thuật Ngữ AI';
      case 'prompts':
        return 'Thư Viện Prompt';
      case 'ai-guidelines':
        return 'Hướng Dẫn AI';
      default:
        return 'EntryAI';
    }
  }

  getHeroSubtitle(): string {
    switch (this.activeModuleId) {
      case 'guides':
        return 'Học và làm chủ AI qua các hướng dẫn tương tác';
      case 'explore':
        return 'Bài báo, tin tức và công cụ AI mới nhất';
      case 'glossary':
        return 'Từ điển thuật ngữ AI với ví dụ minh hoạ trực quan';
      case 'prompts':
        return 'Kho prompt mẫu phân loại theo lĩnh vực, sẵn sàng sao chép';
      case 'ai-guidelines':
        return 'Hướng dẫn chi tiết sử dụng Gemini, Claude và ChatGPT';
      default:
        return 'Nền tảng học và làm chủ AI cho người Việt';
    }
  }
}