export type GoogleJwtUser = {
  name?: string;
  email?: string;
  picture?: string;
};

export function parseGoogleJwtPayload(credential: string): GoogleJwtUser | null {
  try {
    const base64Payload = credential.split(".")[1];
    if (!base64Payload) return null;
    const normalized = base64Payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(normalized);
    return JSON.parse(decoded) as GoogleJwtUser;
  } catch {
    return null;
  }
}
