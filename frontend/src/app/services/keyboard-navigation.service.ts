import { Injectable, signal } from '@angular/core';

export type SidebarModuleId =
  | 'guides'
  | 'explore'
  | 'glossary'
  | 'prompts'
  | 'ai-guidelines'
  | 'vibe-coding';

export type AiGuidelineSubCategory = 'gemini' | 'claude' | 'chatgpt';

@Injectable({
  providedIn: 'root',
})
export class KeyboardNavigationService {
  readonly isFocusLocked = signal<boolean>(false);
  readonly focusedSidebarModule = signal<SidebarModuleId>('guides');

  setFocusLocked(isLocked: boolean): void {
    this.isFocusLocked.set(isLocked);
  }

  setFocusedSidebarModule(moduleId: SidebarModuleId): void {
    this.focusedSidebarModule.set(moduleId);
  }
}
