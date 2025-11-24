<script setup lang="ts">
export interface Feature {
  name: string;
  description?: string;
  icon?: string;
  enabled: boolean;
}

export interface Link {
  url: string;
  title: string;
  target: '_self' | '_blank';
}

export interface SampleProps {
  title?: string;
  description?: string;
  quantity?: number;
  weight?: number;
  price?: number;
  email?: string;
  password?: string;
  website?: Link;
  category?: string;
  featured?: boolean;
  enableNotifications?: boolean;
  darkMode?: boolean;
  status?: string;
  priority?: number;
  thumbnail?: string;
  accentColor?: string;
  publishDate?: string;
  content?: string;
  features?: Feature[];
}

const props = withDefaults(defineProps<SampleProps>(), {
  category: 'tech',
  featured: false,
  status: 'draft',
  priority: 5,
  accentColor: '#3b82f6'
});

const getCategoryLabel = (value: string): string => {
  const categories: Record<string, string> = {
    tech: 'Technology',
    design: 'Design',
    marketing: 'Marketing',
    finance: 'Finance'
  };
  return categories[value] || value;
};

const getStatusLabel = (value: string): string => {
  const statuses: Record<string, string> = {
    draft: 'Draft',
    published: 'Published',
    archived: 'Archived'
  };
  return statuses[value] || value;
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
</script>

<template>
  <div class="sample-section">
    <div class="sample-header">
      <h1 v-if="props.title" class="sample-title">{{ props.title }}</h1>
      <p v-if="props.description" class="sample-description">{{ props.description }}</p>
    </div>

    <div class="sample-grid">
      <!-- Basic Info Card -->
      <div class="sample-card">
        <h2 class="sample-card__title">Basic Info</h2>
        <div class="sample-card__content">
          <div class="sample-field">
            <span class="sample-field__label">Quantity:</span>
            <span class="sample-field__value">{{ props.quantity ?? 'N/A' }}</span>
          </div>
          <div class="sample-field">
            <span class="sample-field__label">Weight:</span>
            <span class="sample-field__value">{{ props.weight ? `${props.weight} kg` : 'N/A' }}</span>
          </div>
          <div class="sample-field">
            <span class="sample-field__label">Price:</span>
            <span class="sample-field__value">{{ props.price ? `$${props.price} USD` : 'N/A' }}</span>
          </div>
          <div class="sample-field">
            <span class="sample-field__label">Email:</span>
            <span class="sample-field__value">{{ props.email }}</span>
          </div>
          <div class="sample-field">
            <span class="sample-field__label">Category:</span>
            <span class="sample-field__value">{{ getCategoryLabel(props.category) }}</span>
          </div>
          <div class="sample-field">
            <span class="sample-field__label">Status:</span>
            <span class="sample-field__value">{{ getStatusLabel(props.status) }}</span>
          </div>
          <div class="sample-field">
            <span class="sample-field__label">Priority:</span>
            <span class="sample-field__value">{{ props.priority }}/10</span>
          </div>
          <div class="sample-field">
            <span class="sample-field__label">Featured:</span>
            <span class="sample-field__value">{{ props.featured ? 'Yes' : 'No' }}</span>
          </div>
          <div class="sample-field">
            <span class="sample-field__label">Enable Notifications:</span>
            <span class="sample-field__value">{{ props.enableNotifications ? 'Enabled' : 'Disabled' }}</span>
          </div>
          <div class="sample-field">
            <span class="sample-field__label">Dark Mode:</span>
            <span class="sample-field__value">{{ props.darkMode ? 'On' : 'Off' }}</span>
          </div>
          <div class="sample-field">
            <span class="sample-field__label">Publish Date:</span>
            <span class="sample-field__value">{{ formatDate(props.publishDate) }}</span>
          </div>
        </div>
      </div>

      <!-- Links Card -->
      <div class="sample-card">
        <h2 class="sample-card__title">Links</h2>
        <div class="sample-card__content">
          <div v-if="props.website?.url" class="sample-field">
            <span class="sample-field__label">Website:</span>
            <a
              :href="props.website.url"
              :target="props.website.target"
              class="sample-field__link"
            >
              {{ props.website.title || props.website.url }}
            </a>
          </div>
          <div v-else class="sample-field">
            <span class="sample-field__label">Website:</span>
            <span class="sample-field__value">Not provided</span>
          </div>
        </div>
      </div>

      <!-- Visual Elements Card -->
      <div class="sample-card">
        <h2 class="sample-card__title">Visual Elements</h2>
        <div class="sample-card__content">
          <div v-if="props.thumbnail" class="sample-field">
            <span class="sample-field__label">Thumbnail:</span>
            <img :src="props.thumbnail" alt="Thumbnail" class="sample-thumbnail" />
          </div>
          <div class="sample-field">
            <span class="sample-field__label">Accent Color:</span>
            <div class="sample-color-preview">
              <span
                class="sample-color-swatch"
                :style="{ backgroundColor: props.accentColor }"
              ></span>
              <span class="sample-field__value">{{ props.accentColor }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Section -->
    <div v-if="props.content" class="sample-content">
      <h2 class="sample-content__title">Content</h2>
      <div class="sample-content__body" v-html="props.content"></div>
    </div>

    <!-- Features Section -->
    <div v-if="props.features && props.features.length > 0" class="sample-features">
      <h2 class="sample-features__title">Features</h2>
      <div class="sample-features__grid">
        <div
          v-for="(feature, index) in props.features"
          :key="index"
          class="sample-feature"
          :class="{ 'sample-feature--disabled': !feature.enabled }"
        >
          <div class="sample-feature__icon">{{ feature.icon || '✨' }}</div>
          <h3 class="sample-feature__name">{{ feature.name }}</h3>
          <p v-if="feature.description" class="sample-feature__description">
            {{ feature.description }}
          </p>
          <span v-if="!feature.enabled" class="sample-feature__badge">Disabled</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style src="./style.css"></style>

<script lang="ts">
import { createApp } from 'vue';
import SampleComponent from './render.vue';

/**
 * Vue-based render function for Sample block
 * Creates a container with .sample-block class, mounts the Vue component into it
 */
export function render(data: any): HTMLElement {
  // Create wrapper element with sample-block class
  const wrapper = document.createElement('div');
  wrapper.className = 'sample-block';

  // Create Vue app and mount the Sample component
  const app = createApp(SampleComponent, data);
  app.mount(wrapper);

  return wrapper;
}
</script>
