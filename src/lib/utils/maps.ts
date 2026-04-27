export function googleMapsEmbedUrl(address: string): string | null {
  const trimmed = address.trim();
  if (!trimmed) return null;
  return `https://www.google.com/maps?q=${encodeURIComponent(trimmed)}&output=embed`;
}
