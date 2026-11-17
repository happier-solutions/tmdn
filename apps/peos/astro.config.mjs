// @ts-check
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	output: 'server',
	// No images, no Astro sessions (Better Auth owns sessions): skip the IMAGES and SESSION bindings.
	adapter: cloudflare({ imageService: 'passthrough' }),
	session: false,
	integrations: [react()],
	security: { checkOrigin: true },
	// Same faces as the site. `vietnamese` last: the last declared face wins overlapping glyphs.
	fonts: [
		{
			provider: fontProviders.fontsource(),
			name: 'Be Vietnam Pro',
			cssVariable: '--font-body',
			weights: [400, 500, 600],
			styles: ['normal'],
			subsets: ['latin-ext', 'latin', 'vietnamese'],
			fallbacks: ['sans-serif'],
		},
		{
			provider: fontProviders.fontsource(),
			name: 'Newsreader',
			cssVariable: '--font-heading',
			weights: [400],
			styles: ['normal'],
			subsets: ['latin-ext', 'latin', 'vietnamese'],
			fallbacks: ['serif'],
		},
	],
});
