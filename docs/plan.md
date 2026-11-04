# Kế hoạch blog Quản trị & Lãnh đạo

Dựa trên tài liệu yêu cầu v1.0 (`temp/require.docx`, không đưa vào git).

## Quyết định hiện tại

| Hạng mục | Quyết định |
|---|---|
| Công nghệ | Trang tĩnh Astro, Sveltia CMS, Cloudflare Pages |
| Repo | Tạm giữ public ở `happier-solutions/tmdn`. Bản nháp lưu trong repo nên ai cũng đọc được trên GitHub, cần ẩn danh trước khi lưu |
| Đăng nhập CMS | Tạm giữ fine-grained PAT, chưa chuyển sang OAuth |
| Tên miền | Tạm dùng `tmdn.pages.dev`, chuyển sang .com khi chủ blog chốt tên miền |
| Bình luận và góp ý qua email | Chưa làm |
| Tên blog | Tạm giữ "Tư Mã Đại Nhân", chưa đổi sang "Nhật ký Tư Mã Ca" |

Phần còn mở: tài liệu vừa ghi ngân sách 0đ vừa ghi "unlimited".

## Menu

- **Header:** tên blog | Quan sát · Câu hỏi · Nghiên cứu · Bài học · Nhật ký học tập | Giới thiệu
- **Điện thoại (dưới 960px):** tên blog và nút Menu, bấm vào mở ngăn kéo bên phải.
- **Footer:** Tất cả bài viết · Chủ đề · Liên hệ · Quy tắc ẩn danh · RSS
- **Trang chủ:** blog là gì và dành cho ai → Hành trình học (5 chuyên mục) → Bài mới nhất

## URL

| Trang | URL |
|---|---|
| Tất cả bài | `/bai-viet/`, `/bai-viet/2/` |
| Chuyên mục | `/quan-sat/`, `/cau-hoi/`, `/nghien-cuu/`, `/bai-hoc/`, `/nhat-ky-hoc-tap/` (trang sau: `/quan-sat/2/`) |
| Bài viết | `/quan-sat/ten-bai/` |
| Thẻ chủ đề | `/chu-de/`, `/chu-de/ra-quyet-dinh/` |
| Trang tĩnh | `/gioi-thieu/`, `/lien-he/`, `/quy-tac-an-danh/` |
| Khác | `/rss.xml`, `/sitemap-index.xml`, `/robots.txt`, `/admin/` |

## Thư mục

```
src/
├─ content.config.ts       # collections: posts, pages
├─ data/taxonomy.ts        # 5 chuyên mục, 6 thẻ, 3 mức độ chắc chắn
├─ lib/posts.ts            # lọc nháp, URL bài, bài liên quan, thời gian đọc
├─ content/
│  ├─ posts/<slug>/        # index.md và ảnh của bài
│  └─ pages/               # gioi-thieu.md, lien-he.md, quy-tac-an-danh.md
├─ layouts/                # BaseLayout, PageLayout, ListLayout, PostLayout
├─ components/             # Header, Footer, BaseHead, FormattedDate, PostCard, PostMeta,
│                          # UpdateNote, RelatedPosts, PrevNext, Pagination
└─ pages/
   ├─ index.astro, gioi-thieu.astro, lien-he.astro, quy-tac-an-danh.astro
   ├─ bai-viet/[...page].astro
   ├─ [category]/[...page].astro
   ├─ [category]/[slug].astro
   ├─ chu-de/index.astro
   ├─ chu-de/[tag]/[...page].astro
   └─ rss.xml.js, robots.txt.ts
public/admin/config.yml    # phải khớp với src/data/taxonomy.ts
```

Chuyên mục là một field trong frontmatter, không phải thư mục. Đổi chuyên mục của bài đã đăng sẽ đổi URL, nên khi đó cần thêm redirect.

## Frontmatter của bài

| Field | Bắt buộc | Ghi chú |
|---|---|---|
| `title`, `description`, `pubDate` | Có | |
| `category` | Có | Một trong 5 chuyên mục |
| `confidence` | Có | Quan sát ban đầu / Đã tìm hiểu thêm / Đã kiểm chứng |
| `tags` | Không | Thẻ chủ đề, chọn nhiều |
| `draft` | Không | `true` thì bài không ra trang, RSS và sitemap. CMS mặc định bật |
| `updatedDate`, `changedMindNote` | Không | Hiện ghi chú "Tôi đã đổi quan điểm" |
| `heroImage` | Không | Ảnh đầu bài và ảnh khi chia sẻ |

## Bài mẫu

Mọi bài dưới đây đều là nội dung giả để dựng khung, cần thay trước khi ra mắt.

| Bài | Chuyên mục | Kiểm tra |
|---|---|---|
| `mot-cuoc-hop-30-phut` | Quan sát | Quan sát ban đầu, bài liên quan |
| `giao-viec-xong-hoi-lai-dieu-gi` | Quan sát | Chuyên mục có nhiều bài |
| `vi-sao-quyet-dinh-dung-van-bi-phan-doi` | Câu hỏi | Danh sách trong bài |
| `tim-hieu-okr-va-sme` | Nghiên cứu | Đã tìm hiểu thêm, tiêu đề phụ |
| `5-dieu-quan-ly-tre-can-biet` | Bài học | Đã kiểm chứng, danh sách đánh số |
| `thang-nay-toi-da-sai-o-dau` | Nhật ký học tập | Ngày cập nhật, "Tôi đã đổi quan điểm" |
| `chao-mung` | Nhật ký học tập | Ảnh đại diện |
| `nhap-chua-an-danh` | Câu hỏi | Bản nháp, không được xuất hiện |

## Việc còn lại

**P1, cần có để nghiệm thu**

- [ ] Làm giao diện theo mục 7 của tài liệu, tham khảo fs.blog (khung hiện mới là bản cơ bản)
- [ ] Thay nội dung Giới thiệu, Liên hệ (còn thiếu email), Quy tắc ẩn danh và các bài mẫu
- [ ] Đo Lighthouse di động (từ 80) và thời gian tải trên 4G
- [ ] Kiểm tra trên iPhone, Android, Chrome và Safari
- [ ] Thử đăng bài trên CMS với các field mới: tạo, sửa, nháp, xuất bản, xóa
- [ ] Viết hướng dẫn đăng bài và sao lưu (tối đa 2 trang), hướng dẫn chủ blog đăng thử
- [ ] Bàn giao quyền tài khoản cho chủ blog

**P2, làm nếu kịp**

- [ ] Tìm kiếm (Pagefind)
- [ ] Bình luận (Giscus) và góp ý qua email
- [ ] Đăng ký nhận bài
- [ ] Chia sẻ mạng xã hội
- [ ] Hẹn giờ đăng
- [ ] Thống kê truy cập, Google Search Console

**P3:** chế độ tối.
