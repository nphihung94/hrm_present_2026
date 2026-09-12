# Kịch bản thuyết trình HRM + AI (~10 phút)

Mở file `hrm-suite-presentation.html` bằng trình duyệt (double-click). Điều khiển: `→`/`Space` tiến, `←` lùi, click vào ảnh để phóng to, `Esc` đóng.

---

## Slide 1 — Mở đầu (0:00–1:00)
- Câu mở: *"Một nhân viên đi qua công ty theo một hành trình: có một chiếc ghế chờ họ trong sơ đồ tổ chức, một bộ hồ sơ, một lộ trình phát triển, những ca làm việc, và đồng lương cuối tháng."*
- Giới thiệu 5 app theo strip: Workforce → HRIS → Career → Timesheets → Payrolls.
- Chốt: điểm khác biệt là **một lớp AI copilot xuyên suốt cả hành trình** — và mọi màn hình sắp xem đều là sản phẩm đang chạy thật.

## Slide 2 — Nhân sự AI trong sơ đồ tổ chức (1:00–2:15)
- Nhấn: sơ đồ xây trên **vị trí (seat)** chứ không phải tên người → luôn trả lời được "còn ghế nào trống, ai kế nhiệm, span-of-control bao nhiêu".
- Mỗi ghế gắn 1 **hồ sơ công việc** (JD chuẩn) — ảnh dưới cho thấy 4 seat của Senior SWE: 1 đã lấp, 3 đang mở.
- Ý tưởng đinh: vì tổ chức mô hình hoá theo ghế + JD, việc thêm loại lao động **"AI agent"** chỉ là thêm một employment type — AI đứng trong sơ đồ, có JD, có quản lý, có KPI. (Đây là tầm nhìn/roadmap, khung dữ liệu đã sẵn.)

## Slide 3 — Career Track với AI (2:15–3:30)
- Track Engineering: 11 vai trò, 15 bước chuyển, tách nhánh IC / quản lý; mỗi bước chuyển gắn năng lực yêu cầu.
- AI làm 2 việc: (1) **dựng cả track từ một câu mô tả** — sinh vai trò/bước chuyển/năng lực, khớp danh mục công ty, chờ admin xác nhận; (2) **trả lời nhân viên** "từ vị trí của tôi đi tiếp được đâu, còn thiếu năng lực gì" — lấy đúng từ đồ thị.

## Slide 4 — Thăng chức với đề xuất AI (3:30–4:45)
- Trang chính sách: tỷ lệ duyệt, mức tăng lương trung bình +17.8%, tác động quỹ lương $50K — nói chuyện thăng chức bằng dữ liệu.
- Form đề xuất: trái là câu chuyện, phải là bảng lương Từ→Đến từng khoản.
- AI **soạn nháp đề xuất** (xác định nhân viên + chính sách, điền sẵn tóm tắt thành tích) — nhưng người quản lý đọc lại và tự bấm gửi. Luồng duyệt cấu hình theo chính sách, có SLA 3 ngày.

## Slide 5 — Đảm bảo quân số / nghỉ phép với copilot (4:45–6:00)
- Thông điệp: *"duyệt một đơn nghỉ phép thực chất là một quyết định về độ phủ ca"*.
- Lịch coverage đếm từng chỗ trống (demo: 990 gaps); nút **Lấp chỗ trống** chạy engine 3 lượt, có chế độ ghi đè / chỉ thêm mới.
- Nghỉ phép: sổ cái số dư (append-only), luồng duyệt có uỷ quyền; duyệt xong ngày nghỉ tự đổ vào bảng công.
- Copilot: cảnh báo thiếu ca, gợi ý ai nhận ca trống, soạn chính sách nghỉ phép từ file quy chế — mọi thay đổi qua thẻ xác nhận.

## Slide 6 — Ba ca bốn kíp (6:00–7:15)
- Thư viện 8 mẫu xoay ca Việt Nam dựng sẵn; mở chi tiết **VN Manufacturing 3-Shift**: sáng/chiều/đêm × T2–T7, 3 kíp xoay tuần, chu kỳ 4 tuần.
- Ràng buộc cứng: nghỉ tối thiểu 11h sau ca đêm, tối đa 6 ngày liên tục, 1 ngày nghỉ/tuần — engine không bao giờ xếp phạm luật.
- "Bốn kíp": kíp = nhóm trong mẫu, số nhóm không giới hạn → dựng 3 ca 4 kíp chạy 24/7 bằng trình soạn mẫu rồi áp cho từng xưởng.

## Slide 7 — Trợ lý công lương 24/7 (7:15–8:30)
- Đây là slide "wow": copilot mở ngay cạnh bảng lương, lệnh sẵn **Explain a number / Scan for anomalies / Brief me on this run**.
- Điểm kỹ thuật đáng nói nhất: giải trình là **tất định** — hệ thống phân tích đúng công thức thật (`=salary+allowance+kpi_bonus+meal_allowance`), truy từng biến về snapshot dữ liệu đã đóng băng của kỳ lương, đối chiếu khớp rồi AI mới "kể lại bằng lời". Không có chuyện AI bịa số lương.
- Nhân viên tự xem phiếu lương, xác nhận hoặc khiếu nại đúng dòng — giảm hẳn tải hỏi–đáp cho HR.

## Slide 8 — Tính lương từ nhiều nguồn (8:30–9:30)
- Trang Sources: HRIS (hồ sơ, hợp đồng, mã thuế, ngân hàng), Timesheets (ngày công, phép), Overtime, Schedule — mỗi biến công thức chỉ về đúng một nguồn, **không nhập tay lại**.
- Kỳ lương demo: 20 nhân viên, đủ thuế TNCN + BHXH, stepper Prepare→Review→Approval, cảnh báo "AI Review: 20 anomalies".
- Engine: công thức kiểu Excel biên dịch thành DAG, 2.000 nhân viên × 100 công thức < 30 giây; snapshot đóng băng nên chạy lại luôn ra cùng kết quả.

## Slide 9 — Một trợ lý, cả vòng đời (9:30–10:00)
- HRIS assistant: headcount, tra hợp đồng, yêu cầu thay đổi hồ sơ, import hàng loạt — cùng một trải nghiệm copilot ở cả 5 app.
- Kiến trúc an toàn (nói chậm, đây là câu trả lời cho lo ngại của khách): **AI đọc tự do, ghi phải qua thẻ xác nhận** — hệ thống thực thi dưới quyền + audit log của người bấm, AI không có quyền ghi trực tiếp.
- Key AI theo tenant (Claude/GPT/Gemini), mã hoá; tháo key là copilot tắt toàn bộ.

## Slide 10 — Kết + Q&A (10:00)
- Đọc nhanh 6 gạch recap, chốt bằng "Bước tiếp theo: nhân sự AI đứng trong sơ đồ tổ chức".
- Mời câu hỏi.

---

### Ghi chú demo
- App đang chạy local: HRIS :3801, Payrolls :4203, Timesheets :4301, Career :4858, Workforce :8900 (đăng nhập eric@rework.com).
- Nếu muốn demo live thay vì ảnh: đường dẫn ấn tượng nhất là Payrolls → kỳ lương "Vietnam Payroll — June 2026" → bấm nút AI → Explain a number; và Career → Tracks → Engineering.
- Slide 2 (nhân sự AI trong sơ đồ) là **tầm nhìn** — Workforce hiện chưa có employment type "AI agent"; đừng hứa là tính năng đã ship.
- Slide 6: mẫu dựng sẵn là 3 ca 3 kíp; mô hình 4 kíp dựng được bằng trình soạn mẫu (nhóm tuỳ biến) nhưng chưa có preset một-chạm.
