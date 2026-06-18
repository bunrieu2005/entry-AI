import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://3.90.5.210:8080/api';
  constructor(private http: HttpClient) {}

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/categories`);
  }

  getPromptsByCategory(categoryId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/prompts/category/${categoryId}`);
  }

  getToolsByCategory(categoryId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/ai-tools/category/${categoryId}`);
  }
}