import type { APIRoute } from 'astro';
import { SITE_DESCRIPTION, SITE_NAME } from '../consts';
import { PILLARS } from '../data/taxonomy';
import { getPublishedPosts, postUrl, topicOf } from '../lib/posts';

export const GET: APIRoute = async ({ site }) => {
	const link = (name: string, path: string, note?: string) =>
		`- [${name}](${new URL(path, site)})${note ? `: ${note}` : ''}`;
	const posts = await getPublishedPosts();

	const postSections = PILLARS.flatMap(({ slug, label, description }) => {
		const inPillar = posts.filter((post) => topicOf(post).pillar === slug);
		const links = inPillar.map((post) => link(post.data.title, postUrl(post), post.data.description));
		return [`## ${label}\n\n${description}\n\n${[link(label, `/${slug}/`), ...links].join('\n')}`];
	});

	const body = [
		`# ${SITE_NAME}`,
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
