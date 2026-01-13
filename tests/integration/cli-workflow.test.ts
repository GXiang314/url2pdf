import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

/**
 * Integration tests for CLI command-line parsing and argument validation.
 * These tests verify that the CLI correctly parses arguments, validates inputs,
 * and displays appropriate error messages without actually generating PDFs.
 */
describe("CLI Workflow Integration Tests", () => {
  const testOutputDir = "test-outputs";
  const distDir = path.resolve("./dist");
  const cliPath = "node dist/cli.js";

  beforeAll(() => {
    // Ensure CLI is built before running integration tests
    if (!fs.existsSync(path.join(distDir, "cli.js"))) {
      console.log("Building CLI for integration tests...");
      try {
        execSync("pnpm build", { stdio: "inherit" });
      } catch (error) {
        throw new Error("CLI build failed. Cannot run integration tests.");
      }
    }

    // Create test output directory
    if (!fs.existsSync(testOutputDir)) {
      fs.mkdirSync(testOutputDir, { recursive: true });
    }
  });

  afterAll(() => {
    // Clean up test output directory
    if (fs.existsSync(testOutputDir)) {
      fs.rmSync(testOutputDir, { recursive: true, force: true });
    }
  });

  describe("Help and Version Commands", () => {
    it("should display version in correct format", () => {
      const output = execSync(`${cliPath} --version`, {
        encoding: "utf8",
      });
      expect(output.trim()).toMatch(/^\d+\.\d+\.\d+$/);
    });

    it("should display help with all CLI options", () => {
      const output = execSync(`${cliPath} --help`, { 
        encoding: "utf8" 
      });
      expect(output).toContain("Usage");
      expect(output).toContain("--url");
      expect(output).toContain("--batch");
      expect(output).toContain("--title");
      expect(output).toContain("--debug");
      expect(output).toContain("CLI tool to convert web pages to PDF");
    });

    it("should display help with -h shorthand", () => {
      const output = execSync(`${cliPath} -h`, { 
        encoding: "utf8" 
      });
      expect(output).toContain("Usage");
    });

    it("should display version with -V shorthand", () => {
      const output = execSync(`${cliPath} -V`, {
        encoding: "utf8",
      });
      expect(output.trim()).toMatch(/^\d+\.\d+\.\d+$/);
    });
  });

  describe("Argument Parsing and Validation", () => {
    it("should reject execution when no options provided", () => {
      expect(() => {
        execSync(cliPath, { 
          encoding: "utf8",
          stdio: "pipe" 
        });
      }).toThrow();
    });

    it("should reject invalid URL format", () => {
      expect(() => {
        execSync(`${cliPath} --url "not a url"`, {
          encoding: "utf8",
          stdio: "pipe",
        });
      }).toThrow();
    });

    it("should reject URL without protocol", () => {
      expect(() => {
        execSync(`${cliPath} --url example.com`, {
          encoding: "utf8",
          stdio: "pipe",
        });
      }).toThrow();
    });

    it("should reject non-existent batch file", () => {
      expect(() => {
        execSync(`${cliPath} --batch non-existent-file.json`, {
          encoding: "utf8",
          stdio: "pipe",
        });
      }).toThrow();
    });

    it("should reject when only --title is provided without --url", () => {
      expect(() => {
        execSync(`${cliPath} --title "Only Title"`, {
          encoding: "utf8",
          stdio: "pipe",
        });
      }).toThrow();
    });

    it("should reject when only --debug is provided without --url or --batch", () => {
      expect(() => {
        execSync(`${cliPath} --debug`, {
          encoding: "utf8",
          stdio: "pipe",
        });
      }).toThrow();
    });
  });

  describe("Batch File Argument Parsing", () => {
    const batchTestFile = path.join(testOutputDir, "batch-test.json");

    it("should reject batch file with invalid JSON syntax", () => {
      fs.writeFileSync(batchTestFile, "{ invalid json }");

      expect(() => {
        execSync(`${cliPath} --batch ${batchTestFile}`, {
          encoding: "utf8",
          stdio: "pipe",
        });
      }).toThrow();
    });

    it("should reject batch file with invalid URL format in array", () => {
      const invalidBatch = [
        { url: "https://example.com", title: "Valid" },
        { url: "not-a-url", title: "Invalid" },
      ];

      fs.writeFileSync(batchTestFile, JSON.stringify(invalidBatch, null, 2));

      expect(() => {
        execSync(`${cliPath} --batch ${batchTestFile}`, {
          encoding: "utf8",
          stdio: "pipe",
        });
      }).toThrow();
    });

    it("should reject batch file missing required url field", () => {
      const invalidBatch = [
        { title: "Missing URL" }
      ];

      fs.writeFileSync(batchTestFile, JSON.stringify(invalidBatch, null, 2));

      expect(() => {
        execSync(`${cliPath} --batch ${batchTestFile}`, {
          encoding: "utf8",
          stdio: "pipe",
        });
      }).toThrow();
    });

    it("should accept batch file with valid format (without generating PDFs)", () => {
      const validBatch = [
        { url: "https://example.com" },
        { url: "https://github.com", title: "GitHub" },
      ];

      fs.writeFileSync(batchTestFile, JSON.stringify(validBatch, null, 2));

      // Test passes if batch file parsing succeeds (we don't test PDF generation)
      // We catch the error because PDF generation may fail, but we verify parsing succeeded
      try {
        execSync(`${cliPath} --batch ${batchTestFile}`, {
          encoding: "utf8",
          timeout: 3000,
        });
      } catch (error: any) {
        // If error message contains "Batch file not found" or "Validation error", parsing failed
        const output = error.stdout || error.stderr || error.message;
        expect(output).not.toContain("Batch file not found");
        expect(output).not.toContain("Invalid URL format");
        // Other errors (network, timeout) are acceptable - parsing succeeded
      }
    });
  });

  describe("CLI Option Combinations", () => {
    it("should parse --url with valid HTTPS URL", () => {
      // We just verify the CLI accepts the arguments, not that PDF is generated
      try {
        execSync(`${cliPath} --url https://example.com`, {
          encoding: "utf8",
          timeout: 3000,
        });
      } catch (error: any) {
        // PDF generation may fail, but verify it's not an argument parsing error
        const output = error.stdout || error.stderr || error.message;
        expect(output).not.toContain("Invalid URL format");
        expect(output).not.toContain("Please provide either --url or --batch");
      }
    });

    it("should parse --url with optional --title", () => {
      try {
        execSync(
          `${cliPath} --url https://example.com --title "My Title"`,
          {
            encoding: "utf8",
            timeout: 3000,
          }
        );
      } catch (error: any) {
        const output = error.stdout || error.stderr || error.message;
        expect(output).not.toContain("Invalid");
        expect(output).not.toContain("Please provide either");
      }
    });

    it("should parse --url with --debug flag", () => {
      try {
        execSync(`${cliPath} --url https://example.com --debug`, {
          encoding: "utf8",
          timeout: 3000,
        });
      } catch (error: any) {
        const output = error.stdout || error.stderr || error.message;
        // Should see "Debug mode enabled" if parsing succeeded
        if (!output.includes("Debug mode enabled")) {
          expect(output).not.toContain("Invalid");
        }
      }
    });

    it("should parse shorthand -u for --url", () => {
      try {
        execSync(`${cliPath} -u https://example.com`, {
          encoding: "utf8",
          timeout: 3000,
        });
      } catch (error: any) {
        const output = error.stdout || error.stderr || error.message;
        expect(output).not.toContain("unknown option");
        expect(output).not.toContain("Invalid URL format");
      }
    });

    it("should parse shorthand -t for --title", () => {
      try {
        execSync(`${cliPath} -u https://example.com -t "Title"`, {
          encoding: "utf8",
          timeout: 3000,
        });
      } catch (error: any) {
        const output = error.stdout || error.stderr || error.message;
        expect(output).not.toContain("unknown option");
      }
    });

    it("should parse shorthand -b for --batch", () => {
      const batchFile = path.join(testOutputDir, "test-shorthand.json");
      fs.writeFileSync(batchFile, JSON.stringify([{ url: "https://example.com" }]));

      try {
        execSync(`${cliPath} -b ${batchFile}`, {
          encoding: "utf8",
          timeout: 3000,
        });
      } catch (error: any) {
        const output = error.stdout || error.stderr || error.message;
        expect(output).not.toContain("unknown option");
        expect(output).not.toContain("Batch file not found");
      }
    });
  });
});
