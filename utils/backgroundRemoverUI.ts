/**
 * Background Remover UI Utilities
 * Helpers for displaying images with removed backgrounds
 */

/**
 * Create a preview URL with checkerboard pattern background
 * Useful for visualizing transparency
 */
export const createTransparencyPreview = (blob: Blob, width: number = 400, height: number = 400): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Draw checkerboard pattern
        const squareSize = 10;
        for (let y = 0; y < height; y += squareSize) {
          for (let x = 0; x < width; x += squareSize) {
            if ((x / squareSize + y / squareSize) % 2 === 0) {
              ctx.fillStyle = '#f0f0f0';
            } else {
              ctx.fillStyle = '#ffffff';
            }
            ctx.fillRect(x, y, squareSize, squareSize);
          }
        }

        // Draw the image in the center
        const scale = Math.min(width / img.width, height / img.height);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const x = (width - scaledWidth) / 2;
        const y = (height - scaledHeight) / 2;

        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(blob);
  });
};

/**
 * Get image statistics for quality assessment
 */
export const getImageStats = (blob: Blob): Promise<{
  size: string;
  transparency: number;
  estimatedQuality: 'high' | 'medium' | 'low';
}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        let transparentPixels = 0;
        for (let i = 3; i < data.length; i += 4) {
          if (data[i] < 128) {
            transparentPixels++;
          }
        }

        const transparencyPercent = (transparentPixels / (data.length / 4)) * 100;
        const sizeInKB = (blob.size / 1024).toFixed(2);

        let quality: 'high' | 'medium' | 'low' = 'medium';
        if (transparencyPercent > 80) {
          quality = 'high'; // Most background removed
        } else if (transparencyPercent < 20) {
          quality = 'low'; // Little background removed
        }

        resolve({
          size: `${sizeInKB} KB`,
          transparency: Math.round(transparencyPercent),
          estimatedQuality: quality
        });
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(blob);
  });
};

/**
 * Compare two images side by side
 */
export const createComparison = (
  original: Blob,
  processed: Blob,
  width: number = 400,
  height: number = 300
): Promise<{ original: string; processed: string }> => {
  return new Promise((resolve, reject) => {
    const readFile = (blob: Blob): Promise<string> => {
      return new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload = (e) => res(e.target?.result as string);
        reader.onerror = () => rej(new Error('Failed to read blob'));
        reader.readAsDataURL(blob);
      });
    };

    Promise.all([readFile(original), readFile(processed)])
      .then(([origUrl, procUrl]) => {
        const createPreview = (url: string): Promise<string> => {
          return new Promise((res, rej) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');

              if (!ctx) {
                rej(new Error('Could not get canvas context'));
                return;
              }

              const scale = Math.min(width / img.width, height / img.height);
              const scaledWidth = img.width * scale;
              const scaledHeight = img.height * scale;
              const x = (width - scaledWidth) / 2;
              const y = (height - scaledHeight) / 2;

              ctx.fillStyle = '#ffffff';
              ctx.fillRect(0, 0, width, height);
              ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

              res(canvas.toDataURL('image/png'));
            };
            img.onerror = () => rej(new Error('Failed to load image'));
            img.src = url;
          });
        };

        Promise.all([createPreview(origUrl), createPreview(procUrl)])
          .then(([orig, proc]) => resolve({ original: orig, processed: proc }))
          .catch(reject);
      })
      .catch(reject);
  });
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Calculate compression ratio
 */
export const getCompressionRatio = (original: Blob, processed: Blob): number => {
  const ratio = (processed.size / original.size) * 100;
  return Math.round(ratio);
};
