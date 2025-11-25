/**
 * Admin Page - Editor.js Integration
 * Demonstrates editing content with Slabs blocks
 */

import EditorJS from '@editorjs/editorjs';
import { Slabs } from '@slabs/client';

// Initialize Slabs to get Editor.js tools
const slabs = new Slabs();
const tools = slabs.getTools();

console.log('📝 Admin Editor Loaded');
console.log('Available tools:', Object.keys(tools));
console.log('Has slabs/paragraph?', 'slabs/paragraph' in tools);

// Check if slabs/paragraph is available
if (!tools['slabs/paragraph']) {
  console.error('❌ slabs/paragraph block not found! Please restart dev server.');
  console.error('Available blocks:', Object.keys(tools));
}

// Load saved data from localStorage
function loadSavedData() {
  const saved = localStorage.getItem('slabs-content');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error('Error parsing saved data:', error);
      return null;
    }
  }
  return null;
}

// Initialize Editor.js with Slabs tools
const editor = new EditorJS({
  holder: 'editorjs',

  tools: {
    ...tools,
    // Override Editor.js built-in paragraph with Slabs paragraph
    paragraph: tools['slabs/paragraph']
  },

  data: loadSavedData() || {
    blocks: []
  },

  placeholder: 'Click + to add a block...',

  inlineToolbar: false,

  // Set default block to Editor.js paragraph (which we override with slabs/paragraph)
  defaultBlock: 'paragraph',

  onReady: () => {
    console.log('✅ Editor.js is ready!');
  },

  onChange: (api, event) => {
    console.log('Content changed', event);
  }
});

// Save button handler
const saveButton = document.getElementById('save-button');
const statusDiv = document.getElementById('status');

saveButton?.addEventListener('click', async () => {
  try {
    const outputData = await editor.save();

    // Save to localStorage
    localStorage.setItem('slabs-content', JSON.stringify(outputData));

    console.log('💾 Content saved:', outputData);

    // Show success message
    if (statusDiv) {
      statusDiv.textContent = '✅ Content saved successfully! View it on the public page.';
      statusDiv.className = 'status show';
      statusDiv.style.background = '#d4edda';
      statusDiv.style.borderColor = '#c3e6cb';
      statusDiv.style.color = '#155724';

      setTimeout(() => {
        statusDiv.className = 'status';
      }, 3000);
    }
  } catch (error) {
    console.error('Error saving content:', error);

    if (statusDiv) {
      statusDiv.textContent = '❌ Error saving content. Check console for details.';
      statusDiv.className = 'status show';
      statusDiv.style.background = '#f8d7da';
      statusDiv.style.borderColor = '#f5c6cb';
      statusDiv.style.color = '#721c24';
    }
  }
});

// Clear button handler
const clearButton = document.getElementById('clear-button');

clearButton?.addEventListener('click', async () => {
  if (confirm('Are you sure you want to clear all content?')) {
    try {
      await editor.clear();
      localStorage.removeItem('slabs-content');

      console.log('🗑️ Content cleared');

      if (statusDiv) {
        statusDiv.textContent = '🗑️ Content cleared!';
        statusDiv.className = 'status show';
        statusDiv.style.background = '#fff3cd';
        statusDiv.style.borderColor = '#ffeaa7';
        statusDiv.style.color = '#856404';

        setTimeout(() => {
          statusDiv.className = 'status';
        }, 2000);
      }
    } catch (error) {
      console.error('Error clearing content:', error);
    }
  }
});

// Add keyboard shortcut for save (Cmd/Ctrl + S)
document.addEventListener('keydown', async (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 's') {
    e.preventDefault();
    saveButton?.click();
  }
});
