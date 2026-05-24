import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GeminiLessonsComponent } from './gemini-lessons';
import { ClaudeLessonsComponent } from './claude-lessons';
import { ChatgptLessonsComponent } from './chatgpt-lessons';

@Component({
  selector: 'app-ai-guidelines',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    GeminiLessonsComponent,
    ClaudeLessonsComponent,
    ChatgptLessonsComponent
  ],
  templateUrl: './ai-guidelines.html',
  styleUrl: './ai-guidelines.css'
})
export class AiGuidelinesComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);

  // Khai báo cứng 3 con AI cố định ở Sidebar cho đỡ rối
  aiTabs = [
    { id: 'gemini', name: 'Gemini', icon: 'ti-database' },
    { id: 'claude', name: 'Claude', icon: 'ti-sparkles' },
    { id: 'chatgpt', name: 'ChatGPT', icon: 'ti-message-chatbot' }
  ];

  currentCategory: string = 'gemini'; // Con AI đang chọn
  lessons: any[] = [];                // Danh sách bài viết bên trái
  currentLesson: any = null;          // Chi tiết bài đọc bên phải

  get currentAiTab() {
    return this.aiTabs.find(t => t.id === this.currentCategory) ?? this.aiTabs[0];
  }

  ngOnInit() {
    // Liên tục lắng nghe sự thay đổi của URL
    this.route.paramMap.subscribe(params => {
      const cat = params.get('category') || 'gemini';
      const no = params.get('lessonNo');

      this.currentCategory = cat;

      // API 1: Lấy danh sách bài của con AI đó
      this.http.get<any[]>(`http://localhost:8080/api/ai-guidelines/${cat}`)
        .subscribe({
          next: (res) => this.lessons = res,
          error: (err) => console.error('Lỗi tải danh sách bài:', err)
        });

      // API 2: Nếu URL có số bài (ví dụ: /1) thì lấy chi tiết bài viết
      if (no) {
        this.http.get(`http://localhost:8080/api/ai-guidelines/${cat}/${no}`)
          .subscribe({
            next: (res) => this.currentLesson = res,
            error: (err) => {
              console.error('Lỗi tải chi tiết bài:', err);
              this.currentLesson = null;
            }
          });
      } else {
        this.currentLesson = null; // Trở về màn hình chờ nếu chưa chọn bài cụ thể
      }
    });
  }

  // Bấm vào tên con AI (Gemini/Claude...) -> Đổi URL danh mục lớn
  changeCategory(catId: string) {
    this.router.navigate(['/ai-guidelines', catId]);
  }

  // Bấm vào bài viết cụ thể (Bài 1/Bài 2...) -> Đổi URL chi tiết
  selectLesson(lessonId: string) {
    // Cắt chuỗi lấy số cuối (Ví dụ: "gemini-1" -> lấy số "1")
    const no = lessonId.split('-')[1];
    this.router.navigate(['/ai-guidelines', this.currentCategory, no]);
  }
}