import {
  Component,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { LiveAnnouncer } from '@angular/cdk/a11y';

interface Lesson {
  id: string;
  stepOrder: number;
  title: string;
  description: string;
  status: 'done' | 'active' | 'lock';
}

interface Phase {
  name: string;
  colorClass: string;
  lessons: Lesson[];
}

interface ChecklistItem {
  title: string;
  sub: string;
}

interface Tool {
  id: number;
  name: string;
  desc: string;
  icon: string;
  badgeText: string;
  badgeClass: string;
  featured: boolean;
}

interface ToolTip {
  label: string;
  icon: string;
  tool: string;
  highlight: boolean;
}

@Component({
  selector: 'app-vibe-coding-series',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vibe-coding-series.html',
  styleUrl: './vibe-coding-series.css',
})
export class VibeCodingSeriesComponent implements OnInit, OnChanges {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly liveAnnouncer = inject(LiveAnnouncer);

  /** Controlled by parent component (e.g., a header shortcut or sidebar button) */
  @Input() isFocusLocked: boolean = false;

  activeTab: 'non-tech' | 'dev' = 'non-tech';
  selectedLessonId: string | null = null;
  activeCardIndex: number = 0;

  readonly phases: Phase[] = [
    {
      name: 'Giai đoạn 1 — Hiểu',
      colorClass: 'phase-understand',
      lessons: [
        { id: 'lesson-1', stepOrder: 1, title: 'Chọn công cụ theo kiểu của bạn', description: 'Lựa chọn công cụ phù hợp với xuất phát điểm.', status: 'active' },
        { id: 'lesson-2', stepOrder: 2, title: 'Viết prompt để Claude hiểu đúng', description: 'Kỹ thuật giao tiếp bằng ngôn ngữ tự nhiên với AI.', status: 'active' },
        { id: 'lesson-3', stepOrder: 3, title: 'Tạo web đầu tiên — Claude Artifacts', description: 'Tạo sản phẩm chạy ngay trong cửa sổ chat.', status: 'lock' },
      ],
    },
    {
      name: 'Giai đoạn 2 — Tay làm',
      colorClass: 'phase-practice',
      lessons: [
        { id: 'lesson-4', stepOrder: 4, title: 'Tạo landing page — Bolt / Lovable', description: 'Đưa sản phẩm lên internet với giao diện chỉnh chu.', status: 'lock' },
        { id: 'lesson-5', stepOrder: 5, title: 'AI làm sai — debug không cần code', description: 'Cách xử lý khi AI tạo ra lỗi hoặc không đúng ý.', status: 'lock' },
        { id: 'lesson-6', stepOrder: 6, title: 'Thêm tính năng — không cần dev', description: 'Mở rộng ứng dụng bằng cách nói chuyện liên tục.', status: 'lock' },
      ],
    },
  ];

  readonly tools: Tool[] = [
    { id: 1, name: 'Claude.ai',     desc: 'Mới hoàn toàn, chưa biết code. Thấy kết quả ngay trong chat.', icon: 'ti-message-chatbot', badgeText: '← Bắt đầu ở đây', badgeClass: 'start',   featured: true  },
    { id: 2, name: 'Lovable',       desc: 'Giao diện đẹp nhất, có database, deploy 1 nút bấm.',            icon: 'ti-heart',           badgeText: 'App đẹp, deploy ngay', badgeClass: 'now',    featured: false },
    { id: 3, name: 'Bolt.new',      desc: 'Không cần đăng ký. Gõ mô tả → thấy kết quả trong 5 phút.',     icon: 'ti-bolt',            badgeText: 'Thử cho biết',          badgeClass: 'free',   featured: false },
    { id: 4, name: 'Replit',        desc: 'Frontend + backend + database trong một chỗ.',                   icon: 'ti-server',          badgeText: 'Cần database thật',    badgeClass: 'power', featured: false },
    { id: 5, name: 'Cursor / Claude Code', desc: 'AI làm phần nặng, bạn kiểm soát từng chi tiết.',        icon: 'ti-terminal',        badgeText: 'Biết chút code',        badgeClass: 'dev',    featured: false },
  ];

  readonly toolTips: ToolTip[] = [
    { label: 'Mới bắt đầu, chưa biết gì',           icon: 'ti-user',    tool: 'Claude.ai',           highlight: true  },
    { label: 'Muốn app đẹp, deploy ngay',            icon: 'ti-rocket',  tool: 'Lovable',             highlight: false },
    { label: 'Thử cho biết, chưa cam kết',            icon: 'ti-eye',     tool: 'Bolt.new',            highlight: false },
    { label: 'Cần database, người dùng thật',        icon: 'ti-database', tool: 'Replit',             highlight: false },
    { label: 'Biết chút code, muốn làm nhanh',       icon: 'ti-code',    tool: 'Cursor / Claude Code', highlight: false },
  ];

  readonly checklistItems: ChecklistItem[] = [
    { title: 'Mô tả được rõ ràng sản phẩm muốn tạo ra',      sub: 'Không chỉ nói chung chung "trang web" — định hình rõ là landing page, portfolio hay form biểu mẫu.' },
    { title: 'Xác định ai sẽ sử dụng / xem sản phẩm này',    sub: 'Khách hàng mua hàng? Đối tác tuyển dụng? Thành viên nội bộ trong team?' },
    { title: 'Liệt kê đầy đủ các đầu nội dung cần có',       sub: 'Các trường nhập dữ liệu, các khối văn bản, số lượng nút bấm mong muốn.' },
    { title: 'Chỉ rõ phong cách hoặc cảm giác giao diện',     sub: 'Tông màu chủ đạo (sáng/tối), phong cách tối giản hay rực rỡ hiện đại.' },
    { title: 'Nêu rõ những yếu tố không muốn xuất hiện',      sub: 'Chặn trước các thiết kế rườm rà hoặc tính năng thừa thãi để AI không làm sai hướng.' },
  ];

  /** Prompt scoring state */
  showScoreArea: boolean = false;
  showSendBtn: boolean = false;
  tipNote: string = '';
  scores = { s1: 0, s2: 0, s3: 0, s4: 0 };
  tags: { label: string; hit: boolean }[] = [];
  checks: boolean[] = [false, false, false, false, false];

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.selectedLessonId = params.get('id');
      if (this.selectedLessonId === 'lesson-2') {
        this.showScoreArea = false;
        this.showSendBtn = false;
        this.checks = [false, false, false, false, false];
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isFocusLocked']) {
      const becameLocked = changes['isFocusLocked'].currentValue && !changes['isFocusLocked'].previousValue;
      const becameUnlocked = !changes['isFocusLocked'].currentValue && changes['isFocusLocked'].previousValue;

      if (becameLocked) {
        this.activeCardIndex = 0;
        this.liveAnnouncer.announce('Chế độ điều hướng bàn phím đã bật. Dùng phím A hoặc D để di chuyển, Enter để chọn, ESC để thoát.', 'assertive');
      }

      if (becameUnlocked) {
        this.liveAnnouncer.announce('Chế độ điều hướng bàn phím đã tắt.', 'polite');
      }
    }
  }

  /** -----------------------------------------------
   *  WASD / Arrow keyboard navigation
   *  WCAG 2.5.5 — Target size (AAA)
   *  WCAG 2.5.2 — Pointer cancellation
   *  ----------------------------------------------- */
  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.isFocusLocked) return;

    const key = event.key.toLowerCase();
    const totalItems = this.getTotalNavigableItems();
    if (totalItems === 0) return;

    if (key === 'escape') {
      event.preventDefault();
      this.liveAnnouncer.announce('Đã thoát chế độ điều hướng bàn phím.', 'assertive');
      return;
    }

    const isForward  = key === 'd' || key === 'arrowright' || key === 'arrowdown'  || key === 's';
    const isBackward = key === 'a' || key === 'arrowleft'  || key === 'arrowup'    || key === 'w';

    if (isForward) {
      event.preventDefault();
      this.activeCardIndex = Math.min(this.activeCardIndex + 1, totalItems - 1);
      this.announceActiveItem();
      return;
    }

    if (isBackward) {
      event.preventDefault();
      this.activeCardIndex = Math.max(this.activeCardIndex - 1, 0);
      this.announceActiveItem();
      return;
    }

    if (key === 'enter') {
      event.preventDefault();
      this.activateCurrentItem();
    }
  }

  /** Returns the total number of navigable items in the current view */
  private getTotalNavigableItems(): number {
    if (!this.selectedLessonId) {
      return this.phases.reduce((acc, p) => acc + p.lessons.length, 0);
    }
    if (this.selectedLessonId === 'lesson-1') {
      return this.tools.length;
    }
    if (this.selectedLessonId === 'lesson-2') {
      return this.checklistItems.length;
    }
    return 0;
  }

  /** Announces the currently targeted item to screen readers via LiveAnnouncer */
  private announceActiveItem(): void {
    const pos = this.activeCardIndex + 1;
    const total = this.getTotalNavigableItems();
    const label = this.getActiveItemLabel();

    this.liveAnnouncer.announce(`${label}. Mục ${pos} trên ${total}.`, 'polite');
  }

  /** Returns the accessible label for the currently targeted item */
  private getActiveItemLabel(): string {
    if (!this.selectedLessonId) {
      let count = 0;
      for (const phase of this.phases) {
        for (const lesson of phase.lessons) {
          if (count === this.activeCardIndex) return `Bài ${lesson.stepOrder}: ${lesson.title}`;
          count++;
        }
      }
    }
    if (this.selectedLessonId === 'lesson-1') {
      const tool = this.tools[this.activeCardIndex];
      return tool ? `${tool.name}. ${tool.desc}` : '';
    }
    if (this.selectedLessonId === 'lesson-2') {
      const item = this.checklistItems[this.activeCardIndex];
      return item ? item.title : '';
    }
    return '';
  }

  /** Activates (clicks) the currently targeted item */
  private activateCurrentItem(): void {
    if (!this.selectedLessonId) {
      let count = 0;
      for (const phase of this.phases) {
        for (const lesson of phase.lessons) {
          if (count === this.activeCardIndex) {
            this.selectLesson(lesson.id, lesson.status);
            return;
          }
          count++;
        }
      }
    }
    if (this.selectedLessonId === 'lesson-2') {
      this.toggleCheck(this.activeCardIndex);
    }
  }

  /** Maps a (phase, local index) pair to the global card index across all phases */
  getGlobalIndex(phase: Phase, localIndex: number): number {
    let offset = 0;
    for (const p of this.phases) {
      if (p === phase) return offset + localIndex;
      offset += p.lessons.length;
    }
    return offset + localIndex;
  }

  /** Maps a tool's local index to its global card index (within lesson-1 view) */
  getToolGlobalIndex(localIndex: number): number {
    const nodeCount = this.phases.reduce((acc, p) => acc + p.lessons.length, 0);
    return nodeCount + localIndex;
  }

  /** -----------------------------------------------
   *  Tab & lesson navigation
   *  ----------------------------------------------- */
  switchTab(tab: 'non-tech' | 'dev'): void {
    this.activeTab = tab;
    this.selectedLessonId = null;
    this.activeCardIndex = 0;
    this.router.navigate(['/vibe-coding/series']);
  }

  selectLesson(lessonId: string, status: string): void {
    if (status === 'lock') return;
    this.selectedLessonId = lessonId;
    this.activeCardIndex = 0;
    this.showScoreArea = false;
    this.showSendBtn = false;
    this.router.navigate(['/vibe-coding/series', lessonId]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goBack(): void {
    this.selectedLessonId = null;
    this.activeCardIndex = 0;
    this.router.navigate(['/vibe-coding/series']);
  }

  goToIntro(): void {
    this.router.navigate(['/vibe-coding/intro']);
  }

  /** -----------------------------------------------
   *  Checklist
   *  ----------------------------------------------- */
  toggleCheck(i: number): void {
    this.checks[i] = !this.checks[i];
    this.liveAnnouncer.announce(
      this.checks[i] ? `${this.checklistItems[i].title}: đã đánh dấu.` : `${this.checklistItems[i].title}: đã bỏ đánh dấu.`,
      'polite'
    );
  }

  get doneCount(): number {
    return this.checks.filter(Boolean).length;
  }

  /** -----------------------------------------------
   *  Prompt scoring
   *  ----------------------------------------------- */
  scorePrompt(promptValue: string): void {
    const txt = promptValue.trim();
    if (!txt) return;

    const words = txt.split(/\s+/).length;
    const hasGoal    = /tạo|làm|viết|xây dựng|trang|form|app|công cụ|tool|list|bảng|card/i.test(txt) ? 1 : 0;
    const hasAudience = /cho|dành|khách|người dùng|nhà|bạn bè|đội nhóm|team/i.test(txt) ? 1 : 0;
    const hasDetail  = /có|bao gồm|gồm|phần|mục|nút|ô|trường|section|tính năng|feature/i.test(txt) ? 1 : 0;
    const hasStyle   = /màu|phong cách|đơn giản|tối giản|đẹp|hiện đại|vintage|tối|sáng|không|tránh/i.test(txt) ? 1 : 0;

    const wordBonus = Math.min(words / 30, 1);
    this.scores.s1 = Math.round(Math.min(hasGoal    * 70 + wordBonus * 30, 100));
    this.scores.s2 = Math.round(Math.min(hasAudience * 80 + wordBonus * 20, 100));
    this.scores.s3 = Math.round(Math.min(hasDetail   * 75 + wordBonus * 25, 100));
    this.scores.s4 = Math.round(Math.min(hasStyle    * 80 + wordBonus * 20, 100));

    this.showScoreArea = true;
    this.showSendBtn   = true;

    this.tags = [
      { label: 'Mục đích',  hit: !!hasGoal    },
      { label: 'Đối tượng',  hit: !!hasAudience },
      { label: 'Chi tiết',   hit: !!hasDetail  },
      { label: 'Phong cách', hit: !!hasStyle   },
    ];

    const avg = (this.scores.s1 + this.scores.s2 + this.scores.s3 + this.scores.s4) / 4;
    if      (avg >= 75) this.tipNote = 'Prompt khá tốt — Claude sẽ hiểu được. Cứ thử gửi đi!';
    else if (avg >= 50) this.tipNote = 'Đã có hướng rõ. Thêm chi tiết về nội dung hoặc phong cách để kết quả sát hơn.';
    else                this.tipNote = 'Prompt còn khá chung. Thêm: dùng để làm gì, có gì bên trong, trông như thế nào.';

    const tip = avg >= 75 ? 'tốt' : avg >= 50 ? 'khá' : 'cần cải thiện';
    this.liveAnnouncer.announce(
      `Điểm trung bình: ${Math.round(avg)} phần trăm. Prompt ${tip}. ${this.tipNote}`,
      'polite'
    );
  }

  sendPrompt(prompt: string): void {
    alert(`EntryAI nhận lệnh chạy thử: \n"${prompt}"`);
  }

  /** -----------------------------------------------
   *  TrackBy functions
   *  ----------------------------------------------- */
  trackByPhase(_index: number, phase: Phase): string {
    return phase.name;
  }

  trackByLessonId(_index: number, lesson: Lesson): string {
    return lesson.id;
  }

  trackByToolId(_index: number, tool: Tool): number {
    return tool.id;
  }

  trackByTipLabel(_index: number, tip: ToolTip): string {
    return tip.label;
  }

  trackByTagLabel(_index: number, tag: { label: string }): string {
    return tag.label;
  }

  trackByChecklistTitle(_index: number, item: ChecklistItem): string {
    return item.title;
  }
}
