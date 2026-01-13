import { describe, it, expect } from 'vitest';
import { titleToFilename, urlToFilename, sanitizeFileName } from '../../src/helpers/filename';

describe('Title Generation', () => {
  describe('sanitizeFileName', () => {
    it('should remove invalid characters', () => {
      const fileName = 'My/File:Name*.pdf';
      const result = sanitizeFileName(fileName);
      expect(result).toBe('My_File_Name_.pdf');
    });

    it('should replace backslashes and forward slashes', () => {
      const fileName = 'path\\to\\file/name';
      const result = sanitizeFileName(fileName);
      expect(result).toBe('path_to_file_name');
    });

    it('should handle all invalid chars together', () => {
      const fileName = 'a\\b/c:d*e?f"g<h>i|j';
      const result = sanitizeFileName(fileName);
      expect(result).toMatch(/^[a-z_]+$/i);
    });

    it('should preserve valid characters', () => {
      const fileName = 'MyFileName123.pdf';
      const result = sanitizeFileName(fileName);
      expect(result).toBe('MyFileName123.pdf');
    });
  });

  describe('urlToFilename', () => {
    it('should convert URL to lowercase filename', () => {
      const url = 'https://GitHub.com/USER/REPO';
      const result = urlToFilename(url);
      expect(result).toBe(url.replace(/[^a-z0-9]/gi, '_').toLowerCase());
    });

    it('should replace special characters with underscores', () => {
      const url = 'https://example.com/path?query=1';
      const result = urlToFilename(url);
      expect(result).not.toContain('.');
      expect(result).not.toContain('?');
      expect(result).toContain('_');
    });

    it('should handle simple URLs', () => {
      const url = 'http://abc.com';
      const result = urlToFilename(url);
      expect(result).toBe('http___abc_com');
    });
  });

  describe('titleToFilename', () => {
    it('should decode HTML entities then sanitize', () => {
      const title = 'Hello &amp; Goodbye &lt;world&gt;';
      const result = titleToFilename(title);
      // &lt; and &gt; become < and > which are invalid chars, so they become _
      expect(result).toBe('Hello & Goodbye _world_');
    });

    it('should handle multiple HTML entities', () => {
      const title = 'Quote: &quot;Hello&quot; &#39;World&#39;';
      const result = titleToFilename(title);
      // &quot; becomes " which is invalid, and : is invalid for filenames
      expect(result).toBe('Quote_ _Hello_ \'World\'');
    });

    it('should replace nbsp with space', () => {
      const title = 'Hello&nbsp;World';
      const result = titleToFilename(title);
      expect(result).toBe('Hello World');
    });

    it('should sanitize after decoding', () => {
      const title = 'File/Name:Test&lt;invalid&gt;';
      const result = titleToFilename(title);
      expect(result).toBe('File_Name_Test_invalid_');
    });

    it('should trim whitespace', () => {
      const title = '  My Title  ';
      const result = titleToFilename(title);
      expect(result).toBe('My Title');
    });

    it('should collapse multiple spaces', () => {
      const title = 'Multiple   Spaces   Here';
      const result = titleToFilename(title);
      expect(result).toBe('Multiple Spaces Here');
    });

    it('should handle real page titles', () => {
      const title = 'GitHub &ndash; Where the world builds software';
      // Note: &ndash; is not explicitly handled but will be replaced by sanitizeFileName
      const result = titleToFilename(title);
      expect(result).not.toContain('<');
      expect(result).not.toContain('>');
    });

    it('should return empty string for empty input', () => {
      const title = '';
      const result = titleToFilename(title);
      expect(result).toBe('');
    });
  });
});
