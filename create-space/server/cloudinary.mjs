import crypto from "node:crypto";

export function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

/**
 * Upload base64 data URI or remote URL to Cloudinary (signed upload).
 * @param {{ file: string; folder?: string; resourceType?: 'auto'|'image'|'video' }} opts
 */
export async function uploadToCloudinary({ file, folder = "zentroverse", resourceType = "auto" }) {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;

  if (!cloud || !apiKey || !secret) {
    throw new Error("Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in .env");
  }

  const timestamp = Math.round(Date.now() / 1000);
  const params = { folder, timestamp };
  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  const signature = crypto.createHash("sha1").update(`${toSign}${secret}`).digest("hex");

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", apiKey);
  form.append("timestamp", String(timestamp));
  form.append("signature", signature);
  form.append("folder", folder);

  const endpoint =
    resourceType === "auto"
      ? `https://api.cloudinary.com/v1_1/${cloud}/auto/upload`
      : `https://api.cloudinary.com/v1_1/${cloud}/${resourceType}/upload`;

  const res = await fetch(endpoint, { method: "POST", body: form });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message ?? "Cloudinary upload failed");
  }
  return {
    url: data.secure_url,
    publicId: data.public_id,
    resourceType: data.resource_type,
    format: data.format,
    width: data.width,
    height: data.height,
  };
}
