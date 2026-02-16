import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Utility to trigger a file download from a Blob
 */
export function downloadFile(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
  window.URL.revokeObjectURL(url);
}
/**
 * Utility to get the main image URL from a product's image data
 */
export function getProductMainImage(
  images: (string | { url: string })[] | string | { url: string } | undefined,
  fallback: string = "/placeholder-product.png",
): string {
  if (!images) return fallback;

  // Handle array of images
  if (Array.isArray(images) && images.length > 0) {
    const first = images[0];
    if (typeof first === "string") return first;
    return first?.url || fallback;
  }

  // Handle single image object or string
  if (typeof images === "string") return images;
  if (typeof images === "object" && "url" in images) {
    return (images as { url: string }).url;
  }

  return fallback;
}
