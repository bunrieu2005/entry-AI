import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthModalService {
  private showSubject = new BehaviorSubject<boolean>(false);
  readonly show$ = this.showSubject.asObservable();

  open(mode: 'login' | 'register' = 'login'): void {
    this.showSubject.next(true);
  }

  close(): void {
    this.showSubject.next(false);
  }
}
