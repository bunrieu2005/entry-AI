import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private readonly API_URL = 'http://3.90.5.210:8080/api';

  private favoriteIdsSubject = new BehaviorSubject<Set<number>>(new Set());
  readonly favoriteIds$ = this.favoriteIdsSubject.asObservable();

  constructor(private injector: Injector) {}

  private get authService(): AuthService {
    return this.injector.get(AuthService);
  }

  loadFavorites(): void {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.favoriteIdsSubject.next(new Set());
      return;
    }
    this.injector.get(HttpClient)
      .get<any[]>(`${this.API_URL}/favorites/${userId}`)
      .subscribe({
        next: (prompts) => {
          const ids = new Set(prompts.map((p: any) => p.id));
          this.favoriteIdsSubject.next(ids);
        },
        error: () => this.favoriteIdsSubject.next(new Set()),
      });
  }

  toggleFavorite(promptId: number): Observable<boolean> {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      return new Observable((observer) => observer.error({ status: 401 }));
    }
    return this.injector
      .get(HttpClient)
      .post<boolean>(`${this.API_URL}/favorites/${userId}/${promptId}`, {})
      .pipe(
        tap((isFavorited: boolean) => {
          const current = new Set(this.favoriteIdsSubject.value);
          if (isFavorited) {
            current.add(promptId);
          } else {
            current.delete(promptId);
          }
          this.favoriteIdsSubject.next(current);
        })
      );
  }

  isFavorited(promptId: number): boolean {
    return this.favoriteIdsSubject.value.has(promptId);
  }
}
