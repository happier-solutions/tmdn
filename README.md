# tmdn

Blog dùng Astro 7 và Sveltia CMS, chạy tại <https://tmdn.pages.dev>.

## Phát triển

```sh
pnpm install
pnpm dev
```

Trang quản trị: `/admin/index.html`. Cấu hình CMS nằm ở `public/admin/config.yml`.

## Bài viết

Mỗi bài là một thư mục `src/content/posts/<slug>/` gồm `index.md` và ảnh của bài. Chuyên mục, thẻ và mức độ chắc chắn khai báo ở `src/data/taxonomy.ts`, và phải khớp với `public/admin/config.yml`. Kế hoạch dự án nằm ở `docs/plan.md`.

## Deploy

Cloudflare Pages kết nối trực tiếp với repo này và tự build khi có push lên `main` (build command `pnpm build`, output `dist`). Phiên bản Node lấy từ `.node-version`.

GitHub Actions (`.github/workflows/ci.yml`) chỉ build để kiểm tra mỗi push và PR, không deploy.

## Đăng nhập CMS

Chọn "Sign In with Token" và dùng fine-grained PAT với Resource owner là `happier-solutions`, chỉ chọn repo `tmdn`, cấp quyền Contents và Pull requests ở mức read/write.
