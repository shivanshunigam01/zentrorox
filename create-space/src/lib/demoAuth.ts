const USERS_KEY = "zentroverse-demo-users-v2";
const SESSION_KEY = "zentroverse-demo-session";

export type AccountProfile = {
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
};

export type DemoUserStored = AccountProfile & {
  password: string | null;
  authMethod: "password" | "google" | "pending";
  subscriptionPlan?: string;
  /** Last successful Razorpay payment id (demo storage). */
  razorpayPaymentId?: string;
};

export type DemoSession = DemoUserStored;

function normalizeEmail(e: string) {
  return e.trim().toLowerCase();
}

function loadUsers(): DemoUserStored[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as DemoUserStored[];
  } catch {
    return [];
  }
}

function saveUsers(users: DemoUserStored[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function setDemoSession(session: DemoSession) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getDemoSession(): DemoSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DemoSession;
  } catch {
    return null;
  }
}

function isNonEmpty(s: string) {
  return s.trim().length > 0;
}

/** Maps API user JSON to the shape stored in `localStorage` (never stores a password hash). */
export function demoUserFromApiPublic(u: {
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
  authMethod: "password" | "google" | "pending";
}): DemoUserStored {
  return {
    fullName: u.fullName,
    email: normalizeEmail(u.email),
    phoneDialCode: u.phoneDialCode,
    phoneNational: u.phoneNational,
    companyName: u.companyName,
    companyDescription: u.companyDescription,
    country: u.country,
    state: u.state,
    companySize: u.companySize,
    industry: u.industry,
    websiteUrl: u.websiteUrl,
    timezone: u.timezone,
    picture: u.picture,
    password: null,
    authMethod: u.authMethod,
  };
}

/** Upserts one user in the demo store and sets session — used after API register/login. */
export function upsertDemoUserFromApi(user: DemoUserStored): void {
  const email = normalizeEmail(user.email);
  const users = loadUsers();
  const idx = users.findIndex((u) => normalizeEmail(u.email) === email);
  if (idx >= 0) users[idx] = user;
  else users.push(user);
  saveUsers(users);
  setDemoSession(user);
}

export function registerAccount(
  profile: AccountProfile,
  options: { password: string | null; authMethod: "password" | "google" | "pending" },
): { ok: true } | { ok: false; message: string } {
  const email = normalizeEmail(profile.email);
  if (!isNonEmpty(profile.fullName)) return { ok: false, message: "Full name is required." };
  if (!email) return { ok: false, message: "Email is required." };
  if (!isNonEmpty(profile.phoneNational)) return { ok: false, message: "Phone number is required." };
  if (!isNonEmpty(profile.companyName)) return { ok: false, message: "Company name is required." };
  if (!isNonEmpty(profile.companyDescription)) return { ok: false, message: "Company description is required." };
  if (!isNonEmpty(profile.country)) return { ok: false, message: "Country is required." };
  if (!isNonEmpty(profile.state)) return { ok: false, message: "State / region is required." };
  if (!isNonEmpty(profile.companySize)) return { ok: false, message: "Company size is required." };
  if (!isNonEmpty(profile.industry)) return { ok: false, message: "Industry is required." };
  if (!isNonEmpty(profile.websiteUrl)) return { ok: false, message: "Website URL is required." };
  if (!isNonEmpty(profile.timezone)) return { ok: false, message: "Timezone is required." };

  if (options.authMethod === "password") {
    const p = options.password ?? "";
    if (p.length < 6) return { ok: false, message: "Password must be at least 6 characters." };
  }

  const users = loadUsers();
  if (users.some((u) => normalizeEmail(u.email) === email)) {
    return { ok: false, message: "An account with this email already exists." };
  }

  const row: DemoUserStored = {
    ...profile,
    email,
    password: options.authMethod === "google" || options.authMethod === "pending" ? null : options.password,
    authMethod: options.authMethod,
  };
  saveUsers([...users, row]);
  setDemoSession(row);
  return { ok: true };
}

export function saveSelectedPlanForSession(planId: string, razorpayPaymentId?: string): boolean {
  const session = getDemoSession();
  if (!session) return false;
  const email = normalizeEmail(session.email);
  const users = loadUsers();
  const idx = users.findIndex((u) => normalizeEmail(u.email) === email);
  const next: DemoUserStored = {
    ...session,
    subscriptionPlan: planId,
    ...(razorpayPaymentId ? { razorpayPaymentId } : {}),
  };
  if (idx >= 0) {
    users[idx] = {
      ...users[idx],
      subscriptionPlan: planId,
      ...(razorpayPaymentId ? { razorpayPaymentId } : {}),
    };
    saveUsers(users);
  }
  setDemoSession(next);
  return true;
}

export function findStoredUserByEmail(email: string): DemoUserStored | undefined {
  const e = normalizeEmail(email);
  return loadUsers().find((u) => normalizeEmail(u.email) === e);
}

export function loginDemoPassword(
  email: string,
  password: string,
): { ok: true } | { ok: false; message: string } {
  const e = normalizeEmail(email);
  if (!e || !password) return { ok: false, message: "Enter email and password." };
  const users = loadUsers();
  const found = users.find((u) => normalizeEmail(u.email) === e);
  if (!found) return { ok: false, message: "Invalid email or password." };
  if (found.authMethod === "pending") {
    return {
      ok: false,
      message:
        "Your account is pending. An administrator will assign your password — please sign in after you receive access.",
    };
  }
  if (found.authMethod !== "password" || !found.password || found.password !== password) {
    return { ok: false, message: "Invalid email or password." };
  }
  setDemoSession(found);
  return { ok: true };
}
