# Kế hoạch Trúc Chí Lập Thân

Dựa trên hai tài liệu (không đưa vào git): "Cấu trúc nội dung website – Trúc Chí Lập Thân" và "Website redesign brief – Tư Mã Đại Nhân" (tháng 11/2026). Bản trước dựa trên tài liệu yêu cầu v1.0 với 5 chuyên mục (Quan sát, Câu hỏi, Nghiên cứu, Bài học, Nhật ký học tập), đã thay bằng cấu trúc dưới đây.

## Quyết định hiện tại

| Hạng mục | Quyết định |
|---|---|
| Công nghệ | Giữ Astro tĩnh, Sveltia CMS, Cloudflare Pages. Brief không có lý do kỹ thuật để đổi stack |
| Thương hiệu | Bút danh Tư Mã Đại Nhân, tên trang Trúc Chí Lập Thân. Tagline "Tu thân – Dưỡng chí – Lập nghiệp." |
| Phân loại | 2 chuyên mục lớn, 17 chủ đề con, từ khóa. Mỗi bài thuộc đúng một chủ đề; chuyên mục suy ra từ chủ đề |
| Sửa phân loại | Trong CMS, mục "Phân loại" (`src/data/taxonomy.json`): thêm, sửa, xóa, kéo sắp xếp chủ đề và từ khóa, không cần sửa code |
| Bài mẫu cũ | Đã xóa 20 bài mẫu (nội dung giả). Bài thật đầu tiên: "Đứng gần một CEO…" |
| URL cũ | Redirect 301 trong `public/_redirects` (5 chuyên mục cũ, `/chu-de/` cũ) |
| Repo | Tạm giữ public ở `happier-solutions/tmdn`. Bản nháp lưu trong repo nên ai cũng đọc được trên GitHub, cần ẩn danh trước khi lưu |
| Đăng nhập CMS | Tạm giữ fine-grained PAT, chưa chuyển sang OAuth |
| Tên miền | Tạm dùng `tmdn.pages.dev` |

## Menu

- **Header:** wordmark Tư Mã Đại Nhân / Trúc Chí Lập Thân | Trang chủ · Tàng Thư Quán Thế · Binh Pháp Công Sở · Giới thiệu. Chủ đề con không lên menu.
- **Điện thoại (dưới 960px):** wordmark và nút Menu, bấm vào mở ngăn kéo bên phải.
- **Khối đăng ký nhận bài:** ngay trên footer.
- **Footer:** thương hiệu · chủ đề của từng chuyên mục · Về trang (Giới thiệu, Tất cả bài viết, Từ khóa, Liên hệ, Quy tắc ẩn danh, RSS).
- **Trang chủ:** tuyên ngôn → bài nổi bật → bài mới → hai chuyên mục → bài chọn lọc → lời người viết → đăng ký.

## URL

| Trang | URL |
|---|---|
| Chuyên mục lớn | `/tang-thu-quan-the/`, `/binh-phap-cong-so/` |
| Chủ đề con | `/binh-phap-cong-so/chu-de/quan-tri-to-chuc/` (trang sau: `…/2/`) |
| Bài viết | `/binh-phap-cong-so/ten-bai/` |
| Tất cả bài | `/bai-viet/`, `/bai-viet/2/` |
| Từ khóa | `/tu-khoa/`, `/tu-khoa/xay-dung-to-chuc/` |
| Trang tĩnh | `/gioi-thieu/`, `/lien-he/`, `/quy-tac-an-danh/` |
| Khác | `/rss.xml`, `/sitemap-index.xml`, `/robots.txt`, `/llms.txt`, `/admin/` |

Chủ đề nằm dưới `/chu-de/` của chuyên mục, nên tên bài không bao giờ trùng với tên chủ đề. Đổi chủ đề trong cùng chuyên mục không đổi URL bài; chuyển bài sang chuyên mục kia thì URL đổi, khi đó thêm dòng vào `public/_redirects`.

## Thư mục

```
src/
├─ content.config.ts       # collections: posts, pages
├─ data/taxonomy.json      # chuyên mục, chủ đề, từ khóa (CMS sửa được)
├─ data/taxonomy.ts        # kiểm tra taxonomy.json khi build, helper URL
├─ lib/posts.ts            # lọc nháp, URL bài, chuyên mục của bài, bài liên quan, thời gian đọc
├─ assets/pillars/         # ảnh chủ đạo của hai chuyên mục (<slug>.jpg, 4:5)
├─ content/posts/<slug>/   # index.md và ảnh của bài
├─ content/pages/          # gioi-thieu.md, lien-he.md, quy-tac-an-danh.md
├─ layouts/                # BaseLayout, PageLayout, ListLayout, PostLayout
├─ components/
└─ pages/
   ├─ index.astro, gioi-thieu.astro, lien-he.astro, quy-tac-an-danh.astro, 404.astro
   ├─ [pillar]/index.astro               # trang chuyên mục, có tìm kiếm và lọc
   ├─ [pillar]/[slug].astro              # bài viết
   ├─ [pillar]/chu-de/[topic]/[...page].astro
   ├─ bai-viet/[...page].astro
   ├─ tu-khoa/index.astro, tu-khoa/[tag]/[...page].astro
   └─ rss.xml.js, robots.txt.ts, llms.txt.ts
public/admin/config.yml    # CMS: bài viết, trang, phân loại
public/_redirects          # redirect 301 của Cloudflare Pages
```

## Frontmatter của bài

| Field | Bắt buộc | Ghi chú |
|---|---|---|
| `title`, `description`, `pubDate` | Có | `description` là sapo dưới tiêu đề |
| `topic` | Có | Slug một chủ đề trong `taxonomy.json`; chuyên mục lớn suy ra từ đây |
| `tags` | Không | Từ khóa, chọn nhiều |
| `featured` | Không | Bài nổi bật mới nhất dẫn đầu trang chủ và trang chuyên mục; các bài nổi bật khác vào "Bài chọn lọc" |
| `references` | Không | Danh sách `{ title, url? }`, hiện ở cuối bài và trong JSON-LD |
| `heroImage`, `heroAlt`, `heroCredit` | Không | Ảnh đầu bài (2:1), mô tả ảnh, chú thích |
| `draft` | Không | `true` thì bài không ra trang, RSS và sitemap. CMS mặc định bật |
| `confidence` | Không | Quan sát ban đầu / Đã tìm hiểu thêm / Đã kiểm chứng |
| `updatedDate`, `changedMindNote` | Không | Hiện ghi chú "Tôi đã đổi quan điểm" |

## SEO

Title, meta description, canonical, Open Graph (ảnh lớn khi bài có ảnh, `article:published_time`), JSON-LD `BlogPosting` cho bài và `WebSite` cho trang chủ, sitemap, RSS, `llms.txt`. Ảnh xuất AVIF và WebP, ảnh dưới màn hình đầu lazy load.

## Việc còn lại

- [ ] Rà lại ẩn danh bài "Đứng gần một CEO…": bài đăng nguyên văn theo yêu cầu, còn chi tiết dễ nhận ra (công ty khoảng một năm tuổi, tập đoàn đầu tư hàng chục triệu USD, CEO mười năm ở nước ngoài, người viết là trợ lý)
- [ ] Viết lại logo, favicon và ảnh Open Graph mặc định theo bảng màu mới
- [ ] Điền email liên hệ thật (`/lien-he/`, `CONTACT_EMAIL`)
- [ ] Thử CMS: tạo bài với chủ đề và từ khóa, thêm/sắp xếp chủ đề trong "Phân loại"
- [ ] Đo Lighthouse di động và kiểm tra trên iPhone, Android, Chrome, Safari
- [ ] Tìm kiếm toàn trang (Pagefind) khi số bài đủ lớn
- [ ] Đăng ký nhận bài: chọn dịch vụ gửi thư
- [ ] Thống kê truy cập, Google Search Console
