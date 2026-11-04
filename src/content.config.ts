import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORIES, CONFIDENCE_LEVELS, slugsOf, TAGS } from './data/taxonomy';

const posts = defineCollection({
	loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			heroCredit: z.string().optional(),
			category: z.enum(slugsOf(CATEGORIES)),
			tags: z.array(z.enum(slugsOf(TAGS))).default([]),
			confidence: z.enum(slugsOf(CONFIDENCE_LEVELS)),
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
