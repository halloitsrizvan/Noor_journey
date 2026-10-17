/**
 * Cloudinary Direct Upload Service for Noor Journey
 * Configured with Cloud Name: dmr1mvkrt
 * Upload Preset: "noor journey"
 */

export interface CloudinaryUploadResult {
  url: string;
  secureUrl: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
}

const CLOUD_NAME = "dmr1mvkrt";
const PRIMARY_PRESET = "noor journey";
const SECONDARY_PRESET = "noor_journey";

/**
 * Uploads an image file to Cloudinary using unsigned upload.
 */
export async function uploadProfileImageToCloudinary(
  file: File
): Promise<CloudinaryUploadResult> {
  // Validate file
  if (!file) {
    throw new Error("No file provided for upload.");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Please select a valid image file (PNG, JPG, WebP, etc.).");
  }

  // Limit to 10MB
  const maxBytes = 10 * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error("Image file is too large. Maximum allowed size is 10MB.");
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  // Helper to attempt upload with a specific preset
  const attemptUpload = async (preset: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset);

    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    return { status: response.status, data };
  };

  try {
    // Attempt 1: with primary preset
    let res = await attemptUpload(PRIMARY_PRESET);

    // If preset not found or invalid, try secondary preset with underscore
    if (!res.data.secure_url && res.data?.error?.message?.toLowerCase().includes("preset")) {
      res = await attemptUpload(SECONDARY_PRESET);
    }

    if (res.data?.secure_url) {
      return {
        url: res.data.url,
        secureUrl: res.data.secure_url,
        publicId: res.data.public_id,
        width: res.data.width,
        height: res.data.height,
        format: res.data.format,
      };
    }

    const errMsg = res.data?.error?.message || "Failed to upload image to Cloudinary.";
    throw new Error(errMsg);
  } catch (err: any) {
    console.error("Cloudinary upload error:", err);
    throw new Error(err.message || "Failed to upload image. Please check your internet connection.");
  }
}
