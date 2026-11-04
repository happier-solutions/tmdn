import { type CollectionEntry, getCollection } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

// Vietnamese is counted per syllable, which reads faster than per English word.
const SYLLABLES_PER_MINUTE = 220;

/** Published posts, newest first. Drafts never reach any route, feed or sitemap. */
export async function getPublishedPosts(): Promise<Post[]> {
	const posts = await getCollection('posts', ({ data }) => !data.draft);
	return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export const postUrl = (post: Post) => `/${post.data.category}/${post.id}/`;

export const getSyllables = (post: Post) => post.body?.trim().split(/\s+/).length ?? 0;

export function getReadingMinutes(post: Post) {
	return Math.max(1, Math.round(getSyllables(post) / SYLLABLES_PER_MINUTE));
}

/** Other posts ranked by shared tags, with same-category posts ranked just above no overlap. */
export function getRelatedPosts(post: Post, posts: Post[], limit = 3) {
	const score = (other: Post) =>
		other.data.tags.filter((tag) => post.data.tags.includes(tag)).length * 2 +
		(other.data.category === post.data.category ? 1 : 0);

	return posts
		.filter((other) => other.id !== post.id && score(other) > 0)
		.sort((a, b) => score(b) - score(a))
		.slice(0, limit);
}
