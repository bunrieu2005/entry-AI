import { Routes } from '@angular/router';
import { VibeCodingIntroComponent } from './vibe-coding-intro/vibe-coding-intro';
import { VibeCodingSeriesComponent } from './vibe-coding-series/vibe-coding-series';
export const routes: Routes = [
  {

    path: 'vibe-coding/intro', 
    component: VibeCodingIntroComponent,
    title: 'Vibe Coding - Giới Thiệu'
  },
  {
    path: 'vibe-coding/series',
    component: VibeCodingSeriesComponent,
    title: 'Vibe Coding - Series Bài Học'
  },
  { 
    path: 'vibe-coding/series/:id', 
    component: VibeCodingSeriesComponent, 
    title: 'Vibe Coding - Nội Dung Bài Học' 
  }
  //  'vibe-coding/series' ,secon
];