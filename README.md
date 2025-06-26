# booking-movie
Chia 2 nhánh FE và BE
Tài khoản Admin:
Username: admin
password: admin123
////////////////
# Booking Movie - Giới thiệu Đồ Án

## 1. Mục tiêu dự án
Booking Movie là hệ thống đặt vé xem phim trực tuyến, giúp người dùng dễ dàng tìm kiếm phim, chọn suất chiếu, đặt vé và quản lý thông tin cá nhân một cách tiện lợi, nhanh chóng và an toàn.

## 2. Ý nghĩa và giá trị thực tiễn
- Đáp ứng nhu cầu đặt vé xem phim online ngày càng phổ biến.
- Tiết kiệm thời gian, giảm thiểu rủi ro hết vé khi đến rạp.
- Tăng trải nghiệm người dùng với giao diện hiện đại, thân thiện.
- Hỗ trợ quản lý rạp, phim, lịch chiếu hiệu quả cho nhà quản trị.

## 3. Chức năng chính
- Đăng ký, đăng nhập, quản lý tài khoản người dùng.
- Xem danh sách phim, chi tiết phim, lịch chiếu, rạp chiếu.
- Đặt vé: chọn suất chiếu, chọn ghế, xác nhận đặt vé.
- Quản lý thông tin cá nhân, xem lịch sử đặt vé.
- (Admin) Quản lý phim, rạp, suất chiếu (CRUD), phân quyền người dùng.

## 4. Công nghệ sử dụng
- **Backend:** Node.js, Express, MongoDB, JWT, RESTful API, bảo mật, phân quyền.
- **Frontend:** ReactJS, Vite, TailwindCSS, React Router, Context API.
- **Triển khai:** Vercel, Netlify, MongoDB Atlas.

## 5. Đối tượng sử dụng
- Người dùng có nhu cầu đặt vé xem phim online.
- Quản trị viên hệ thống rạp phim.
- Các nhóm sinh viên, lập trình viên học tập và nghiên cứu về xây dựng hệ thống web thực tế.

---
**Booking Movie** hướng tới việc mang lại trải nghiệm đặt vé xem phim hiện đại, tiện lợi, an toàn và dễ mở rộng cho cả người dùng lẫn nhà quản trị. 
HƯỚNG DẪN DEPLOY DỰ ÁN (BE)
B1: Tạo tài khoảng render
B2: Chọn new tren navbar chọn Web Service
B3:Chọn Repo cần deploy
B4: Branch -> Nhánh cần deploy
B5: Build Command -> npm run build
B6: Start Command -> npm run dev
B7: chọn deploy Web service

Kết Quả 
- Giao diện trang đăng nhập :
  ![Logo](https://github.com/ngh-duy/booking-movie/blob/master/public/dangnhap.png)
- Giao diện đăng ký:
 ![Logo](https://github.com/ngh-duy/booking-movie/blob/master/public/dangky.png)
- Giao diện các vé đã đặt:
  ![Logo](https://github.com/ngh-duy/booking-movie/blob/master/public/GiaoDienCacVeDaDat.png)
- Giao diện đặt vé:
  ![Logo](https://github.com/ngh-duy/booking-movie/blob/master/public/GiaoDienDatVe.png)
- Giao diện quản lý người dùng:
  ![Logo](https://github.com/ngh-duy/booking-movie/blob/master/public/GiaoDienQuanLyNguoiDUng.png)
- Giao diện tìm xuất chiếu:
  ![Logo](https://github.com/ngh-duy/booking-movie/blob/master/public/GiaDientimXuatChieu.png)
- Giao diện tạo rạp film:
  ![Logo](https://github.com/ngh-duy/booking-movie/blob/master/public/giaodienTaoRapPhim.png)
- Giao diện thêm film mới:
  ![Logo](https://github.com/ngh-duy/booking-movie/blob/master/public/themFilmMoi.png)

HƯỚNG DẪN CÀI ĐẶT DỰ ÁN:
*** BE
B1: Clone project bằng câu lệnh git clone --branch BE --single-branch https://github.com/ngh-duy/booking-movie.git (Git bash)
B2: Mở project bằng visual và chạy terminal lệnh npm i để tải thư viện cần thiết về.
B3: Chạy project bằng lệnh npm run dev.
*** FE
B1:Clone project bằng câu lệnh git clone --branch FE --single-branch https://github.com/ngh-duy/booking-movie.git (Git bash)
B2: Mở project bằng visual và chạy terminal lệnh npm i để tải thư viện cần thiết về.
B3: Chạy project bằng lệnh npm start nên run project.
