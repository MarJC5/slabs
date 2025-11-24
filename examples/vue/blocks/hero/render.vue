<script setup lang="ts">
interface HeroProps {
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundStyle?: 'light' | 'dark' | 'accent';
}

const props = withDefaults(defineProps<HeroProps>(), {
  backgroundStyle: 'light'
});
</script>

<template>
  <div :class="`hero-section hero-section--${backgroundStyle}`">
    <div class="hero-content">
      <h1 v-if="headline" class="hero-headline">{{ headline }}</h1>

      <div
        v-if="subheadline"
        class="hero-subheadline"
        v-html="subheadline"
      />

      <a
        v-if="ctaText"
        class="hero-cta"
        :href="ctaLink || '#'"
        :target="ctaLink ? '_blank' : undefined"
        :rel="ctaLink ? 'noopener noreferrer' : undefined"
      >
        {{ ctaText }}
      </a>
    </div>
  </div>
</template>

<style src="./style.css"></style>

<script lang="ts">
import { createApp } from 'vue';
import type { RenderContext } from '@slabs/renderer';
import HeroComponent from './render.vue';

/**
 * Vue-based render function for Hero block
 * Creates a container with .hero-block class, mounts the Vue component into it
 */
export function render(data: any, context?: RenderContext): HTMLElement {
  // Create wrapper element with hero-block class for full-width styling
  const wrapper = document.createElement('div');
  wrapper.className = 'hero-block';

  // Create Vue app and mount the Hero component
  const app = createApp(HeroComponent, data);
  app.mount(wrapper);

  return wrapper;
}
</script>
