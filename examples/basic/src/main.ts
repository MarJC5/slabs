/**
 * Public View Page - Display saved content with SlabsRenderer
 * Demonstrates lightweight rendering without Editor.js
 */

import { SlabsRenderer } from '@slabs/renderer';

console.log('📖 Public View Page Loaded');

// Initialize renderer
const renderer = new SlabsRenderer();

// Load saved content from localStorage
function loadSavedContent() {
  const saved = localStorage.getItem('slabs-content');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error('Error parsing saved content:', error);
      return null;
    }
  }
  return null;
}

// Render the content
async function renderContent() {
  const contentDiv = document.getElementById('content');
  if (!contentDiv) return;

  const savedData = loadSavedContent();

  if (!savedData || !savedData.blocks || savedData.blocks.length === 0) {
    // Show empty state (already in HTML)
    console.log('No saved content found');
    return;
  }

  console.log('📦 Rendering saved content:', savedData);

  try {
    // Render the content using SlabsRenderer
    const rendered = await renderer.render(savedData, {
      theme: 'light',
      mode: 'public'
    });

    // Replace the content
    contentDiv.innerHTML = '';
    contentDiv.appendChild(rendered);

    console.log('✅ Content rendered successfully');
  } catch (error) {
    console.error('Error rendering content:', error);

    contentDiv.innerHTML = `
      <div class="empty-state">
        <h2>Error rendering content</h2>
        <p>Check the console for details</p>
        <a href="/admin.html">Go to Editor</a>
      </div>
    `;
  }
}

// Render on page load
renderContent();

// Listen for storage changes (if admin saves in another tab)
window.addEventListener('storage', (e) => {
  if (e.key === 'slabs-content') {
    console.log('Content updated in another tab, re-rendering...');
    renderContent();
  }
});

// Log bundle size info
console.log('📊 Bundle info:');
console.log('  This page uses @slabs/renderer (~3KB)');
console.log('  Admin page uses Editor.js + @slabs/client (~102KB)');
console.log('  Savings: ~97% smaller bundle for public pages!');
