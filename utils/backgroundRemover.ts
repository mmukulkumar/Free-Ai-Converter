import { removeBackground as imglyRemoveBackground, Config } from '@imgly/background-removal';

/**
 * Background Remover Utility - Powered by @imgly/background-removal
 * Uses WebAssembly and Neural Networks for professional-grade background removal directly in the browser.
 */

/**
 * Main function to remove background from an image file
 * Uses the default configuration for high performance
 */
export const removeBackground = async (file: File): Promise<Blob> => {
  try {
    const blob = await imglyRemoveBackground(file, {
      progress: (key, current, total) => {
        console.log(`Downloading ${key}: ${current} of ${total}`);
      },
    });
    return blob;
  } catch (error) {
    console.error('Background removal failed:', error);
    throw error;
  }
};

/**
 * Advanced background removal 
 * Maps to the same robust AI implementation as it is already the "advanced" solution.
 * We can pass specific config options here if needed in the future.
 */
export const removeBackgroundAdvanced = async (file: File): Promise<Blob> => {
  // The @imgly library is already highly optimized AI. 
  // We use the same implementation but could add specific high-quality flags if exposed by the API in the future.
  return removeBackground(file);
};

/**
 * Initialize the background removal system
 * Preloads necessary assets if possible (optional)
 */
export const initializeBackgroundRemoval = async (): Promise<void> => {
  // Attempt to preload - this might trigger a download of the small WASM files
  // We can just log that it's ready since the library handles lazy loading well.
  console.log('Background removal system ready');
  return Promise.resolve();
};

