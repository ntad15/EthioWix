import { SiteConfig } from "@/types/site-config";
import fs from "fs";
import path from "path";
import os from "os";

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
  const tmpFile = path.join(os.tmpdir(), `sites-${Date.now()}-${Math.random().toString(36).slice(2)}.json`);
  fs.writeFileSync(tmpFile, JSON.stringify(sites, null, 2));
  fs.renameSync(tmpFile, SITES_FILE);
}

export async function getSitesByUserId(_userId: string): Promise<SiteConfig[]> {
  return Object.values(readSites());
}

export async function getSiteById(id: string): Promise<SiteConfig | null> {
  const sites = readSites();
  return sites[id] ?? null;
}

export async function getSiteBySlug(slug: string): Promise<SiteConfig | null> {
  const sites = readSites();
  return Object.values(sites).find((s) => s.slug === slug) ?? null;
}

export async function saveSite(config: SiteConfig): Promise<SiteConfig> {
  const sites = readSites();
  sites[config.id] = config;
  writeSites(sites);
  return config;
}

export async function deleteSite(id: string): Promise<boolean> {
  const sites = readSites();
  if (sites[id]) {
    delete sites[id];
    writeSites(sites);
    return true;
  }
  return false;
}
