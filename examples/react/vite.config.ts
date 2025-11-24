import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { slabsPlugin } from '@slabs/vite-plugin';

export default defineConfig({
  plugins: [
    react(),
    slabsPlugin({
      blocksDir: './blocks',
      validation: {
        warnings: true,
        strict: false
      }
    })
  ]
});
