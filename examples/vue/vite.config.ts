import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { slabsPlugin } from '@slabs/vite-plugin';

export default defineConfig({
  plugins: [
    vue(),
    slabsPlugin({
      blocksDir: './blocks',
      validation: {
        warnings: true,
        strict: false
      }
    })
  ]
});
