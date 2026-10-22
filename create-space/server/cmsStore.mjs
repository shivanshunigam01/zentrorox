import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DEFAULT_CMS } from "./cmsDefaults.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CMS_PATH = path.join(__dirname, "data", "cms.json");

function deepMerge(base, patch) {
  if (patch == null || typeof patch !== "object" || Array.isArray(patch)) return patch ?? base;
  const out = { ...base };
  for (const key of Object.keys(patch)) {
    out[key] = deepMerge(base?.[key], patch[key]);
  }
  return out;
}

export async function readCms() {
  try {
    const raw = await fs.readFile(CMS_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return deepMerge(DEFAULT_CMS, parsed);
  } catch (e) {
    if (e?.code === "ENOENT") {
      await writeCms(DEFAULT_CMS);
      return structuredClone(DEFAULT_CMS);
    }
    throw e;
  }
}

export async function writeCms(data) {
  await fs.mkdir(path.dirname(CMS_PATH), { recursive: true });
  const payload = { ...data, updatedAt: new Date().toISOString() };
  await fs.writeFile(CMS_PATH, JSON.stringify(payload, null, 2), "utf8");
  return payload;
}
