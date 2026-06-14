import { Injectable, signal } from '@angular/core';

export type SidebarModuleId =
  | 'home'
  | 'explore'
  | 'glossary'
  | 'prompts'
  | 'favorite-prompts'
  | 'ai-guidelines';

export type AiGuidelineSubCategory = 'gemini' | 'claude' | 'chatgpt';

@Injectable({
  providedIn: 'root',
})
export class KeyboardNavigationService {
  readonly isFocusLocked = signal<boolean>(false);
  readonly focusedSidebarModule = signal<SidebarModuleId>('home');

  setFocusLocked(isLocked: boolean): void {
    this.isFocusLocked.set(isLocked);
  }

  setFocusedSidebarModule(moduleId: SidebarModuleId): void {
    this.focusedSidebarModule.set(moduleId);
  }
}
