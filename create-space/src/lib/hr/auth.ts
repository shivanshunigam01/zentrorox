import { getAdminToken } from "@/lib/admin/auth";

const HR_TOKEN_KEY = "zv_hr_token";
const HR_USER_KEY = "zv_hr_user";
const HR_ORG_KEY = "zv_hr_org";

export type HrRole = "SUPER_ADMIN" | "HR_ADMIN" | "MANAGER" | "EMPLOYEE";

export type HrUser = {
  id: string;
  organizationId?: string;
  organizationName?: string | null;
  employeeId?: string | null;
  name: string;
  email: string;
  profileImage?: string;
  role: HrRole;
  isActive?: boolean;
  isPlatform?: boolean;
};

export type HrOrganization = {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  industry?: string;
  email?: string;
  phone?: string;
  website?: string;
  workingHours?: { start: string; end: string };
};

export const getHrToken = () => localStorage.getItem(HR_TOKEN_KEY) || "";
export const getHrUser = (): HrUser | null => {
  try {
    return JSON.parse(localStorage.getItem(HR_USER_KEY) || "null");
  } catch {
    return null;
  }
};
export const getHrOrg = (): HrOrganization | null => {
  try {
    return JSON.parse(localStorage.getItem(HR_ORG_KEY) || "null");
  } catch {
    return null;
  }
};

export const isHrAuthed = () => Boolean(getHrToken());

export const setHrSession = (token: string, user: HrUser, org?: HrOrganization | null) => {
  localStorage.setItem(HR_TOKEN_KEY, token);
  localStorage.setItem(HR_USER_KEY, JSON.stringify(user));
  if (org) localStorage.setItem(HR_ORG_KEY, JSON.stringify(org));
};

export const hrLogout = () => {
  localStorage.removeItem(HR_TOKEN_KEY);
  localStorage.removeItem(HR_USER_KEY);
  localStorage.removeItem(HR_ORG_KEY);
};

export const hrHeaders = (): HeadersInit => {
  const token = getHrToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/** Prefer HR token; fall back to main admin token (sessionStorage) for /admin/hr hub. */
export const hrOrAdminHeaders = (): HeadersInit => {
  const hr = getHrToken();
  if (hr) return hrHeaders();
  const admin = getAdminToken() || "";
  return {
    "Content-Type": "application/json",
    ...(admin ? { Authorization: `Bearer ${admin}` } : {}),
  };
};
