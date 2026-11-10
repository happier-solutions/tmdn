import { type CollectionEntry, getCollection } from 'astro:content';
import { getPillar, getTopic } from '../data/taxonomy';

export type Post = CollectionEntry<'posts'>;

// Vietnamese is counted per syllable, which reads faster than per English word.
const SYLLABLES_PER_MINUTE = 220;

/** Published posts, newest first. Drafts never reach any route, feed or sitemap. */
export async function getPublishedPosts(): Promise<Post[]> {
	const posts = await getCollection('posts', ({ data }) => !data.draft);
	return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export const topicOf = (post: Post) => getTopic(post.data.topic);
export const pillarOf = (post: Post) => getPillar(topicOf(post).pillar);

/** `/<pillar>/<slug>/`. Moving a post to a topic of the other pillar changes it, so add a redirect then. */
export const postUrl = (post: Post) => `/${topicOf(post).pillar}/${post.id}/`;

export const getSyllables = (post: Post) => post.body?.trim().split(/\s+/).length ?? 0;

export function getReadingMinutes(post: Post) {
	return Math.max(1, Math.round(getSyllables(post) / SYLLABLES_PER_MINUTE));
}

/** Featured posts first, newest first within each group. */
export const byFeatured = (posts: Post[]) =>
	[...posts].sort((a, b) => Number(b.data.featured) - Number(a.data.featured));

/** Other posts ranked by shared tags and topic, with same-pillar posts ranked just above no overlap. */
export function getRelatedPosts(post: Post, posts: Post[], limit = 3) {
	const pillar = topicOf(post).pillar;
	const score = (other: Post) =>
		other.data.tags.filter((tag) => post.data.tags.includes(tag)).length * 2 +
		(other.data.topic === post.data.topic ? 2 : 0) +
		(topicOf(other).pillar === pillar ? 1 : 0);

	return posts
		.filter((other) => other.id !== post.id && score(other) > 0)
		.sort((a, b) => score(b) - score(a))
		.slice(0, limit);
}
