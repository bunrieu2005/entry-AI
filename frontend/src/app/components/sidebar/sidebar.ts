import { Component, Output, EventEmitter, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
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
export class SidebarComponent {
  @Output() moduleSelected = new EventEmitter<string>();
  @Input() activeId: string = '';

  modules: SidebarModule[] = [
    { id: 'guides', name: 'Hướng dẫn', desc: 'WCAG', icon: 'ti-device-gamepad' },
    { id: 'explore', name: 'Khám phá', desc: 'Bài báo - AI tools', icon: 'ti-compass' },
    { id: 'glossary', name: 'Thuật ngữ AI', desc: 'Từ điển - Ví dụ', icon: 'ti-book' },
    { id: 'prompts', name: 'Thư viện Prompt', desc: 'Theo lĩnh vực', icon: 'ti-terminal-2' },
    { id: 'vibe-coding', name: 'Vibe Coding', desc: 'Tạo web - Series', icon: 'ti-code', children: [
      { id: 'intro', name: 'Giới thiệu', path: '/vibe-coding/intro' },
      { id: 'series', name: 'Series Bài học', path: '/vibe-coding/series' }
    ] },
  ]

  activeModuleId: string = 'guides';

  selectModule(moduleId: string): void {
    this.activeModuleId = moduleId;
    this.moduleSelected.emit(moduleId);
  }

  isActive(moduleId: string): boolean {
    return (this.activeId || this.activeModuleId) === moduleId;
  }
}
