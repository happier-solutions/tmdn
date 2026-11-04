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

GitHub Actions (`.github/workflows/ci.yml`) build mỗi push và PR. Push lên `main` sẽ được deploy lên Cloudflare Pages (project `tmdn`) bằng `wrangler pages deploy dist`, nên không tốn build của Cloudflare. Phiên bản Node lấy từ `.node-version`.

Workflow cần hai repo secret là `CLOUDFLARE_API_TOKEN` (quyền Account > Cloudflare Pages > Edit) và `CLOUDFLARE_ACCOUNT_ID`. Automatic deployments của project phải được tắt trong Cloudflare (Settings > Builds & deployments) để không build hai lần.

## Đăng nhập CMS

Chọn "Sign In with Token" và dùng fine-grained PAT với Resource owner là `happier-solutions`, chỉ chọn repo `tmdn`, cấp quyền Contents và Pull requests ở mức read/write.
