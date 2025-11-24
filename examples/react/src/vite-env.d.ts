/// <reference types="vite/client" />

declare module 'virtual:slabs-registry' {
  import type { SlabsBlock } from '@slabs/vite-plugin';
  export const blocks: SlabsBlock[];
}
