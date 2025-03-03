import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { VantResolver } from '@vant/auto-import-resolver';
// import externalGlobals from 'rollup-plugin-external-globals'
// import { createHtmlPlugin } from 'vite-plugin-html'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver(), VantResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver(), VantResolver()],
    }),
    visualizer({ open: true }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      "@css": "/src/assets/css"
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          hack: `true; @import (reference) "${resolve("src/assets/css/_variables.less")}";`,
        },
        javascriptEnabled: true,
      },
    },
  },
  base: "./",
  build: {
    rollupOptions: {
      external: ["echarts", "echarts-wordcloud"]
    }
  }
})
