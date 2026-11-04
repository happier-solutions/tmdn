import type { APIRoute } from 'astro';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { CATEGORIES } from '../data/taxonomy';
import { getPublishedPosts, postUrl } from '../lib/posts';

export const GET: APIRoute = async ({ site }) => {
	const link = (name: string, path: string, note?: string) =>
		`- [${name}](${new URL(path, site)})${note ? `: ${note}` : ''}`;
	const posts = await getPublishedPosts();

	const postSections = CATEGORIES.flatMap(({ slug, label }) => {
		const inCategory = posts.filter((post) => post.data.category === slug);
		if (!inCategory.length) return [];
		const links = inCategory.map((post) =>
			link(post.data.title, postUrl(post), post.data.description),
		);
		return [`## ${label}\n\n${links.join('\n')}`];
	});

	const body = [
		`# ${SITE_TITLE}`,
		`> ${SITE_DESCRIPTION}`,
		`## Trang\n\n${[
			link('Giới thiệu', '/gioi-thieu/'),
			link('Quy tắc ẩn danh', '/quy-tac-an-danh/'),
			link('Liên hệ', '/lien-he/'),
			link('RSS', '/rss.xml'),
		].join('\n')}`,
		...postSections,
	].join('\n\n');

	return new Response(`${body}\n`, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
