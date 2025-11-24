import type { FieldType, FieldConfigData, ValidationResult } from '../types';
import * as CodexIcons from '@codexteam/icons';

/**
 * WYSIWYG Field (contentEditable with always-visible toolbar)
 * Uses @codexteam/icons for toolbar buttons
 */
export class WysiwygField implements FieldType {
  render(config: FieldConfigData, value: any): HTMLElement {
    // Editor container (FieldRenderer will add the label/description wrapper)
    const editorContainer = document.createElement('div');
    editorContainer.className = 'slabs-wysiwyg';
    editorContainer.dataset.fieldType = 'wysiwyg';

    // Toolbar - always visible
    const toolbar = document.createElement('div');
    toolbar.className = 'slabs-wysiwyg__toolbar';

    // Determine toolbar mode (minimal or full)
    const mode = (config as any).mode || 'minimal';

    const minimalTools = [
      { command: 'bold', icon: CodexIcons.IconBold, title: 'Bold (Cmd+B)' },
      { command: 'italic', icon: CodexIcons.IconItalic, title: 'Italic (Cmd+I)' },
      { command: 'createLink', icon: CodexIcons.IconLink, title: 'Link' },
    ];

    const fullTools = [
      { command: 'bold', icon: CodexIcons.IconBold, title: 'Bold (Cmd+B)' },
      { command: 'italic', icon: CodexIcons.IconItalic, title: 'Italic (Cmd+I)' },
      { command: 'underline', icon: CodexIcons.IconUnderline, title: 'Underline (Cmd+U)' },
      { command: 'strikeThrough', icon: CodexIcons.IconStrikethrough, title: 'Strikethrough' },
      { command: 'createLink', icon: CodexIcons.IconLink, title: 'Link' },
      { command: 'formatBlock', icon: CodexIcons.IconHeading, title: 'Heading 1', value: 'h1' },
      { command: 'formatBlock', icon: CodexIcons.IconHeading, title: 'Heading 2', value: 'h2' },
      { command: 'formatBlock', icon: CodexIcons.IconHeading, title: 'Heading 3', value: 'h3' },
      { command: 'insertUnorderedList', icon: CodexIcons.IconListBulleted, title: 'Bullet List' },
      { command: 'insertOrderedList', icon: CodexIcons.IconListNumbered, title: 'Numbered List' },
    ];

    const tools = mode === 'full' ? fullTools : minimalTools;

    // ContentEditable editor
    const editor = document.createElement('div');
    editor.className = 'slabs-wysiwyg__editor';
    editor.contentEditable = 'true';

    // Set initial value
    if (value) {
      editor.innerHTML = value;
    } else if (config.placeholder) {
      editor.dataset.placeholder = config.placeholder;
    }

    tools.forEach(tool => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'slabs-wysiwyg__tool';
      button.innerHTML = tool.icon;
      button.title = tool.title;
      button.dataset.command = tool.command;

      button.addEventListener('click', (e) => {
        e.preventDefault();

        if (tool.command === 'createLink') {
          const url = prompt('Enter URL:');
          if (url) {
            // eslint-disable-next-line deprecation/deprecation
            document.execCommand(tool.command, false, url);
          }
        } else if ((tool as any).value) {
          // For commands with values (like formatBlock)
          // eslint-disable-next-line deprecation/deprecation
          document.execCommand(tool.command, false, (tool as any).value);
        } else {
          // eslint-disable-next-line deprecation/deprecation
          document.execCommand(tool.command, false);
        }

        editor.focus();
      });

      toolbar.appendChild(button);
    });

    editorContainer.appendChild(toolbar);
    editorContainer.appendChild(editor);

    // Keyboard shortcuts
    editor.addEventListener('keydown', (e) => {
      if (e.metaKey || e.ctrlKey) {
        switch(e.key.toLowerCase()) {
          case 'b':
            e.preventDefault();
            // eslint-disable-next-line deprecation/deprecation
            document.execCommand('bold');
            break;
          case 'i':
            e.preventDefault();
            // eslint-disable-next-line deprecation/deprecation
            document.execCommand('italic');
            break;
          case 'u':
            e.preventDefault();
            // eslint-disable-next-line deprecation/deprecation
            document.execCommand('underline');
            break;
        }
      }
    });

    return editorContainer;
  }

  extract(element: HTMLElement): any {
    const editor = element.querySelector('.slabs-wysiwyg__editor');
    if (!editor) return '';

    const placeholder = editor.getAttribute('data-placeholder');
    const content = editor.innerHTML;

    // Return empty string if content is empty or just the placeholder
    if (editor.textContent?.trim() === '' || editor.textContent === placeholder) {
      return '';
    }

    return content;
  }

  validate(config: FieldConfigData, value: any): ValidationResult {
    const errors = [];

    // Required validation
    if (config.required) {
      const textContent = this.stripHtml(value || '');
      if (!textContent || textContent.trim() === '') {
        errors.push({
          field: config.label || 'Field',
          message: `${config.label || 'Field'} is required`
        });
      }
    }

    // Min length validation
    if (config.minLength && value) {
      const textContent = this.stripHtml(value);
      if (textContent.length < config.minLength) {
        errors.push({
          field: config.label || 'Field',
          message: `${config.label || 'Field'} must be at least ${config.minLength} characters`
        });
      }
    }

    // Max length validation
    if (config.maxLength && value) {
      const textContent = this.stripHtml(value);
      if (textContent.length > config.maxLength) {
        errors.push({
          field: config.label || 'Field',
          message: `${config.label || 'Field'} must be at most ${config.maxLength} characters`
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  private stripHtml(html: string): string {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }
}
