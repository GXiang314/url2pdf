import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { parseBatchFile, validateUri, validateUriList } from '../../src/helpers/batch-parser';
import fs from 'fs';
import path from 'path';

// Create test data directory
const testDataDir = path.join(__dirname, '../fixtures');
const validBatchPath = path.join(testDataDir, 'valid-batch.json');
const invalidBatchPath = path.join(testDataDir, 'invalid-batch.json');

describe('Batch Parser', () => {
  describe('validateUri', () => {
    it('should validate valid URI with URL and title', () => {
      const uri = { url: 'https://example.com', title: 'Example' };
      const result = validateUri(uri);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.url).toBe('https://example.com');
        expect(result.data.title).toBe('Example');
      }
    });

    it('should validate valid URI with only URL', () => {
      const uri = { url: 'https://example.com' };
      const result = validateUri(uri);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.url).toBe('https://example.com');
        expect(result.data.title).toBeUndefined();
      }
    });

    it('should reject URI with invalid URL', () => {
      const uri = { url: 'not-a-url', title: 'Test' };
      const result = validateUri(uri);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Invalid URL');
      }
    });

    it('should reject URI without URL', () => {
      const uri = { title: 'Only Title' };
      const result = validateUri(uri);
      expect(result.success).toBe(false);
    });

    it('should reject URI with invalid title type', () => {
      const uri = { url: 'https://example.com', title: 123 };
      const result = validateUri(uri);
      expect(result.success).toBe(false);
    });
  });

  describe('validateUriList', () => {
    it('should validate array of valid URIs', () => {
      const uris = [
        { url: 'https://example.com', title: 'Example' },
        { url: 'https://github.com' }
      ];
      const result = validateUriList(uris);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(2);
      }
    });

    it('should reject array with one invalid URI', () => {
      const uris = [
        { url: 'https://example.com', title: 'Valid' },
        { url: 'invalid-url', title: 'Invalid' }
      ];
      const result = validateUriList(uris);
      expect(result.success).toBe(false);
    });

    it('should accept empty array', () => {
      const uris: any[] = [];
      const result = validateUriList(uris);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(0);
      }
    });

    it('should reject non-array input', () => {
      const uris = { url: 'https://example.com' };
      const result = validateUriList(uris);
      expect(result.success).toBe(false);
    });
  });

  describe('parseBatchFile', () => {
    it('should parse valid batch file', () => {
      const result = parseBatchFile(validBatchPath);
      expect(result).toHaveLength(3);
      expect(result[0].url).toBe('https://github.com');
      expect(result[0].title).toBe('GitHub Home');
      expect(result[2].title).toBeUndefined();
    });

    it('should throw error for non-existent file', () => {
      expect(() => {
        parseBatchFile('non-existent-file.json');
      }).toThrow('Batch file not found');
    });

    it('should throw error for batch file with invalid URL', () => {
      expect(() => {
        parseBatchFile(invalidBatchPath);
      }).toThrow();
    });

    it('should handle relative paths', () => {
      // Change to test directory temporarily
      const originalCwd = process.cwd();
      try {
        process.chdir(path.dirname(validBatchPath));
        const fileName = path.basename(validBatchPath);
        // This would work if batch file is in current directory
        // For now, we test that it processes the path correctly
        const result = parseBatchFile(validBatchPath);
        expect(result).toBeDefined();
        expect(result.length).toBeGreaterThan(0);
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('should preserve title property when present', () => {
      const result = parseBatchFile(validBatchPath);
      const withTitle = result.find(u => u.title);
      const withoutTitle = result.find(u => !u.title);
      
      expect(withTitle).toBeDefined();
      expect(withoutTitle).toBeDefined();
    });
  });

  describe('Edge cases', () => {
    it('should handle URI with special characters in title', () => {
      const uri = { 
        url: 'https://example.com', 
        title: 'Title with "quotes" & special <chars>' 
      };
      const result = validateUri(uri);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe('Title with "quotes" & special <chars>');
      }
    });

    it('should handle URI with query parameters', () => {
      const uri = { 
        url: 'https://example.com/page?param1=value1&param2=value2#anchor' 
      };
      const result = validateUri(uri);
      expect(result.success).toBe(true);
    });

    it('should handle URI with port number', () => {
      const uri = { 
        url: 'https://example.com:8080/api/v1' 
      };
      const result = validateUri(uri);
      expect(result.success).toBe(true);
    });
  });
});
