// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://tmdn.pages.dev',
	integrations: [mdx(), sitemap()],
	fonts: [
		{
			provider: fontProviders.fontsource(),
			name: 'Be Vietnam Pro',
			cssVariable: '--font-body',
			weights: [400, 700],
			styles: ['normal'],
			subsets: ['vietnamese', 'latin', 'latin-ext'],
			fallbacks: ['sans-serif'],
		},
	],
});
