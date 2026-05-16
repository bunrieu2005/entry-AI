import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent {
  searchQuery: string = '';

  @Output() search = new EventEmitter<string>();

  onSearchInput(): void {
    this.search.emit(this.searchQuery);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.search.emit('');
  }
}
