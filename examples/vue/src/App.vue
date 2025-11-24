<template>
  <div class="app">
    <header class="header">
      <div class="header-content">
        <div class="header-left">
          <nav class="nav">
            <button
              :class="['nav-link', { active: activeTab === 'editor' }]"
              @click="activeTab = 'editor'"
            >
              Editor
            </button>
            <button
              :class="['nav-link', { active: activeTab === 'view' }]"
              @click="activeTab = 'view'"
            >
              View
            </button>
          </nav>
        </div>
        <div v-if="activeTab === 'editor'" class="actions">
          <button class="btn btn-primary" @click="handleSave">Save</button>
          <button class="btn btn-secondary" @click="handleClear">Clear</button>
        </div>
      </div>
    </header>

    <div v-if="status" :class="['status', `status--${status.type}`, 'show']">
      {{ status.message }}
    </div>

    <div class="content-container">
      <div class="content-wrapper">
        <div v-if="activeTab === 'editor'" class="editor-container">
          <Editor ref="editorRef" :data="initialData" @change="handleEditorChange" />
        </div>
        <Renderer v-else :data="editorData || initialData" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Editor from './components/Editor.vue';
import Renderer from './components/Renderer.vue';

type Tab = 'editor' | 'view';
type StatusType = 'success' | 'error' | 'info';

const activeTab = ref<Tab>('editor');
const editorData = ref<any>(null);
const status = ref<{ message: string; type: StatusType } | null>(null);
const editorRef = ref<InstanceType<typeof Editor> | null>(null);

const handleEditorChange = (data: any) => {
  editorData.value = data;
};

const handleSave = async () => {
  try {
    if (!editorRef.value) return;

    const savedData = await editorRef.value.save();
    localStorage.setItem('slabs-content', JSON.stringify(savedData));
    editorData.value = savedData;

    status.value = {
      message: '✅ Content saved successfully! View it on the View tab.',
      type: 'success'
    };

    setTimeout(() => (status.value = null), 3000);
  } catch (error) {
    console.error('Error saving content:', error);
    status.value = {
      message: '❌ Error saving content. Check console for details.',
      type: 'error'
    };
  }
};

const handleClear = async () => {
  if (!confirm('Are you sure you want to clear all content?')) return;

  try {
    if (!editorRef.value) return;

    await editorRef.value.clear();
    localStorage.removeItem('slabs-content');
    editorData.value = null;

    status.value = {
      message: '🗑️ Content cleared!',
      type: 'info'
    };

    setTimeout(() => (status.value = null), 2000);
  } catch (error) {
    console.error('Error clearing content:', error);
  }
};

// Load data from localStorage
const loadedData = localStorage.getItem('slabs-content');
const initialData = loadedData ? JSON.parse(loadedData) : null;
</script>

<style src="./App.css"></style>
