// src/lib/content-utils.ts - Utility functions for blog and gallery content

/**
 * Convert a string to a URL-safe slug
 * @param text - The text to convert to a slug
 * @returns URL-safe slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Generate a unique slug by appending a number if the base slug already exists
 * @param baseSlug - The base slug
 * @param existingSlugs - Array of existing slugs to check against
 * @returns A unique slug
 */
export function generateUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug;
  }

  let counter = 1;
  let uniqueSlug = `${baseSlug}-${counter}`;

  while (existingSlugs.includes(uniqueSlug)) {
    counter++;
    uniqueSlug = `${baseSlug}-${counter}`;
  }

  return uniqueSlug;
}

/**
 * Strip HTML tags from a string
 * @param html - The HTML string to strip
 * @returns Plain text without HTML tags
 */
export function stripHtml(html: string): string {
  if (!html) return "";

  return html
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/&nbsp;/g, " ") // Replace &nbsp; with space
    .replace(/&amp;/g, "&") // Replace &amp; with &
    .replace(/&lt;/g, "<") // Replace &lt; with <
    .replace(/&gt;/g, ">") // Replace &gt; with >
    .replace(/&quot;/g, '"') // Replace &quot; with "
    .replace(/&#39;/g, "'") // Replace &#39; with '
    .replace(/\s+/g, " ") // Collapse multiple spaces
    .trim();
}

/**
 * Calculate estimated reading time for an article
 * @param html - The HTML content of the article
 * @param wordsPerMinute - Average reading speed (default: 200 words per minute)
 * @returns Estimated reading time in minutes
 */
export function calculateReadTime(html: string, wordsPerMinute: number = 200): number {
  if (!html) return 1;

  const plainText = stripHtml(html);
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);

  // Return at least 1 minute
  return Math.max(1, readTime);
}

/**
 * Truncate text to a specified length with ellipsis
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;

  // Find the last space before maxLength to avoid cutting words
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  return (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated) + "...";
}

/**
 * Generate excerpt from HTML content
 * @param html - The HTML content
 * @param maxLength - Maximum length of excerpt (default: 160)
 * @returns Plain text excerpt
 */
export function generateExcerpt(html: string, maxLength: number = 160): string {
  const plainText = stripHtml(html);
  return truncateText(plainText, maxLength);
}

/**
 * Parse tags from JSON string or return empty array
 * @param tagsJson - JSON string of tags
 * @returns Array of tag strings
 */
export function parseTags(tagsJson: string | null | undefined): string[] {
  if (!tagsJson) return [];

  try {
    const parsed = JSON.parse(tagsJson);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Stringify tags array to JSON
 * @param tags - Array of tag strings
 * @returns JSON string
 */
export function stringifyTags(tags: string[]): string {
  return JSON.stringify(tags);
}
