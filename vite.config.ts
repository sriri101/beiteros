import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// Stub out Figma Make runtime modules and assets so standard Vite builds succeed
const figmaStubPlugin = {
  name: 'figma-stub',
  resolveId(id: string) {
    if (id.startsWith('figma:')) return '\0figma-stub:' + id
  },
  load(id: string) {
    if (id.startsWith('\0figma-stub:figma:asset/')) {
      // Return a transparent 1x1 PNG data URL for image stubs
      return `export default 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR4nGNgAAIAAAUAAXpeqz8AAAAASUVORK5CYII='`
    }
    if (id.startsWith('\0figma-stub:figma:')) {
      return 'export default {}'
    }
  },
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    figmaStubPlugin,
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
