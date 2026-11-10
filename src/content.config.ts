import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CONFIDENCE_LEVELS, slugsOf, TAGS, TOPICS } from './data/taxonomy';

const oneOf = (items: readonly { slug: string }[], name: string) =>
	z.string().refine((value) => items.some((item) => item.slug === value), {
		message: `${name} không có trong src/data/taxonomy.json`,
	});

const posts = defineCollection({
	loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			/** The standfirst (sapo) under the title, also the search snippet and card text. */
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			heroAlt: z.string().optional(),
			/** Caption under the hero image. */
			heroCredit: z.string().optional(),
			/** The pillar comes from the topic. */
			topic: oneOf(TOPICS, 'Chủ đề'),
			tags: z.array(oneOf(TAGS, 'Từ khóa')).default([]),
			featured: z.boolean().default(false),
			references: z
				.array(z.object({ title: z.string(), url: z.url().optional() }))
				.default([]),
			confidence: z.enum(slugsOf(CONFIDENCE_LEVELS)).optional(),
			changedMindNote: z.string().optional(),
			draft: z.boolean().default(false),
		}),
});

const pages = defineCollection({
	loader: glob({ base: './src/content/pages', pattern: '*.md' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
	}),
});

export const collections = { posts, pages };
