import { SiteConfig } from "@/types/site-config";
import fs from "fs";
import path from "path";

// Simple JSON file store for development.
// Replace with Prisma/PostgreSQL for production.

const DATA_DIR = path.join(process.cwd(), ".data");
const SITES_FILE = path.join(DATA_DIR, "sites.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readSites(): Record<string, SiteConfig> {
  ensureDataDir();
  if (!fs.existsSync(SITES_FILE)) {
    return {};
  }
  const raw = fs.readFileSync(SITES_FILE, "utf-8");
  return JSON.parse(raw);
}

function writeSites(sites: Record<string, SiteConfig>) {
  ensureDataDir();
  fs.writeFileSync(SITES_FILE, JSON.stringify(sites, null, 2));
}

export function getAllSites(): SiteConfig[] {
  return Object.values(readSites());
}

export function getSiteById(id: string): SiteConfig | null {
  const sites = readSites();
  return sites[id] ?? null;
}

export function getSiteBySlug(slug: string): SiteConfig | null {
  const sites = readSites();
  return Object.values(sites).find((s) => s.slug === slug) ?? null;
}

export function saveSite(config: SiteConfig): SiteConfig {
  const sites = readSites();
  sites[config.id] = config;
  writeSites(sites);
  return config;
}

export function deleteSite(id: string): boolean {
  const sites = readSites();
  if (sites[id]) {
    delete sites[id];
    writeSites(sites);
    return true;
  }
  return false;
}
