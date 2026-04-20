const RESERVED_SLUGS = new Set([
  "api",
  "admin",
  "sites",
  "builder",
  "sign-in",
  "sign-up",
  "www",
  "app",
  "dashboard",
  "media",
  "analytics",
  "settings",
  "account",
  "help",
  "support",
  "pricing",
  "blog",
]);

const SLUG_REGEX = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;

/**
 * Validates a site slug. Returns an error message string if invalid, or null if valid.
 */
export function validateSlug(slug: string): string | null {
  if (!slug) {
    return "Slug is required";
  }
  if (slug.length < 3) {
    return "Slug must be at least 3 characters";
  }
  if (slug.length > 50) {
    return "Slug must be 50 characters or less";
  }
  if (!SLUG_REGEX.test(slug)) {
    return "Slug must contain only lowercase letters, numbers, and hyphens, and cannot start or end with a hyphen";
  }
  if (slug.includes("--")) {
    return "Slug cannot contain consecutive hyphens";
  }
  if (RESERVED_SLUGS.has(slug)) {
    return `"${slug}" is a reserved name and cannot be used`;
  }
  return null;
}
