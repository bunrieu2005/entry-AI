import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
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
    GuidesComponent,
    AiToolsComponent,
    GlossaryComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class AppComponent implements OnInit, OnDestroy {
  readonly modulesList: string[] = ['guides', 'explore', 'glossary', 'prompts', 'vibe-coding', 'ai-guidelines'];

  activeModuleId: string = 'guides';
  isLockedInsideModule: boolean = false;
  isHomePage: boolean = true;

  private routerSub?: Subscription;

  constructor(private router: Router) {}

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
      return;
    }

    this.isHomePage = false;

    if (path.startsWith('/ai-guidelines')) {
      this.activeModuleId = 'ai-guidelines';
    } else if (path.startsWith('/vibe-coding')) {
      this.activeModuleId = 'vibe-coding';
    }
  }

  onModuleSelected(moduleId: string): void {
    this.activeModuleId = moduleId;
    this.isHomePage = false;
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

  get isVibeModule(): boolean {
    return this.activeModuleId === 'vibe-coding';
  }

  get isAiGuidelinesModule(): boolean {
    return this.activeModuleId === 'ai-guidelines';
  }

  get showHeroSection(): boolean {
    return (
      this.isHomePage &&
      !this.isGuidesModule &&
      !this.isExploreModule &&
      !this.isGlossaryModule &&
      !this.isPromptsModule &&
      !this.isVibeModule &&
      !this.isAiGuidelinesModule
    );
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (this.isLockedInsideModule) {
      if (event.key === 'Escape') {
        event.preventDefault();
        this.isLockedInsideModule = false;
        return;
      }
      return;
    }

    const key = event.key;

    if (key >= '1' && key <= '6') {
      event.preventDefault();
      const index = parseInt(key, 10) - 1;
      if (index < this.modulesList.length) {
        this.activeModuleId = this.modulesList[index];
        this.isHomePage = false;
      }
      return;
    }

    if (key === 'Enter') {
      event.preventDefault();
      this.isLockedInsideModule = true;
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
      case 'vibe-coding':
        return 'Vibe Coding';
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
      case 'vibe-coding':
        return 'Series hướng dẫn tạo web từ ý tưởng đến sản phẩm';
      case 'ai-guidelines':
        return 'Hướng dẫn chi tiết sử dụng Gemini, Claude và ChatGPT';
      default:
        return 'Nền tảng học và làm chủ AI cho người Việt';
    }
  }
}
