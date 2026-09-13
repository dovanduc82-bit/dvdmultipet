# 🐾 PetNutri - Website Bán Thức Ăn Thú Cưng Thông Minh (Modern Jamstack)

Website bán thức ăn thú cưng hiện đại xây dựng trên nền tảng **Next.js 15, Tailwind CSS, TypeScript** tích hợp:
1. **Cửa hàng Thức ăn & Giỏ hàng**: Phân loại theo loài (chó/mèo), độ tuổi, bệnh lý, thanh toán VietQR & COD.
2. **Cẩm nang Nuôi dưỡng & Gắn Link Sản phẩm (Contextual Commerce)**: Trong mỗi bài viết cẩm nang được nhúng sẵn các thẻ sản phẩm tương thích kèm nút "Mua ngay".
3. **Tương tác Khách hàng & Trợ lý Bác sĩ Thú y AI 24/7**: Chatbot tư vấn dinh dưỡng thông minh (Gemini API) & Công cụ tính calo/khẩu phần ăn hàng ngày.
4. **Hệ thống Tự động Đăng bài theo Giờ (Cron Engine)**: Endpoint `/api/cron/auto-publish` tự động xuất bản bài viết cẩm nang chuẩn SEO và tự quét chèn link sản phẩm theo khung giờ vàng.

---

## 🚀 Cách Chạy Website Trên Máy Tính Của Bạn

1. **Cách 1 (Nhanh nhất)**: 
   * Bấm đúp chuột vào file **`start-web.bat`** trong thư mục này. Trình duyệt sẽ tự động mở trang web tại địa chỉ `http://localhost:3000`.

2. **Cách 2 (Bằng dòng lệnh PowerShell/Terminal)**:
   ```bash
   npm run dev
   ```
   Sau đó mở trình duyệt truy cập: `http://localhost:3000`

---

## ⚙️ Cấu Hình Trí Tuệ Nhân Tạo (Gemini API)

Hệ thống đã có sẵn bộ dữ liệu tri thức thú y dự phòng để hoạt động ngay cả khi chưa có API Key. Khi bạn muốn kết nối trực tiếp với mô hình AI Gemini 2.5 Flash thông minh nhất của Google:
1. Truy cập [Google AI Studio](https://aistudio.google.com/) để lấy API Key miễn phí.
2. Mở file `.env.local` và điền key của bạn:
   ```env
   GEMINI_API_KEY=AIzaSy...
   ```
3. Khởi động lại trang web. Chatbot và hệ thống viết bài sẽ được nâng cấp lên trí tuệ nhân tạo trực tiếp 24/7.

---

## ⏰ Kiểm Tra Cơ Chế Tự Động Đăng Bài Theo Giờ

* Trên giao diện Trang chủ hoặc trang Cẩm nang (`/blog`), có nút: **"⚡ Bấm Thử Nghiệm Tự Động Đăng Bài Mới"**.
* Hoặc bạn có thể gọi trực tiếp endpoint bằng trình duyệt/Postman:
  ```
  http://localhost:3000/api/cron/auto-publish
  ```
* Hệ thống sẽ tự động tạo bài viết mới và chèn ngay các sản phẩm phù hợp vào bài.

---

## 🌐 Triển Khai Miễn Phí Lên Mạng Internet (Vercel)

1. Đưa toàn bộ thư mục này lên GitHub của bạn.
2. Truy cập [Vercel.com](https://vercel.com/) (miễn phí), chọn "Add New Project" và chọn kho GitHub vừa tạo.
3. Bấm **Deploy**. Trong 1 phút, website của bạn sẽ hoạt động trên toàn cầu với tốc độ 100/100 Google PageSpeed!
