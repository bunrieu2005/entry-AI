import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar';
import { HeaderComponent } from './components/header/header';
import { HeroSectionComponent } from './components/hero-section/hero-section';
import { GuidesComponent } from './components/guides/guides';
import { AiToolsComponent } from './components/ai-tools/ai-tools';
import { GlossaryComponent } from './components/glossary/glossary';
import { PromptsComponent } from './components/prompts/prompts';
import { RouterOutlet } from '@angular/router';
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
export class AppComponent {
  readonly modulesList: string[] = ['guides', 'explore', 'glossary', 'prompts', 'vibe-coding'];

  activeModuleId: string = 'guides';
  isLockedInsideModule: boolean = false;

  onModuleSelected(moduleId: string): void {
    this.activeModuleId = moduleId;
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

    if (key >= '1' && key <= '5') {
      event.preventDefault();
      const index = parseInt(key, 10) - 1;
      if (index < this.modulesList.length) {
        this.activeModuleId = this.modulesList[index];
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
      default:
        return 'Nền tảng học và làm chủ AI cho người Việt';
    }
  }
}
