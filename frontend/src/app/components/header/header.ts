import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { AuthModalService } from '../../services/auth-modal.service';
import { FavoriteService } from '../../services/favorite.service'; 

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser$: Observable<any>;

  showModal: boolean = false;
  authMode: 'login' | 'register' = 'login';

  authData = {
    username: '',
    password: '',
    confirmPassword: ''
  };

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
  }

  submitStep1() {
    if (!this.authData.username || !this.authData.password) {
      alert('Vui lòng nhập đầy đủ tài khoản và mật khẩu!');
      return;
    }
    
    if (this.authMode === 'register') {
      if (this.authData.username.length < 4 || this.authData.username.includes(' ')) {
        alert('Tài khoản phải từ 4 ký tự trở lên và không chứa khoảng trắng!'); return;
      }
      if (this.authData.password.length < 6) {
        alert('Mật khẩu quá ngắn, vui lòng nhập ít nhất 6 ký tự!'); return;
      }
      const hasLetter = /[a-zA-Z]/.test(this.authData.password);
      const hasNumber = /\d/.test(this.authData.password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(this.authData.password);
      if (!hasLetter || !hasNumber || !hasSpecialChar) {
        alert('Mật khẩu phải bao gồm chữ cái, chữ số và ít nhất một ký tự đặc biệt (VD: @, #, $...)!'); return;
      }
      if (this.authData.password !== this.authData.confirmPassword) {
        alert('Mật khẩu xác nhận không khớp!'); return;
      }

      this.authService.register({ username: this.authData.username, password: this.authData.password }).subscribe({
        next: (res) => {
     
          alert('Đăng ký thành công! Hãy đăng nhập nhé.');
          this.authMode = 'login';
          this.authData.password = ''; 
          this.authData.confirmPassword = '';
        },
        error: (err) => {
      
          const errorMsg = typeof err.error === 'string' ? err.error : 'Tài khoản đã tồn tại !';
          alert(errorMsg);
        }
      });
    } else {
      const credentials = { username: this.authData.username, password: this.authData.password };
      this.authService.login(credentials).subscribe({
        next: () => this.closeModal(),
        error: () => alert('Sai tài khoản hoặc mật khẩu!')
      });
    }
  }

  logout() {
    const isConfirm = confirm('Bạn có chắc chắn muốn đăng xuất không?');
    if (isConfirm) {
      this.authService.logout();
    }
  }
}