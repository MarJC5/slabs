import { describe, it, expect } from 'vitest';
import {
  getLayouts,
  getLayout,
  getLayoutFields,
  getLayoutField,
  getLayoutsByType,
  hasLayoutType,
  getLayoutTypeCount
} from '../../src/flexible';

describe('Flexible Content Helpers', () => {
  const mockData = {
    sections: [
      {
        layout: 'hero',
        fields: {
          title: 'Welcome',
          subtitle: 'To our site',
          image: { url: '/hero.jpg' }
        }
      },
      {
        layout: 'text',
        fields: {
          content: '<p>Lorem ipsum</p>'
        }
      },
      {
        layout: 'hero',
        fields: {
          title: 'Another Hero',
          subtitle: 'Different content',
          image: { url: '/hero2.jpg' }
        }
      },
      {
        layout: 'gallery',
        fields: {
          images: [
            { url: '/img1.jpg' },
            { url: '/img2.jpg' }
          ]
        }
      }
    ]
  };

  describe('getLayouts', () => {
    it('should return all layouts', () => {
      const layouts = getLayouts(mockData, 'sections');

      expect(layouts).toHaveLength(4);
      expect(layouts[0].layout).toBe('hero');
      expect(layouts[1].layout).toBe('text');
    });

    it('should return empty array for non-existent field', () => {
      const layouts = getLayouts({}, 'sections');
      expect(layouts).toEqual([]);
    });

    it('should return empty array for non-array field', () => {
      const data = { sections: 'not an array' };
      const layouts = getLayouts(data, 'sections');
      expect(layouts).toEqual([]);
    });
  });

  describe('getLayout', () => {
    it('should return layout name from block', () => {
      const layouts = getLayouts(mockData, 'sections');

      expect(getLayout(layouts[0])).toBe('hero');
      expect(getLayout(layouts[1])).toBe('text');
      expect(getLayout(layouts[3])).toBe('gallery');
    });

    it('should return empty string for invalid block', () => {
      expect(getLayout(null as any)).toBe('');
      expect(getLayout(undefined as any)).toBe('');
      expect(getLayout({} as any)).toBe('');
    });
  });

  describe('getLayoutFields', () => {
    it('should return fields from layout block', () => {
      const layouts = getLayouts(mockData, 'sections');
      const fields = getLayoutFields(layouts[0]);

      expect(fields).toEqual({
        title: 'Welcome',
        subtitle: 'To our site',
        image: { url: '/hero.jpg' }
      });
    });

    it('should return empty object for invalid block', () => {
      expect(getLayoutFields(null as any)).toEqual({});
      expect(getLayoutFields(undefined as any)).toEqual({});
      expect(getLayoutFields({} as any)).toEqual({});
    });
  });

  describe('getLayoutField', () => {
    it('should return specific field from layout block', () => {
      const layouts = getLayouts(mockData, 'sections');

      expect(getLayoutField(layouts[0], 'title')).toBe('Welcome');
      expect(getLayoutField(layouts[0], 'subtitle')).toBe('To our site');
      expect(getLayoutField(layouts[1], 'content')).toBe('<p>Lorem ipsum</p>');
    });

    it('should return undefined for non-existent field', () => {
      const layouts = getLayouts(mockData, 'sections');
      expect(getLayoutField(layouts[0], 'missing')).toBeUndefined();
    });

    it('should return undefined for invalid block', () => {
      expect(getLayoutField(null as any, 'field')).toBeUndefined();
      expect(getLayoutField(undefined as any, 'field')).toBeUndefined();
    });
  });

  describe('getLayoutsByType', () => {
    it('should filter layouts by type', () => {
      const heroLayouts = getLayoutsByType(mockData, 'sections', 'hero');

      expect(heroLayouts).toHaveLength(2);
      expect(heroLayouts[0].fields.title).toBe('Welcome');
      expect(heroLayouts[1].fields.title).toBe('Another Hero');
    });

    it('should return empty array if no layouts match', () => {
      const layouts = getLayoutsByType(mockData, 'sections', 'nonexistent');
      expect(layouts).toEqual([]);
    });

    it('should return single layout if only one matches', () => {
      const textLayouts = getLayoutsByType(mockData, 'sections', 'text');

      expect(textLayouts).toHaveLength(1);
      expect(textLayouts[0].fields.content).toBe('<p>Lorem ipsum</p>');
    });
  });

  describe('hasLayoutType', () => {
    it('should return true if layout type exists', () => {
      expect(hasLayoutType(mockData, 'sections', 'hero')).toBe(true);
      expect(hasLayoutType(mockData, 'sections', 'text')).toBe(true);
      expect(hasLayoutType(mockData, 'sections', 'gallery')).toBe(true);
    });

    it('should return false if layout type does not exist', () => {
      expect(hasLayoutType(mockData, 'sections', 'nonexistent')).toBe(false);
      expect(hasLayoutType(mockData, 'sections', 'video')).toBe(false);
    });

    it('should return false for non-existent field', () => {
      expect(hasLayoutType({}, 'sections', 'hero')).toBe(false);
    });
  });

  describe('getLayoutTypeCount', () => {
    it('should return count of specific layout type', () => {
      expect(getLayoutTypeCount(mockData, 'sections', 'hero')).toBe(2);
      expect(getLayoutTypeCount(mockData, 'sections', 'text')).toBe(1);
      expect(getLayoutTypeCount(mockData, 'sections', 'gallery')).toBe(1);
    });

    it('should return 0 for non-existent layout type', () => {
      expect(getLayoutTypeCount(mockData, 'sections', 'nonexistent')).toBe(0);
    });

    it('should return 0 for non-existent field', () => {
      expect(getLayoutTypeCount({}, 'sections', 'hero')).toBe(0);
    });
  });
});
