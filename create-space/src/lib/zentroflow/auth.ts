import { apiUrl } from "@/config/api";

const SESSION_KEY = "zf_session";
const TOKEN_KEY = "zf_token";
const USER_KEY = "zf_user";
const TENANT_KEY = "zf_tenant_id";

export type ZfUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  tenant_id: string | null;
  branch_ids: string[];
  status?: string;
};

export function getZfToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function getZfUser(): ZfUser | null {
  try {
    const raw = sessionStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as ZfUser) : null;
  } catch {
    return null;
  }
}

export function getActiveTenantId(): string | null {
  return sessionStorage.getItem(TENANT_KEY) || getZfUser()?.tenant_id || null;
}

export function setActiveTenantId(id: string | null) {
  if (id) sessionStorage.setItem(TENANT_KEY, id);
  else sessionStorage.removeItem(TENANT_KEY);
}

export function zfHeaders(extra?: Record<string, string>): Record<string, string> {
  const token = getZfToken();
  const headers: Record<string, string> = { "Content-Type": "application/json", ...extra };
  if (token) headers.Authorization = `Bearer ${token}`;
  const tenantId = getActiveTenantId();
  if (tenantId) headers["x-tenant-id"] = tenantId;
  return headers;
}

/** Also accept main admin token for super-admin screens inside /admin */
export function zfOrAdminHeaders(): Record<string, string> {
  const zf = getZfToken();
  if (zf) return zfHeaders();
  const adminToken = sessionStorage.getItem("zv_admin_token");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (adminToken) headers.Authorization = `Bearer ${adminToken}`;
  const tenantId = getActiveTenantId();
  if (tenantId) headers["x-tenant-id"] = tenantId;
  return headers;
}

export async function zfLogin(email: string, password: string): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    const res = await fetch(apiUrl("/api/zentroflow/auth/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = (await res.json().catch(() => ({}))) as { token?: string; user?: ZfUser; message?: string; code?: string };
    if (!res.ok || !data.token || !data.user) {
      return { ok: false, message: data.message || "Invalid email or password." };
    }
    sessionStorage.setItem(SESSION_KEY, "1");
    sessionStorage.setItem(TOKEN_KEY, data.token);
    sessionStorage.setItem(USER_KEY, JSON.stringify(data.user));
    if (data.user.tenant_id) setActiveTenantId(data.user.tenant_id);
    return { ok: true };
  } catch {
    return { ok: false, message: "Cannot reach ZentroFlow API." };
  }
}

export function zfLogout() {
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(TENANT_KEY);
}

export function isZfAuthed() {
  return sessionStorage.getItem(SESSION_KEY) === "1" && Boolean(getZfToken());
}

export async function zfFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(apiUrl(path), {
    ...init,
    headers: { ...zfOrAdminHeaders(), ...(init?.headers as Record<string, string> | undefined) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { message?: string }).message || (data as { error?: string }).error || `Request failed (${res.status})`);
  }
  return data as T;
}
