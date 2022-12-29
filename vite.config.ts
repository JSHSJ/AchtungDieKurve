import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        svelte(),
        VitePWA({
            registerType: 'autoUpdate',
            workbox: {
                globPatterns: ['**/*.{js,css,html,png,jpg,svg}'],
            },
            devOptions: {
                enabled: true,
            },
            manifest: {
                name: 'Achtung die Kurve',
                short_name: 'Kurveee',
                description: 'The classic game in a modern look.',
                theme_color: '#ffffff',
                icons: [
                    {
                        src: 'manifest-icon-192.maskable.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'any',
                    },
                    {
                        src: 'manifest-icon-192.maskable.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'maskable',
                    },
                    {
                        src: 'manifest-icon-512.maskable.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any',
                    },
                    {
                        src: 'manifest-icon-512.maskable.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable',
                    },
                ],
            },
        }),
    ],
});
