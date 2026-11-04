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
	fonts: [
		{
			provider: fontProviders.fontsource(),
			name: 'Montserrat',
			cssVariable: '--font-body',
			weights: [400, 600, 700],
			styles: ['normal'],
			subsets: ['vietnamese', 'latin', 'latin-ext'],
			fallbacks: ['sans-serif'],
		},
		{
			provider: fontProviders.fontsource(),
			name: 'Playfair Display',
			cssVariable: '--font-heading',
			weights: [400],
			styles: ['normal'],
			subsets: ['vietnamese', 'latin', 'latin-ext'],
			fallbacks: ['serif'],
		},
	],
});
