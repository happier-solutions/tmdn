import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_NAME } from '../consts';
import { getPublishedPosts, pillarOf, postUrl, topicOf } from '../lib/posts';

export async function GET(context) {
	const posts = await getPublishedPosts();
	return rss({
		title: SITE_NAME,
		description: SITE_DESCRIPTION,
		site: context.site,
		customData: '<language>vi</language>',
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			link: postUrl(post),
			categories: [pillarOf(post).label, topicOf(post).label],
		})),
	});
}
