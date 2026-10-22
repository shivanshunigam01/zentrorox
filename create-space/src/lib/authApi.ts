import { apiUrl, API_ROUTES } from "@/config/api";

const JSON_HEADERS = { "Content-Type": "application/json; charset=utf-8" };

export type AuthMethod = "password" | "google" | "pending";

/** Public user returned by `POST /api/auth/register` and `POST /api/auth/login`. */
export type ApiUserPublic = {
  fullName: string;
  email: string;
  phoneDialCode: string;
  phoneNational: string;
  companyName: string;
  companyDescription: string;
  country: string;
  state: string;
  companySize: string;
  industry: string;
  websiteUrl: string;
  timezone: string;
  picture?: string;
  password: null;
  authMethod: AuthMethod;
};

export type RegisterApiBody = {
  fullName: string;
  email: string;
  phoneDialCode: string;
  phoneNational: string;
  companyName: string;
  companyDescription: string;
  country: string;
  state: string;
  companySize: string;
  industry: string;
  websiteUrl: string;
  timezone: string;
  picture?: string;
  authMethod: AuthMethod;
  /** Only used when `authMethod` is `password` (e.g. admin or migration flows). */
  password?: string | null;
};

async function readErrorMessage(res: Response): Promise<string> {
  try {
    const j = (await res.json()) as { error?: string };
    if (j.error && typeof j.error === "string") return j.error;
  } catch {
    /* ignore */
  }
  return res.statusText || "Request failed";
}

export async function fetchAuthExists(
  email: string,
): Promise<{ exists: boolean; authMethod: AuthMethod | null }> {
  const url = `${apiUrl(API_ROUTES.AUTH_EXISTS)}?email=${encodeURIComponent(email)}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(await readErrorMessage(r));
  return (await r.json()) as { exists: boolean; authMethod: AuthMethod | null };
}

export async function fetchAuthProfile(email: string): Promise<ApiUserPublic | null> {
  const url = `${apiUrl(API_ROUTES.AUTH_PROFILE)}?email=${encodeURIComponent(email)}`;
  const r = await fetch(url);
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(await readErrorMessage(r));
  const data = (await r.json()) as { user: ApiUserPublic };
  return data.user;
}

export async function registerAccountApi(body: RegisterApiBody): Promise<ApiUserPublic> {
  const r = await fetch(apiUrl(API_ROUTES.AUTH_REGISTER), {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(await readErrorMessage(r));
  const data = (await r.json()) as { user: ApiUserPublic };
  return data.user;
}

export async function loginPasswordApi(email: string, password: string): Promise<ApiUserPublic> {
  const r = await fetch(apiUrl(API_ROUTES.AUTH_LOGIN), {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ email, password }),
  });
  if (!r.ok) throw new Error(await readErrorMessage(r));
  const data = (await r.json()) as { user: ApiUserPublic };
  return data.user;
}
