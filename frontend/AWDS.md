# Khung Điều hướng Không gian D-Pad (Spatial Navigation)

## Nguyên tắc chung

### 1. Quản lý trạng thái con trỏ tọa độ trừu tượng
Khai báo các biến trạng thái quy chuẩn trong file TypeScript (.ts):

```typescript
type Zone = 'ZONE_FILTERS' | 'ZONE_INPUT' | 'ZONE_MAIN' | 'ZONE_DETAIL';

currentZone: Zone = 'ZONE_FILTERS';
highlightedIndex: number = 0;
private isKeyboardReady = false;
```

### 2. Thiết lập trì hoãn kích hoạt ban đầu (Anti-Spilling Lock)
Trong hàm khởi tạo `ngOnInit()` hoặc `resetKeyboardReady()`:

```typescript
private resetKeyboardReady(): void {
  this.isKeyboardReady = false;
  setTimeout(() => {
    this.isKeyboardReady = true;
  }, 100);
}
```

### 3. Quy tắc phím chặn toàn cục
- **ESC**: Hủy bỏ hoàn toàn chế độ bàn phím, nhả focus khỏi mọi ô input
- Gọi `event.preventDefault()` và `event.stopPropagation()` cho các phím điều hướng

---

## Cấu trúc 4 Zone không gian

| Zone | Vị trí | Mô tả |
|------|---------|--------|
| `ZONE_FILTERS` | Hàng ngang trên cùng | Các tab/category (dùng `.active` để highlight) |
| `ZONE_INPUT` | Ô tìm kiếm | Input text để tìm kiếm dữ liệu |
| `ZONE_MAIN` | Danh sách cuộn bên trái | Danh sách nội dung chính (dùng `.is-keyboard-highlighted`) |
| `ZONE_DETAIL` | Panel bên phải | Khung hiển thị chi tiết nội dung |

---

## Hai Kiểu Highlight Trực Quan

### Kiểu 1: `.active` - Cho Tabs/Category/Danh mục
- **Áp dụng**: Khi người dùng chọn tab, category, hoặc danh mục
- **Mục đích**: Chỉ định vị trí hiện tại trong cấu trúc điều hướng
- **CSS có sẵn**: Dùng class `.active` hoặc biến `--active` đã định nghĩa trong theme

```html
<!-- Tab được chọn -->
<button class="prompts__tab active">Marketing</button>

<!-- Item được active -->
<div class="term-row term-row--active">Thuật ngữ</div>
```

### Kiểu 2: `.is-keyboard-highlighted` - Cho Navigation Keyboard
- **Áp dụng**: Khi đang dùng bàn phím để duyệt (WASD/D-Pad)
- **Mục đích**: Cho biết vị trí con trỏ keyboard đang đứng
- **CSS**: Viền vàng + glow để nổi bật

```css
.is-keyboard-highlighted {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(212, 168, 83, 0.3);
}
```

---

## Bảng quy tắc điều hướng chi tiết

### 1. ZONE_FILTERS - Hàng tab/category
| Phím | Hành động | Highlight |
|------|-----------|-----------|
| `A` hoặc `←` | Di chuyển sang filter trước | `.active` |
| `D` hoặc `→` | Di chuyển sang filter sau | `.active` |
| `W` hoặc `↑` | Lên ZONE_INPUT (tìm kiếm) | - |
| `S` hoặc `↓` | Xuống ZONE_MAIN | - |

### 2. ZONE_INPUT - Ô tìm kiếm
| Phím | Hành động | Highlight |
|------|-----------|-----------|
| Gõ text | Insert vào input bình thường | - |
| `S` hoặc `↓` | Quay về ZONE_FILTERS | - |

### 3. ZONE_MAIN - Danh sách cuộn chính
| Phím | Hành động | Highlight |
|------|-----------|-----------|
| `W` hoặc `↑` | Di chuyển lên item trước | `.is-keyboard-highlighted` |
| `S` hoặc `↓` | Di chuyển xuống item sau | `.is-keyboard-highlighted` |
| `D` hoặc `→` | Vào ZONE_DETAIL | `.is-keyboard-highlighted` |
| `A` hoặc `←` | Quay về ZONE_FILTERS | - |

**Lưu ý**: Khi ở item đầu tiên, ấn `↑` sẽ quay về ZONE_FILTERS

### 4. ZONE_DETAIL - Panel chi tiết
| Phím | Hành động | Highlight |
|------|-----------|-----------|
| `W` hoặc `↑` | Cuộn lên (scrollTop -= 60px) | `.is-keyboard-highlighted` |
| `S` hoặc `↓` | Cuộn xuống (scrollTop += 60px) | `.is-keyboard-highlighted` |
| `A` hoặc `←` hoặc `Backspace` | Quay về ZONE_MAIN | - |

### 5. ESC - Thoát toàn cục
| Phím | Hành động |
|------|-----------|
| `ESC` | Blur toàn bộ, thoát chế độ keyboard |

---

## Code mẫu TypeScript

```typescript
@HostListener('window:keydown', ['$event'])
onKeyDown(event: KeyboardEvent): void {
  if (!this.isKeyboardReady || !this.isFocusLocked || this.isLoading) return;

  const key = event.key.toLowerCase();

  // GLOBAL: ESC - Exit keyboard mode
  if (key === 'escape') {
    event.preventDefault();
    event.stopPropagation();
    (document.activeElement as HTMLElement)?.blur();
    return;
  }

  // ZONE_FILTERS: Category tabs
  if (this.currentZone === 'ZONE_FILTERS') {
    if (key === 'a' || key === 'arrowleft') {
      event.preventDefault();
      event.stopPropagation();
      // ... chuyển filter trước, dùng .active
      return;
    }

    if (key === 'd' || key === 'arrowright') {
      event.preventDefault();
      event.stopPropagation();
      // ... chuyển filter sau, dùng .active
      return;
    }

    if (key === 'w' || key === 'arrowup') {
      event.preventDefault();
      event.stopPropagation();
      this.currentZone = 'ZONE_INPUT';
      // ... focus input
      return;
    }

    if (key === 's' || key === 'arrowdown') {
      event.preventDefault();
      event.stopPropagation();
      this.highlightedIndex = 0;
      this.currentZone = 'ZONE_MAIN';
      // ... scroll vào view
      return;
    }
    return;
  }

  // ZONE_MAIN: Main list - dùng .is-keyboard-highlighted
  if (this.currentZone === 'ZONE_MAIN') {
    if (key === 'w' || key === 'arrowup') {
      event.preventDefault();
      event.stopPropagation();
      if (this.highlightedIndex === 0) {
        this.currentZone = 'ZONE_FILTERS';
      } else {
        this.highlightedIndex--;
        this.selectItem(this.items[this.highlightedIndex]);
        this.scrollActiveItemIntoView();
      }
      return;
    }

    if (key === 's' || key === 'arrowdown') {
      event.preventDefault();
      event.stopPropagation();
      if (this.highlightedIndex < this.items.length - 1) {
        this.highlightedIndex++;
        this.selectItem(this.items[this.highlightedIndex]);
        this.scrollActiveItemIntoView();
      }
      return;
    }

    if (key === 'd' || key === 'arrowright') {
      event.preventDefault();
      event.stopPropagation();
      this.currentZone = 'ZONE_DETAIL';
      // ... focus detail pane
      return;
    }

    if (key === 'a' || key === 'arrowleft') {
      event.preventDefault();
      event.stopPropagation();
      this.currentZone = 'ZONE_FILTERS';
      return;
    }
    return;
  }
}
```

---

## Ràng buộc hiển thị viền trực quan trên HTML

### Quy tắc:
1. **Tabs/Category**: Dùng `[class.active]` - viền đen (CSS có sẵn)
2. **List items/Cards**: Dùng `[class.is-keyboard-highlighted]` - viền vàng

### Ví dụ HTML:

```html
<!-- ZONE_FILTERS: Dùng .active cho tab được chọn -->
<button
  *ngFor="let cat of categories; let i = index"
  class="prompts__tab"
  [class.active]="cat.id === activeCategoryId">
  {{ cat.name }}
</button>

<!-- ZONE_INPUT: Không cần highlight đặc biệt -->
<input
  id="search-input"
  class="search-box__input"
  [class.is-keyboard-highlighted]="isFocusLocked && currentZone === 'ZONE_INPUT'">

<!-- ZONE_MAIN: Dùng .is-keyboard-highlighted cho item được chọn -->
<button
  *ngFor="let item of items; let i = index"
  class="term-row"
  [class.is-keyboard-highlighted]="isFocusLocked && currentZone === 'ZONE_MAIN' && highlightedIndex === i">
  {{ item.name }}
</button>

<!-- ZONE_DETAIL -->
<main
  id="detail-pane"
  [class.is-keyboard-highlighted]="isFocusLocked && currentZone === 'ZONE_DETAIL'"
  tabindex="-1">
</main>
```

---

## CSS cho Keyboard Highlight

Thêm vào file CSS của component:

```css
/* Chỉ áp dụng cho ZONE_MAIN items */
.is-keyboard-highlighted {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(212, 168, 83, 0.3);
}
```

---

## Navigation Banner cho người dùng

```html
<div *ngIf="isFocusLocked" class="nav-status-banner" role="status">
  <span *ngIf="currentZone === 'ZONE_FILTERS'">
    <span class="keycap">←</span> <span class="keycap">→</span> chuyển danh mục &bull;
    <span class="keycap">↓</span> xuống danh sách &bull;
    <span class="keycap">ESC</span> thoát
  </span>
  <span *ngIf="currentZone === 'ZONE_MAIN'">
    <span class="keycap">↑</span> <span class="keycap">↓</span> chọn &bull;
    <span class="keycap">→</span> xem chi tiết &bull;
    <span class="keycap">ESC</span> thoát
  </span>
  <span *ngIf="currentZone === 'ZONE_DETAIL'">
    <span class="keycap">↑</span> <span class="keycap">↓</span> cuộn &bull;
    <span class="keycap">←</span> quay lại &bull;
    <span class="keycap">ESC</span> thoát
  </span>
</div>
```

---

## Lưu ý quan trọng

1. **Instant Trigger**: Khi di chuyển highlight đến item nào, cần gọi ngay hàm xử lý tương ứng mà không cần nhấn Enter

2. **Auto-scroll**: Khi duyệt danh sách dài, gọi `scrollIntoView()` để danh sách tự cuộn theo con trỏ

3. **Boundary Check**: Luôn kiểm tra biên của mảng trước khi tăng/giảm highlightedIndex

4. **Focus Management**: Dùng `setTimeout` với 0ms để đảm bảo focus được apply sau khi zone thay đổi

5. **Hai kiểu highlight**:
   - `.active`: Cho tabs/category - viền đen (CSS có sẵn)
   - `.is-keyboard-highlighted`: Cho list items/cards - viền vàng (thêm CSS)
