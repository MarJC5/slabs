<template>
  <div v-if="!data || !data.blocks || data.blocks.length === 0" class="empty-state">
    <h2>No content yet</h2>
    <p>Create some content in the editor first</p>
  </div>
  <div v-else ref="containerRef" class="slabs-content"></div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { SlabsRenderer } from '@slabs/renderer';

interface Props {
  data?: any;
}

const props = defineProps<Props>();
const containerRef = ref<HTMLDivElement | null>(null);

const renderContent = async () => {
  if (!containerRef.value || !props.data) return;

  // Clear existing content
  containerRef.value.innerHTML = '';

  // Initialize renderer
  const renderer = new SlabsRenderer();

  try {
    // Render the content
    const rendered = await renderer.render(props.data, {
      theme: 'light',
      mode: 'public'
    });
    containerRef.value.appendChild(rendered);
  } catch (error) {
    console.error('Error rendering content:', error);
  }
};

// Watch for data changes
watch(() => props.data, renderContent, { deep: true });

// Render on mount
onMounted(renderContent);
</script>
