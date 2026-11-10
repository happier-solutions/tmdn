// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://tmdn.pages.dev',
	trailingSlash: 'always',
	// No render-blocking stylesheet request before the first paint.
	build: { inlineStylesheets: 'always' },
	integrations: [mdx(), sitemap()],
	// Subset order matters: the last declared face wins overlapping glyphs. With `vietnamese` last,
	// ă, đ, ĩ, ũ, ơ and ư no longer pull in the much larger `latin-ext` file.
	fonts: [
		{
			provider: fontProviders.fontsource(),
			name: 'Be Vietnam Pro',
			cssVariable: '--font-body',
			weights: [400, 600],
			styles: ['normal'],
			subsets: ['latin-ext', 'latin', 'vietnamese'],
			fallbacks: ['sans-serif'],
		},
		{
			provider: fontProviders.fontsource(),
			name: 'Newsreader',
			cssVariable: '--font-heading',
			weights: [400, 500],
			styles: ['normal', 'italic'],
			subsets: ['latin-ext', 'latin', 'vietnamese'],
			fallbacks: ['serif'],
		},
		{
			provider: fontProviders.fontsource(),
			name: 'Patrick Hand',
			cssVariable: '--font-hand',
			weights: [400],
			styles: ['normal'],
			subsets: ['latin-ext', 'latin', 'vietnamese'],
			fallbacks: ['cursive'],
		},
	],
});
