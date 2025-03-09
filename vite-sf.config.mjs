// Plugins
import Components from 'unplugin-vue-components/vite'
import Vue from '@vitejs/plugin-vue'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import ViteFonts from 'unplugin-fonts/vite'

// Utilities
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import { viteSingleFile } from "vite-plugin-singlefile"

import { renameSync } from 'fs'
import { join } from 'path'
import pkg from './package.json' assert { type: 'json' }  // Ensure your Node version supports JSON modules

// Custom plugin to rename index.html after build
function renameHtmlPlugin() {
  return {
    name: 'rename-html',
    closeBundle() {
      const distDir = 'dist'
      const oldPath = join(distDir, 'index.html')
      const newPath = join(distDir, `mcdcf-v${pkg.version}.html`)
      try {
        renameSync(oldPath, newPath)
        console.log(`Renamed ${oldPath} to ${newPath}`)
      } catch (error) {
        console.error('Error renaming HTML file:', error)
      }
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Vue({
      template: { transformAssetUrls }
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
    Vuetify(),
    Components(),
    viteSingleFile(),
    renameHtmlPlugin()
  ],
  define: { 'process.env': {} },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  server: {
    port: 3000,
  },
  css: {
    preprocessorOptions: {
      sass: {
        api: 'modern-compiler',
      },
    },
  },
})
