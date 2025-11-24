<template>
  <div ref="holderRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import EditorJS from 'editorjs';
import { Slabs } from '@slabs/client';

interface Props {
  data?: any;
}

interface Emits {
  (e: 'change', data: any): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const holderRef = ref<HTMLDivElement | null>(null);
let editor: EditorJS | null = null;

// Expose save and clear methods
defineExpose({
  async save() {
    if (!editor) throw new Error('Editor not initialized');
    return await editor.save();
  },
  async clear() {
    if (!editor) throw new Error('Editor not initialized');
    await editor.clear();
  }
});

onMounted(() => {
  if (!holderRef.value) return;

  // Initialize Slabs to get Editor.js tools
  const slabs = new Slabs();
  const tools = slabs.getTools();

  // Initialize Editor.js with Slabs blocks
  editor = new EditorJS({
    holder: holderRef.value,
    tools: {
      ...tools
    },
    data: props.data || { blocks: [] },
    onChange: async () => {
      if (editor) {
        const savedData = await editor.save();
        emit('change', savedData);
      }
    },
    placeholder: 'Click + to add a block...',
    inlineToolbar: false
  });
});

onBeforeUnmount(() => {
  if (editor && typeof editor.destroy === 'function') {
    editor.destroy();
    editor = null;
  }
});
</script>
