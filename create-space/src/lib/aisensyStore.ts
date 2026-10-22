// Lightweight per-email mapping of AiSensy business IDs, stored in localStorage.
// Used to fetch the AiSensy business profile after login.

const KEY = "zentro.aisensy.businessByEmail";

type Map = Record<string, string>;

function readMap(): Map {
  if (typeof localStorage === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Map) : {};
  } catch {
    return {};
  }
}

function writeMap(m: Map) {
  if (typeof localStorage === "undefined") return;
  try { localStorage.setItem(KEY, JSON.stringify(m)); } catch { /* ignore */ }
}

export function rememberAisensyBusinessId(email: string, businessId: string) {
  const e = email.trim().toLowerCase();
  if (!e || !businessId) return;
  const m = readMap();
  m[e] = businessId;
  writeMap(m);
}

export function getAisensyBusinessId(email: string): string | null {
  const e = email.trim().toLowerCase();
  if (!e) return null;
  return readMap()[e] ?? null;
}
