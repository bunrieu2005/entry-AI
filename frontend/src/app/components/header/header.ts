import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { AuthModalService } from '../../services/auth-modal.service';
import { FavoriteService } from '../../services/favorite.service';
import { LogoutIconComponent } from '../shared/icons/logout-icon';
import { UserCheckIconComponent } from '../shared/icons/user-check-icon';
import { GithubIconComponent } from '../shared/icons/github-icon';
import { FacebookIconComponent } from '../shared/icons/facebook-icon';
import { SendHorizontalIconComponent } from '../shared/icons/send-horizontal-icon';
import { MoonIconComponent } from '../shared/icons/moon-icon';
import { LockIconComponent } from '../shared/icons/lock-icon';
import { TriangleAlertIconComponent } from '../shared/icons/triangle-alert-icon';
import { WcagIconComponent } from '../shared/icons/wcag-icon';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, LogoutIconComponent, UserCheckIconComponent, GithubIconComponent, FacebookIconComponent, SendHorizontalIconComponent, LockIconComponent, MoonIconComponent, WcagIconComponent, TriangleAlertIconComponent],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser$: Observable<any>;

  // Tên trang hiện tại để hiện breadcrumb
  @Input() currentPageName: string = '';

  showModal: boolean = false;
  authMode: 'login' | 'register' = 'login';

  authData = {
    username: '',
    password: '',
    confirmPassword: ''
  };

  // Validation errors keyed by field name
  fieldErrors: Record<string, string> = {};

  private subs = new Subscription();

  constructor(
    private authService: AuthService,
    private authModalService: AuthModalService,
    private favoriteService: FavoriteService,
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    this.subs.add(
      this.authModalService.show$.subscribe((show) => {
        this.showModal = show;
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  openModal(mode: 'login' | 'register' = 'login') {
    this.authModalService.open(mode);
  }

  closeModal() {
    this.authModalService.close();
    this.fieldErrors = {};
    this.authData = { username: '', password: '', confirmPassword: '' };
  }

  clearFieldError(field: string): void {
    delete this.fieldErrors[field];
  }

  submitStep1() {
    this.fieldErrors = {};

    if (!this.authData.username) {
      this.fieldErrors['username'] = 'Vui lòng nhập tài khoản.';
      return;
    }
    if (!this.authData.password) {
      this.fieldErrors['password'] = 'Vui lòng nhập mật khẩu.';
      return;
    }

    if (this.authMode === 'register') {
      if (this.authData.username.length < 4 || this.authData.username.includes(' ')) {
        this.fieldErrors['username'] = 'Tài khoản phải từ 4 ký tự trở lên, không chứa khoảng trắng.';
        return;
      }
      if (this.authData.password.length < 6) {
        this.fieldErrors['password'] = 'Mật khẩu phải từ 6 ký tự trở lên.';
        return;
      }
      const hasLetter = /[a-zA-Z]/.test(this.authData.password);
      const hasNumber = /\d/.test(this.authData.password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(this.authData.password);
      if (!hasLetter || !hasNumber || !hasSpecialChar) {
        this.fieldErrors['password'] = 'Mật khẩu phải bao gồm chữ cái, chữ số và ký tự đặc biệt.';
        return;
      }
      if (this.authData.password !== this.authData.confirmPassword) {
        this.fieldErrors['confirmPassword'] = 'Mật khẩu xác nhận không khớp.';
        return;
      }

      this.authService.register({ username: this.authData.username, password: this.authData.password }).subscribe({
        next: () => {
          this.fieldErrors['success'] = 'Đăng ký thành công! Hãy đăng nhập nhé.';
          this.authMode = 'login';
          this.authData.password = '';
          this.authData.confirmPassword = '';
        },
        error: (err) => {
          const errorMsg = typeof err.error === 'string' ? err.error : 'Tài khoản đã tồn tại!';
          this.fieldErrors['server'] = errorMsg;
        }
      });
    } else {
      this.authService.login({ username: this.authData.username, password: this.authData.password }).subscribe({
        next: () => this.closeModal(),
        error: () => {
          this.fieldErrors['server'] = 'Sai tài khoản hoặc mật khẩu!';
        }
      });
    }
  }

  logout() {
    if (confirm('Bạn có chắc chắn muốn đăng xuất không?')) {
      this.authService.logout();
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleShortcut(event: KeyboardEvent): void {
    if (!document.body.classList.contains('wcag-on')) return;

    const tag = (event.target as HTMLElement).tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    switch (event.key) {
      case '7':
        window.open('https://github.com', '_blank');
        break;
      case '8':
        window.open('https://facebook.com', '_blank');
        break;
      case '9':
        // trigger bổ sung prompt nếu có
        break;
      case '0':
        this.openModal('login');
        break;
      case 'r':
      case 'R':
        this.openModal('register');
        break;
    }
  }
}