import { defineConfig } from 'vite';
import { resolve } from 'path';
import { slabsPlugin } from '@slabs/vite-plugin';

export default defineConfig({
  plugins: [
    slabsPlugin({
      blocksDir: './blocks',
      validation: {
        warnings: true,
        strict: false
      }
    })
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html')
      }
    }
  }
});
