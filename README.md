# tmdn

Blog dùng Astro 7 và Sveltia CMS, build bằng GitHub Actions và deploy lên Cloudflare Pages.

## Phát triển

```sh
npm install
npm run dev
```

Trang quản trị: `/admin/index.html`. Cấu hình CMS nằm ở `public/admin/config.yml`.

## Bài viết

Mỗi bài là một thư mục `src/content/blog/<slug>/` gồm `index.md` và ảnh của bài.

## Deploy

Workflow `.github/workflows/deploy.yml` build mọi push và PR. Push lên `main` sẽ deploy khi repo đã có secret.

1. Tạo API token trên Cloudflare với quyền Account > Cloudflare Pages > Edit.
2. Tạo project một lần: `CLOUDFLARE_API_TOKEN=... CLOUDFLARE_ACCOUNT_ID=... npx wrangler pages project create tmdn --production-branch main`
3. Thêm secret `CLOUDFLARE_API_TOKEN` và `CLOUDFLARE_ACCOUNT_ID` vào repo.
4. Chạy lại workflow.

## Đăng nhập CMS

Chọn "Sign In with Token" và dùng fine-grained PAT của repo này, với quyền Contents và Pull requests ở mức read/write.
