import { Component, HostListener, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface GuideStep {
  stepNumber: number;
  title: string;
  description: string;
  actionHint: string;
}

export interface MenuItem {
  id: number;
  name: string;
}

@Component({
  selector: 'app-guides',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './guides.html',
  styleUrl: './guides.css'
})
export class GuidesComponent implements OnChanges, OnDestroy {
  private readonly COPY_DEMO_TEXT = 'Hãy thử tạo một prompt hiệu quả cho AI của bạn!';
  private readonly COPY_RESET_DELAY_MS = 3000;
  private readonly MENU_ITEM_COUNT = 3;

  @Input() isFocusLocked: boolean = false;

  readonly steps: GuideStep[] = [
    {
      stepNumber: 1,
      title: 'Di chuyển Menu bằng phím Mũi tên',
      description: 'Sử dụng phím Mũi tên Lên (↑) và Mũi tên Xuống (↓) để duyệt nhanh qua các phân khu trên ứng dụng mà không cần chạm chuột. Các phân khu bao gồm: Hướng dẫn, Khám phá, Thuật ngữ AI, Thư viện Prompt và Vibe Coding.',
      actionHint: 'Hãy thử nhấn phím ↑ hoặc ↓ trên bàn phím của bạn.'
    },
    {
      stepNumber: 2,
      title: 'Mở nhanh ô Tìm kiếm bằng phím gạch chéo (/)',
      description: 'Khi đang ở bất kỳ đâu, chỉ cần gõ phím gạch chéo [/] để tự động nhảy và tập trung con trỏ vào ô Tìm kiếm hệ thống. Thao tác này giúp bạn tiết kiệm thời gian di chuyển chuột.',
      actionHint: 'Hãy thử nhấn phím [/] trên bàn phím.'
    },
    {
      stepNumber: 3,
      title: 'Sao chép nhanh bằng phím Enter',
      description: 'Khi đang chọn một thẻ Prompt, bạn chỉ cần nhấn phím [Enter] để hệ thống tự động sao chép toàn bộ câu lệnh vào bộ nhớ clipboard. Không cần tìm và bấm nút Sao chép thủ công.',
      actionHint: 'Hãy thử nhấn phím [Enter] để copy lệnh mẫu.'
    }
  ];

  readonly menuItems: MenuItem[] = [
    { id: 0, name: 'Thư viện Prompt' },
    { id: 1, name: 'Thuật ngữ AI' },
    { id: 2, name: 'Vibe Coding' }
  ];

  currentStepIndex: number = 0;
  mockMenuIndex: number = 0;
  isSearchFocused: boolean = false;
  hasCopiedDemo: boolean = false;
  activeLevelIndex: number = 0;

  private copyTimeoutId: ReturnType<typeof setTimeout> | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isFocusLocked'] && !changes['isFocusLocked'].previousValue && changes['isFocusLocked'].currentValue) {
      this.activeLevelIndex = 0;
    }
  }

  ngOnDestroy(): void {
    if (this.copyTimeoutId) {
      clearTimeout(this.copyTimeoutId);
    }
  }

  get currentStep(): GuideStep {
    return this.steps[this.currentStepIndex];
  }

  get isFirstStep(): boolean {
    return this.currentStepIndex === 0;
  }

  get isLastStep(): boolean {
    return this.currentStepIndex === this.steps.length - 1;
  }

  get totalSteps(): number {
    return this.steps.length;
  }

  isActive(itemId: number): boolean {
    return this.mockMenuIndex === itemId;
  }

  nextStep(): void {
    if (!this.isLastStep) {
      this.currentStepIndex++;
      this.resetSandboxState();
    }
  }

  prevStep(): void {
    if (!this.isFirstStep) {
      this.currentStepIndex--;
      this.resetSandboxState();
    }
  }

  private resetSandboxState(): void {
    this.mockMenuIndex = 0;
    this.isSearchFocused = false;
    this.hasCopiedDemo = false;
    if (this.copyTimeoutId) {
      clearTimeout(this.copyTimeoutId);
      this.copyTimeoutId = null;
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (this.isFocusLocked) {
      this.handleLockedNavigation(event);
      return;
    }

    const target = event.target as HTMLElement;
    const isInputFocused = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

    switch (this.currentStep.stepNumber) {
      case 1:
        this.handleStep1Keydown(event);
        break;
      case 2:
        this.handleStep2Keydown(event, isInputFocused);
        break;
      case 3:
        this.handleStep3Keydown(event, isInputFocused);
        break;
    }
  }

  private handleLockedNavigation(event: KeyboardEvent): void {
    const key = event.key.toLowerCase();

    if (key === 'w' || key === 'arrowup') {
      event.preventDefault();
      this.activeLevelIndex = Math.max(this.activeLevelIndex - 1, 0);
      return;
    }

    if (key === 's' || key === 'arrowdown') {
      event.preventDefault();
      this.activeLevelIndex = Math.min(this.activeLevelIndex + 1, this.menuItems.length - 1);
      return;
    }

    if (key === 'a' || key === 'arrowleft') {
      event.preventDefault();
      this.activeLevelIndex = Math.max(this.activeLevelIndex - 1, 0);
      return;
    }

    if (key === 'd' || key === 'arrowright') {
      event.preventDefault();
      this.activeLevelIndex = Math.min(this.activeLevelIndex + 1, this.menuItems.length - 1);
      return;
    }

    if (key === 'enter') {
      event.preventDefault();
    }
  }

  private handleStep1Keydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        this.mockMenuIndex = this.mockMenuIndex > 0
          ? this.mockMenuIndex - 1
          : this.MENU_ITEM_COUNT - 1;
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.mockMenuIndex = (this.mockMenuIndex + 1) % this.MENU_ITEM_COUNT;
        break;
    }
  }

  private handleStep2Keydown(event: KeyboardEvent, isInputFocused: boolean): void {
    if (event.key === '/' && !isInputFocused) {
      event.preventDefault();
      this.isSearchFocused = true;
    }
  }

  private handleStep3Keydown(event: KeyboardEvent, isInputFocused: boolean): void {
    if (event.key === 'Enter' && !isInputFocused && !this.hasCopiedDemo) {
      event.preventDefault();
      this.testCopyAction();
    }
  }

  testCopyAction(): void {
    if (this.hasCopiedDemo) {
      return;
    }

    navigator.clipboard.writeText(this.COPY_DEMO_TEXT).then(() => {
      this.triggerCopySuccess();
    }).catch(() => {
      this.triggerCopySuccess();
    });
  }

  private triggerCopySuccess(): void {
    this.hasCopiedDemo = true;

    if (this.copyTimeoutId) {
      clearTimeout(this.copyTimeoutId);
    }

    this.copyTimeoutId = setTimeout(() => {
      this.hasCopiedDemo = false;
      this.copyTimeoutId = null;
    }, this.COPY_RESET_DELAY_MS);
  }
}
