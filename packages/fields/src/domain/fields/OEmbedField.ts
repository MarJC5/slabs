import type { FieldType, FieldConfigData, ValidationResult, ValidationError } from '../types';

/**
 * OEmbed value type
 */
export interface OEmbedValue {
  url: string;
  service: 'youtube' | 'vimeo' | 'twitter' | 'unknown';
}

/**
 * OEmbedField - Embed URL input field type
 * Supports YouTube, Vimeo, Twitter, and other embed URLs
 */
export class OEmbedField implements FieldType {
  /**
   * URL validation regex - only allows http and https protocols
   */
  private readonly URL_REGEX = /^https?:\/\/.+/;

  /**
   * Service patterns for detecting embed services
   */
  private readonly SERVICE_PATTERNS = {
    youtube: /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/,
    vimeo: /vimeo\.com\/(\d+)/,
    twitter: /twitter\.com\/\w+\/status\/(\d+)/
  };

  /**
   * Render embed URL input field with preview
   */
  render(config: FieldConfigData, value: any): HTMLElement {
    const container = document.createElement('div');
    container.classList.add('slabs-field-oembed');

    // Parse value
    const embedValue = this.parseValue(value, config.defaultValue);

    // Create input
    const input = document.createElement('input');
    input.classList.add('slabs-field__input');
    input.setAttribute('type', 'url');
    input.setAttribute('placeholder', config.placeholder || 'Paste YouTube, Vimeo, or Twitter URL...');
    input.value = embedValue.url;

    if (config.required) {
      input.required = true;
    }

    container.appendChild(input);

    // Create preview container
    const previewContainer = document.createElement('div');
    previewContainer.classList.add('slabs-field__oembed-preview-container');
    container.appendChild(previewContainer);

    // Show initial preview if URL exists
    if (embedValue.url && embedValue.service !== 'unknown') {
      const preview = this.createPreview(embedValue);
      previewContainer.appendChild(preview);
    }

    // Update preview on input change
    input.addEventListener('input', () => {
      const url = input.value.trim();
      const service = this.detectService(url);

      // Clear previous preview
      previewContainer.innerHTML = '';

      // Show new preview if valid
      if (url && service !== 'unknown') {
        const preview = this.createPreview({ url, service });
        previewContainer.appendChild(preview);
      }
    });

    return container;
  }

  /**
   * Extract embed value from input
   */
  extract(element: HTMLElement): OEmbedValue {
    const input = element.querySelector('input') as HTMLInputElement;
    const url = input ? input.value.trim() : '';
    const service = this.detectService(url);

    return {
      url,
      service
    };
  }

  /**
   * Validate embed field value
   */
  validate(config: FieldConfigData, value: any): ValidationResult {
    const errors: ValidationError[] = [];
    const fieldLabel = config.label || 'Embed';

    // Parse value
    const embedValue = this.parseValue(value, null);

    // Check if field is empty
    const isEmpty = embedValue.url.trim() === '';

    // Skip validation if empty and not required
    if (isEmpty && !config.required) {
      return {
        valid: true,
        errors: []
      };
    }

    // Required validation
    if (config.required && isEmpty) {
      errors.push({
        field: fieldLabel,
        message: `${fieldLabel} is required`,
        code: 'REQUIRED'
      });
    }

    // URL format validation
    if (!isEmpty && !this.URL_REGEX.test(embedValue.url.trim())) {
      errors.push({
        field: fieldLabel,
        message: `${fieldLabel} must be a valid http or https URL`,
        code: 'INVALID_URL'
      });
    }

    // Warn about unsupported service (but still valid)
    if (!isEmpty && embedValue.service === 'unknown') {
      errors.push({
        field: fieldLabel,
        message: `URL is valid but service is not recognized. Supported: YouTube, Vimeo, Twitter`,
        code: 'UNSUPPORTED_SERVICE'
      });
    }

    return {
      valid: errors.filter(e => e.code !== 'UNSUPPORTED_SERVICE').length === 0,
      errors
    };
  }

  /**
   * Detect embed service from URL
   */
  private detectService(url: string): OEmbedValue['service'] {
    if (!url) return 'unknown';

    for (const [service, pattern] of Object.entries(this.SERVICE_PATTERNS)) {
      if (pattern.test(url)) {
        return service as OEmbedValue['service'];
      }
    }

    return 'unknown';
  }

  /**
   * Create embed preview element
   */
  private createPreview(value: OEmbedValue): HTMLElement {
    const preview = document.createElement('div');
    preview.classList.add('slabs-field__oembed-preview');

    const iframe = document.createElement('iframe');
    iframe.classList.add('slabs-field__oembed-iframe');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allowfullscreen', 'true');

    // Set iframe src based on service
    const embedUrl = this.getEmbedUrl(value);
    if (embedUrl) {
      iframe.src = embedUrl;
    }

    const serviceBadge = document.createElement('div');
    serviceBadge.classList.add('slabs-field__oembed-service');
    serviceBadge.textContent = value.service.charAt(0).toUpperCase() + value.service.slice(1);

    preview.appendChild(serviceBadge);
    preview.appendChild(iframe);

    return preview;
  }

  /**
   * Get embed URL for iframe
   */
  private getEmbedUrl(value: OEmbedValue): string | null {
    const { url, service } = value;

    switch (service) {
      case 'youtube': {
        const match = url.match(this.SERVICE_PATTERNS.youtube);
        return match ? `https://www.youtube.com/embed/${match[1]}` : null;
      }
      case 'vimeo': {
        const match = url.match(this.SERVICE_PATTERNS.vimeo);
        return match ? `https://player.vimeo.com/video/${match[1]}` : null;
      }
      case 'twitter': {
        // Twitter embeds require different handling (widget.js)
        return null;
      }
      default:
        return null;
    }
  }

  /**
   * Parse value into OEmbedValue object
   */
  private parseValue(value: any, defaultValue: any): OEmbedValue {
    // If value is provided and valid, use it
    if (value && typeof value === 'object' && value.url) {
      return {
        url: value.url || '',
        service: value.service || this.detectService(value.url)
      };
    }

    // If defaultValue is provided and valid, use it
    if (defaultValue && typeof defaultValue === 'object' && defaultValue.url) {
      return {
        url: defaultValue.url || '',
        service: defaultValue.service || this.detectService(defaultValue.url)
      };
    }

    // Return empty values
    return {
      url: '',
      service: 'unknown'
    };
  }
}