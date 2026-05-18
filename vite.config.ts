import { defineConfig } from 'vite'

export default defineConfig({
  // If deploying to GitHub Pages at https://username.github.io/particle-sphere/
  // set base to '/particle-sphere/'
  // If deploying to https://username.github.io/ leave it as '/'
  base: '/',
  build: {
    outDir: 'dist',
  },
})
