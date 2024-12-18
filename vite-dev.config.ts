import { fileURLToPath, URL } from 'node:url'
import typedCssModules from '@teranes/vite-typed-css-modules'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'
import { PostcssVite } from './postcss-config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    PostcssVite({
      url: import.meta.url,
      content: [
        './src/**/*{vue,js,cjs,mjs,ts,jsx,tsx}',
      ],
      globalCss: [
        './src/assets/css/_media-queries.css',
        './src/assets/css/_mixins.css',
      ],
    }),
    typedCssModules(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
