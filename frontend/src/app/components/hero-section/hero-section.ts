import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface QuickAccessCard {
  id: string;
  icon: string;
  title: string;
  description: string;
  accent?: string;
}

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.css'
})
export class HeroSectionComponent {
  @Input() title: string = 'EntryAI';
  @Input() subtitle: string = 'Nền tảng học và làm chủ AI cho người Việt';
  @Input() isHome: boolean = true;

  @Output() cardSelected = new EventEmitter<string>();

  quickAccessCards: QuickAccessCard[] = [
    {
      id: 'guides',
      icon: 'ti-device-gamepad',
      title: 'Hướng Dẫn',
      description: 'Học AI qua các bài hướng dẫn tương tác theo phong cách game',
      accent: '#B83B2E'
    },
    {
      id: 'explore',
      icon: 'ti-compass',
      title: 'Khám Phá',
      description: 'Bài báo, tin tức và công cụ AI mới nhất',
      accent: '#8B6E52'
    },
    {
      id: 'glossary',
      icon: 'ti-book',
      title: 'Thuật Ngữ AI',
      description: 'Từ điển thuật ngữ AI với ví dụ minh hoạ trực quan',
      accent: '#5C7A3E'
    },
    {
      id: 'prompts',
      icon: 'ti-terminal-2',
      title: 'Thư Viện Prompt',
      description: 'Kho prompt mẫu phân loại theo lĩnh vực, sẵn sàng sao chép',
      accent: '#3A6B8C'
    }
  ];

  onCardClick(cardId: string): void {
    this.cardSelected.emit(cardId);
  }
}
