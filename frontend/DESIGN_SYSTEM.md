# Kraft Paper Design System - Accessible Prompt Library

Hệ thống thiết kế tập trung vào sự tối giản, độ tương phản cao và cảm giác thủ công (handmade), được tối ưu hóa đặc biệt cho người hạn chế vận động tay theo tiêu chuẩn WCAG 2.2.

## 1. Triết lý thiết kế (Overview)
- **Phong cách:** Giấy Kraft nâu, mực in con dấu, thô mộc.
- **Nguyên tắc:** Phẳng (Flat), không sử dụng gradient, tận dụng khoảng trắng (negative space) để làm nổi bật nội dung.
- **Mục tiêu:** Giảm thiểu nỗ lực vận động và tăng khả năng nhận biết thị giác.

## 2. Bảng màu (Color Palette)
Hệ thống sử dụng các màu trung tính có độ tương phản cao và một màu nhấn duy nhất để thúc đẩy tương tác.

- **Primary (#251812):** Headlines và văn bản cốt lõi. Đảm bảo độ rõ nét tối đa.
- **Secondary (#8B6E52):** Viền, chú thích và siêu dữ liệu (metadata).
- **Tertiary (#B83B2E - Stamp Red):** Màu nhấn duy nhất cho tương tác (nút Sao chép). Chỉ sử dụng cho một hành động chính trên màn hình.
- **Neutral (#E6D6B8):** Nền tảng trang (background).
- **Surface (#F1E3C6):** Nền của các thẻ prompt (card).
- **On-Primary (#F1E3C6):** Màu chữ trên nền Tertiary.

## 3. Hệ thống Typo (Typography)
- **Display (4rem, Bold 800):** Archivo. Dùng cho các tiêu đề cực lớn.
- **H1 (2.25rem, Bold 800):** Archivo. Dùng cho tiêu đề trang.
- **Body (1rem, Line-height 1.6):** Inter. Dành cho nội dung prompt. Khoảng cách dòng 1.6 giúp tăng khả năng đọc (WCAG 1.4.8).
- **Label (0.72rem, Mono):** JetBrains Mono. Dùng cho các thẻ phân loại (tags).

## 4. Tiêu chuẩn tiếp cận (Accessibility Constraints)
Dựa trên tiêu chuẩn WCAG 2.2, các thành phần phải tuân thủ nghiêm ngặt các chỉ số sau:

### Kích thước mục tiêu (Target Size)
- **Nút tương tác:** Phải có diện tích tối thiểu **44x44 pixel CSS** để người bị run tay hoặc hạn chế vận động tinh dễ dàng nhấp trúng (WCAG 2.5.5 - AAA).
- **Khoảng cách:** Các mục tiêu tương tác phải có khoảng cách an toàn, không nằm quá sát nhau để tránh bấm nhầm.

### Tương phản màu sắc (Contrast)
- **Văn bản:** Tỷ lệ tương phản giữa chữ (Primary) và nền (Surface) đạt mức **13.8:1**, vượt xa mức tối thiểu 4.5:1 (WCAG 1.4.3 - AA).
- **Thành phần UI:** Các đường viền input và nút phải có độ tương phản ít nhất 3:1 so với nền (WCAG 1.4.11 - AA).

### Vận hành con trỏ và Bàn phím
- **Hủy con trỏ (Pointer Cancellation):** Mọi hành động kích hoạt prompt phải xảy ra ở sự kiện **pointerup** (nhả nút). Người dùng có thể hủy lệnh bằng cách kéo con trỏ ra khỏi nút trước khi nhả tay (WCAG 2.5.2 - A).
- **Chỉ báo tiêu điểm (Focus Indicator):** Khi nhận tiêu điểm bàn phím, phần tử phải hiện đường viền đậm (3px) màu Primary. Tỷ lệ tương phản vùng tiêu điểm đạt ít nhất 3:1 (WCAG 2.4.13 - AAA).

## 5. Quy tắc Thành phần (Components)

### Nút bấm (Button Primary)
- **Màu sắc:** Nền Tertiary (#B83B2E), Chữ On-Primary (#F1E3C6).
- **Bo góc:** 4px (md).
- **Padding:** 12px 20px (Đảm bảo tổng kích thước không dưới 44px).

### Thẻ nội dung (Prompt Card)
- **Màu sắc:** Nền Surface (#F1E3C6), Chữ Primary (#251812).
- **Bo góc:** 8px (lg).
- **Padding:** 24px.

---
*Tài liệu này là kim chỉ nam cho việc phát triển giao diện Thư viện Prompt AI hòa nhập.*