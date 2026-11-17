// The taxonomy lives in taxonomy.json, which the CMS edits ("Phân loại" in public/admin/config.yml).
// This file only validates it, so adding, renaming or reordering a topic or tag needs no code change.

import { z } from 'astro/zod';
import data from './taxonomy.json';

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug: chữ thường không dấu, số và gạch nối');

const schema = z
	.object({
		pillars: z
			.array(
				z.object({
					slug,
					label: z.string(),
					description: z.string(),
					intro: z.string(),
					metaDescription: z.string(),
					imageCaption: z.string().optional(),
				}),
			)
			.min(1),
		topics: z
			.array(
				z.object({
					slug,
					label: z.string(),
					pillar: z.string(),
					description: z.string(),
					points: z.array(z.string()).default([]),
				}),
			)
			.min(1),
		tags: z.array(z.object({ slug, label: z.string() })).default([]),
	})
	.superRefine(({ pillars, topics, tags }, ctx) => {
		const pillarSlugs = new Set(pillars.map((pillar) => pillar.slug));
		for (const [list, items] of Object.entries({ pillars, topics, tags })) {
			const seen = new Set<string>();
			for (const { slug } of items) {
				if (seen.has(slug)) ctx.addIssue({ code: 'custom', message: `${list}: slug "${slug}" bị trùng` });
				seen.add(slug);
			}
		}
		for (const topic of topics) {
			if (!pillarSlugs.has(topic.pillar)) {
				ctx.addIssue({ code: 'custom', message: `topics: "${topic.slug}" thuộc chuyên mục không tồn tại "${topic.pillar}"` });
			}
		}
	});

const taxonomy = schema.parse(data);

export type Pillar = (typeof taxonomy.pillars)[number];
export type Topic = (typeof taxonomy.topics)[number];
export type Tag = (typeof taxonomy.tags)[number];

/** The two editorial pillars, in CMS order. Each is a URL root: `/<pillar>/`. */
export const PILLARS: readonly Pillar[] = taxonomy.pillars;
/** Topics (chủ đề con), in CMS order. Each belongs to one pillar. */
export const TOPICS: readonly Topic[] = taxonomy.topics;
/** Tags (từ khóa), in CMS order. */
export const TAGS: readonly Tag[] = taxonomy.tags;

export const CONFIDENCE_LEVELS = [
	{ slug: 'quan-sat-ban-dau', label: 'Quan sát ban đầu' },
	{ slug: 'da-tim-hieu-them', label: 'Đã tìm hiểu thêm' },
	{ slug: 'da-kiem-chung', label: 'Đã kiểm chứng' },
] as const;

type Item = { readonly slug: string; readonly label: string };

/** Slugs as the non-empty tuple that z.enum() expects. */
export const slugsOf = (items: readonly Item[]) => items.map((item) => item.slug) as [string, ...string[]];

export const labelOf = (items: readonly Item[], slug: string) =>
	items.find((item) => item.slug === slug)?.label ?? slug;

export const getTopic = (slug: string) => TOPICS.find((topic) => topic.slug === slug)!;
export const getPillar = (slug: string) => PILLARS.find((pillar) => pillar.slug === slug)!;
export const topicsOf = (pillar: string) => TOPICS.filter((topic) => topic.pillar === pillar);

export const pillarUrl = (pillar: string) => `/${pillar}/`;
export const topicUrl = (topic: Topic) => `/${topic.pillar}/chu-de/${topic.slug}/`;
export const tagUrl = (tag: string) => `/tu-khoa/${tag}/`;
