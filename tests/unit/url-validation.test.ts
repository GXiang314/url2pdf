import { describe, it, expect } from 'vitest';
import { uriInfoSchema } from '../../src/utils/validation';

describe('URL Validation', () => {
  describe('uriInfoSchema - valid URLs', () => {
    it('should validate valid HTTP URL', () => {
      const result = uriInfoSchema.safeParse({ url: 'http://example.com' });
      expect(result.success).toBe(true);
    });

    it('should validate valid HTTPS URL', () => {
      const result = uriInfoSchema.safeParse({ url: 'https://github.com/user/repo' });
      expect(result.success).toBe(true);
    });

    it('should validate complex URL with query parameters', () => {
      const result = uriInfoSchema.safeParse({
        url: 'https://example.com/page?param1=value1&param2=value2#anchor'
      });
      expect(result.success).toBe(true);
    });

    it('should validate URL with port number', () => {
      const result = uriInfoSchema.safeParse({ url: 'https://example.com:8080/api' });
      expect(result.success).toBe(true);
    });

    it('should accept optional title', () => {
      const result = uriInfoSchema.safeParse({
        url: 'https://example.com',
        title: 'Example Site'
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe('Example Site');
      }
    });

    it('should allow missing title', () => {
      const result = uriInfoSchema.safeParse({ url: 'https://example.com' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBeUndefined();
      }
    });
  });

  describe('uriInfoSchema - invalid URLs', () => {
    it('should reject invalid URL without protocol', () => {
      const result = uriInfoSchema.safeParse({ url: 'example.com' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Invalid URL');
      }
    });

    it('should reject empty string', () => {
      const result = uriInfoSchema.safeParse({ url: '' });
      expect(result.success).toBe(false);
    });

    it('should reject malformed URL', () => {
      const result = uriInfoSchema.safeParse({ url: 'http://' });
      expect(result.success).toBe(false);
    });

    it('should reject non-string URL value', () => {
      const result = uriInfoSchema.safeParse({ url: 123 });
      expect(result.success).toBe(false);
    });

    it('should reject missing URL field', () => {
      const result = uriInfoSchema.safeParse({ title: 'Only Title' });
      expect(result.success).toBe(false);
    });

    it('should reject invalid title type', () => {
      const result = uriInfoSchema.safeParse({ 
        url: 'https://example.com', 
        title: 123 
      });
      expect(result.success).toBe(false);
    });
  });
});
