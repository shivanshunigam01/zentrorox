import { apiUrl } from "@/config/api";

const SESSION_KEY = "zv_admin_session";
const TOKEN_KEY = "zv_admin_token";
const ADMIN_KEY = "zv_admin_profile";

export type AdminProfile = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export function getAdminToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function getAdminProfile(): AdminProfile | null {
  try {
    const raw = sessionStorage.getItem(ADMIN_KEY);
    return raw ? (JSON.parse(raw) as AdminProfile) : null;
  } catch {
    return null;
  }
}

export function adminHeaders(): Record<string, string> {
  const token = getAdminToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export async function adminLoginApi(email: string, password: string): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    const res = await fetch(apiUrl("/api/admin/auth/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = (await res.json().catch(() => ({}))) as { token?: string; admin?: AdminProfile; error?: string };
    if (!res.ok || !data.token) {
      return { ok: false, message: data.error ?? "Invalid email or password." };
    }
    sessionStorage.setItem(SESSION_KEY, "1");
    sessionStorage.setItem(TOKEN_KEY, data.token);
    sessionStorage.setItem(ADMIN_KEY, JSON.stringify(data.admin));
    return { ok: true };
  } catch {
    return { ok: false, message: "Cannot reach the admin API." };
  }
}

export async function fetchAdminMe(): Promise<AdminProfile | null> {
  try {
    const res = await fetch(apiUrl("/api/admin/auth/me"), { headers: adminHeaders() });
    if (!res.ok) return null;
    const data = (await res.json()) as { admin?: AdminProfile };
    return data.admin ?? null;
  } catch {
    return null;
  }
}

export const adminLogout = () => {
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(ADMIN_KEY);
};

export const isAdminAuthed = () => sessionStorage.getItem(SESSION_KEY) === "1" && Boolean(getAdminToken());

/** @deprecated use adminLoginApi */
export const ADMIN_EMAIL = "admin@zentroverse.in";
/** @deprecated */
export const ADMIN_PASSWORD = "Zentro@2026";
/** @deprecated legacy token */
export const ADMIN_TOKEN = "ZV-ADMIN-2026-DEMO";

export const adminLogin = (_email: string, _password: string) => false;
