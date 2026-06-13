import { Routes } from '@angular/router';
import { AiGuidelinesComponent } from './components/ai-guidelines/ai-guidelines';

export const routes: Routes = [
  {
    path: 'ai-guidelines/:category',
    component: AiGuidelinesComponent,
    title: 'Hướng dẫn AI - Danh mục'
  },
  {
    path: 'ai-guidelines/:category/:lessonNo',
    component: AiGuidelinesComponent,
    title: 'Hướng dẫn AI - Chi tiết bài học'
  },
  {
    path: 'ai-guidelines',
    redirectTo: 'ai-guidelines/gemini',
    pathMatch: 'full'
  }
];
