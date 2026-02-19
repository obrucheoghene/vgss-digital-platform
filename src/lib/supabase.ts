// src/lib/supabase.ts - Supabase admin client for server-side operations
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
}

if (!supabaseServiceRoleKey) {
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable");
}

// Admin client with service role key for server-side operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Bucket names
export const BUCKETS = {
  BLOG_IMAGES: "blog-images",
  GALLERY_IMAGES: "gallery-images",
} as const;

export type BucketName = (typeof BUCKETS)[keyof typeof BUCKETS];

/**
 * Get public URL for a file in Supabase Storage
 * @param bucket - The bucket name
 * @param path - The file path within the bucket
 * @returns The public URL for the file
 */
export function getPublicUrl(bucket: BucketName, path: string): string {
  const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Get the path from a full Supabase Storage URL
 * @param url - The full public URL
 * @param bucket - The bucket name
 * @returns The file path within the bucket
 */
export function getPathFromUrl(url: string, bucket: BucketName): string | null {
  const pattern = new RegExp(`/storage/v1/object/public/${bucket}/(.+)$`);
  const match = url.match(pattern);
  return match ? match[1] : null;
}
