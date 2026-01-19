/**
 * Background Remover Utility - Optimized Version
 * Simple, effective algorithm for all image types
 * Maintains file size while ensuring accuracy
 */

/**
 * Main function to remove background from an image file
 * Fast and efficient processing
 */
export const removeBackground = async (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const img = new Image();
        img.onload = () => {
          try {
            const result = processImageEfficiently(img);
            result.then(resolve).catch(reject);
          } catch (error) {
            reject(error);
          }
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = event.target?.result as string;
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Advanced background removal - better accuracy
 */
export const removeBackgroundAdvanced = async (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const img = new Image();
        img.onload = () => {
          try {
            const result = processImageAdvancedOptimized(img);
            result.then(resolve).catch(reject);
          } catch (error) {
            reject(error);
          }
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = event.target?.result as string;
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Efficient image processing - optimized for size and speed
 */
const processImageEfficiently = async (img: HTMLImageElement): Promise<Blob> => {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Could not get canvas context');

  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Get background color from edges
  const bgColor = getBackgroundColorSimple(data, canvas.width, canvas.height);

  // Process with simple, effective algorithm
  processPixelsSimple(data, bgColor);

  ctx.putImageData(imageData, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to create blob'));
      },
      'image/png',
      0.9 // PNG quality setting
    );
  });
};

/**
 * Advanced optimized processing
 */
const processImageAdvancedOptimized = async (img: HTMLImageElement): Promise<Blob> => {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Could not get canvas context');

  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Multi-pass processing for better accuracy
  const bgColor = getBackgroundColorSmart(data, canvas.width, canvas.height);
  
  // First pass: identify background
  const threshold = calculateThreshold(data, bgColor);
  processPixelsAdvanced(data, bgColor, threshold);

  // Second pass: smooth edges only (minimal processing)
  smoothEdgesMinimal(data, canvas.width, canvas.height);

  ctx.putImageData(imageData, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to create blob'));
      },
      'image/png',
      0.92
    );
  });
};

/**
 * Get background color - simple version
 * Sample corners and edges
 */
const getBackgroundColorSimple = (
  data: Uint8ClampedArray,
  width: number,
  height: number
): { r: number; g: number; b: number } => {
  // Average of 4 corners
  const getCorner = (idx: number) => ({
    r: data[idx],
    g: data[idx + 1],
    b: data[idx + 2]
  });

  const corners = [
    getCorner(0),
    getCorner((width - 1) * 4),
    getCorner(((height - 1) * width) * 4),
    getCorner(((height - 1) * width + (width - 1)) * 4)
  ];

  return {
    r: Math.round(corners.reduce((sum, c) => sum + c.r, 0) / 4),
    g: Math.round(corners.reduce((sum, c) => sum + c.g, 0) / 4),
    b: Math.round(corners.reduce((sum, c) => sum + c.b, 0) / 4)
  };
};

/**
 * Get background color - smart version
 * Sample edges more thoroughly
 */
const getBackgroundColorSmart = (
  data: Uint8ClampedArray,
  width: number,
  height: number
): { r: number; g: number; b: number } => {
  const borderSize = Math.min(20, Math.max(width, height) / 20);
  const samples: Array<{ r: number; g: number; b: number }> = [];

  // Top edge
  for (let x = 0; x < width; x += Math.ceil(width / 10)) {
    const idx = x * 4;
    samples.push({ r: data[idx], g: data[idx + 1], b: data[idx + 2] });
  }

  // Bottom edge
  for (let x = 0; x < width; x += Math.ceil(width / 10)) {
    const idx = ((height - 1) * width + x) * 4;
    samples.push({ r: data[idx], g: data[idx + 1], b: data[idx + 2] });
  }

  // Left edge
  for (let y = 0; y < height; y += Math.ceil(height / 10)) {
    const idx = (y * width) * 4;
    samples.push({ r: data[idx], g: data[idx + 1], b: data[idx + 2] });
  }

  // Right edge
  for (let y = 0; y < height; y += Math.ceil(height / 10)) {
    const idx = (y * width + (width - 1)) * 4;
    samples.push({ r: data[idx], g: data[idx + 1], b: data[idx + 2] });
  }

  // Return median color
  samples.sort((a, b) => (a.r + a.g + a.b) - (b.r + b.g + b.b));
  const median = samples[Math.floor(samples.length / 2)];

  return median;
};

/**
 * Calculate threshold based on background
 */
const calculateThreshold = (
  data: Uint8ClampedArray,
  bgColor: { r: number; g: number; b: number }
): number => {
  // Check if background is light, dark, or colored
  const brightness = (bgColor.r + bgColor.g + bgColor.b) / 3;
  const colorRange = Math.max(bgColor.r, bgColor.g, bgColor.b) - 
                     Math.min(bgColor.r, bgColor.g, bgColor.b);

  // Adjust threshold based on background characteristics
  if (brightness > 200 || (brightness < 50)) {
    // Light or dark background - strict threshold
    return 50;
  } else if (colorRange < 20) {
    // Gray background - medium threshold
    return 60;
  } else {
    // Colored background - lenient threshold
    return 70;
  }
};

/**
 * Simple pixel processing
 */
const processPixelsSimple = (
  data: Uint8ClampedArray,
  bgColor: { r: number; g: number; b: number }
): void => {
  const threshold = 50; // Fixed threshold for simple mode

  for (let i = 0; i < data.length; i += 4) {
    const distance = colorDistance(
      data[i],
      data[i + 1],
      data[i + 2],
      bgColor.r,
      bgColor.g,
      bgColor.b
    );

    // If color matches background, make transparent
    if (distance < threshold) {
      data[i + 3] = 0; // Transparent
    }
  }
};

/**
 * Advanced pixel processing
 */
const processPixelsAdvanced = (
  data: Uint8ClampedArray,
  bgColor: { r: number; g: number; b: number },
  threshold: number
): void => {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const distance = colorDistance(r, g, b, bgColor.r, bgColor.g, bgColor.b);

    // Calculate alpha based on distance
    if (distance < threshold) {
      data[i + 3] = 0; // Fully transparent
    } else if (distance < threshold + 20) {
      // Blend zone for smoother edges
      data[i + 3] = Math.round(((distance - threshold) / 20) * 255);
    }
    // Otherwise keep original alpha
  }
};

/**
 * Color distance calculation
 */
const colorDistance = (
  r1: number,
  g1: number,
  b1: number,
  r2: number,
  g2: number,
  b2: number
): number => {
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;

  // Euclidean distance
  return Math.sqrt(dr * dr + dg * dg + db * db);
};

/**
 * Minimal edge smoothing - only smooth transparency edges
 */
const smoothEdgesMinimal = (
  data: Uint8ClampedArray,
  width: number,
  height: number
): void => {
  const temp = new Uint8ClampedArray(data.length);

  for (let i = 0; i < data.length; i += 4) {
    temp[i] = data[i];
    temp[i + 1] = data[i + 1];
    temp[i + 2] = data[i + 2];
    temp[i + 3] = data[i + 3];
  }

  // Only smooth edges where alpha changes significantly
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      const alpha = data[idx + 3];

      // Check if this is an edge pixel
      let isEdge = false;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const nIdx = ((y + dy) * width + (x + dx)) * 4;
          if (Math.abs(data[nIdx + 3] - alpha) > 50) {
            isEdge = true;
            break;
          }
        }
        if (isEdge) break;
      }

      // If edge, smooth with neighbors
      if (isEdge && alpha > 0 && alpha < 255) {
        let alphaSum = alpha;
        let count = 1;

        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const nIdx = ((y + dy) * width + (x + dx)) * 4;
            alphaSum += data[nIdx + 3];
            count++;
          }
        }

        temp[idx + 3] = Math.round(alphaSum / count);
      }
    }
  }

  // Copy back
  for (let i = 0; i < data.length; i += 4) {
    data[i + 3] = temp[i + 3];
  }
};

/**
 * Initialize the background removal system
 */
export const initializeBackgroundRemoval = async (): Promise<void> => {
  return Promise.resolve();
};
