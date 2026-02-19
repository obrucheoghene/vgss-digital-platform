// src/lib/upload.ts - Image upload utilities
import { supabaseAdmin, getPublicUrl, getPathFromUrl, type BucketName } from "./supabase";

// Allowed MIME types for image uploads
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

// Max file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

/**
 * Validate an image file before upload
 * @param file - The file to validate
 * @returns Object with isValid boolean and optional error message
 */
export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  if (!ALLOWED_MIME_TYPES.includes(file.type as typeof ALLOWED_MIME_TYPES[number])) {
    return {
      isValid: false,
      error: `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}`,
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    };
  }

  return { isValid: true };
}

/**
 * Generate a unique filename for upload
 * @param originalName - The original filename
 * @returns A unique filename with timestamp
 */
function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split(".").pop() || "jpg";
  const baseName = originalName.split(".").slice(0, -1).join(".").slice(0, 50);
  // Sanitize filename: remove special chars, replace spaces
  const sanitizedBase = baseName.replace(/[^a-zA-Z0-9-_]/g, "_");
  return `${sanitizedBase}_${timestamp}_${randomString}.${extension}`;
}

/**
 * Upload an image to Supabase Storage
 * @param file - The file to upload
 * @param bucket - The bucket to upload to
 * @param folder - Optional folder path within the bucket
 * @returns UploadResult with success status and URL or error
 */
export async function uploadImage(
  file: File,
  bucket: BucketName,
  folder?: string
): Promise<UploadResult> {
  // Validate file
  const validation = validateImageFile(file);
  if (!validation.isValid) {
    return { success: false, error: validation.error };
  }

  try {
    // Generate unique filename
    const filename = generateUniqueFilename(file.name);
    const path = folder ? `${folder}/${filename}` : filename;

    // Convert File to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(path, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return { success: false, error: error.message };
    }

    // Get public URL
    const url = getPublicUrl(bucket, data.path);

    return {
      success: true,
      url,
      path: data.path,
    };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

/**
 * Delete an image from Supabase Storage
 * @param bucket - The bucket containing the file
 * @param pathOrUrl - The file path or full public URL
 * @returns Object with success status and optional error
 */
export async function deleteImage(
  bucket: BucketName,
  pathOrUrl: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Extract path if a full URL was provided
    let path = pathOrUrl;
    if (pathOrUrl.startsWith("http")) {
      const extractedPath = getPathFromUrl(pathOrUrl, bucket);
      if (!extractedPath) {
        return { success: false, error: "Invalid URL format" };
      }
      path = extractedPath;
    }

    const { error } = await supabaseAdmin.storage.from(bucket).remove([path]);

    if (error) {
      console.error("Supabase delete error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Delete error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Delete failed",
    };
  }
}
