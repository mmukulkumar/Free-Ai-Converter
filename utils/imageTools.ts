/**
 * Image Tools Utility
 * Provides resize, rotate, flip, and watermark functionality
 * All processing done client-side using Canvas API
 */

export interface ResizeOptions {
  width: number;
  height: number;
  maintainAspect: boolean;
  fit: 'contain' | 'cover' | 'fill';
}

export interface RotateOptions {
  degrees: 0 | 90 | 180 | 270;
}

export interface FlipOptions {
  horizontal: boolean;
  vertical: boolean;
}

export interface WatermarkOptions {
  text: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  fontSize: number;
  opacity: number;
  color: string;
}

export interface CropOptions {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Load image from file into HTMLImageElement
 */
const loadImage = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Get output MIME type based on original file
 */
const getOutputMime = (file: File): string => {
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (ext === 'png') return 'image/png';
  if (ext === 'webp') return 'image/webp';
  return 'image/jpeg';
};

/**
 * Resize an image to specified dimensions
 */
export const resizeImage = async (
  file: File,
  options: ResizeOptions
): Promise<Blob> => {
  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) throw new Error('Canvas context unavailable');

  let targetWidth = options.width;
  let targetHeight = options.height;

  if (options.maintainAspect) {
    const aspectRatio = img.width / img.height;
    
    if (options.fit === 'contain') {
      // Fit within dimensions, maintaining aspect ratio
      if (targetWidth / targetHeight > aspectRatio) {
        targetWidth = Math.round(targetHeight * aspectRatio);
      } else {
        targetHeight = Math.round(targetWidth / aspectRatio);
      }
    } else if (options.fit === 'cover') {
      // Cover dimensions, may crop
      if (targetWidth / targetHeight < aspectRatio) {
        targetWidth = Math.round(targetHeight * aspectRatio);
      } else {
        targetHeight = Math.round(targetWidth / aspectRatio);
      }
    }
  }

  canvas.width = targetWidth;
  canvas.height = targetHeight;

  // High quality scaling
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to create resized image'));
      },
      getOutputMime(file),
      0.92
    );
  });
};

/**
 * Rotate an image by specified degrees
 */
export const rotateImage = async (
  file: File,
  options: RotateOptions
): Promise<Blob> => {
  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) throw new Error('Canvas context unavailable');

  const radians = (options.degrees * Math.PI) / 180;
  
  // Swap dimensions for 90 or 270 degree rotations
  if (options.degrees === 90 || options.degrees === 270) {
    canvas.width = img.height;
    canvas.height = img.width;
  } else {
    canvas.width = img.width;
    canvas.height = img.height;
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Move to center, rotate, then draw
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(radians);
  ctx.drawImage(img, -img.width / 2, -img.height / 2);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to rotate image'));
      },
      getOutputMime(file),
      0.92
    );
  });
};

/**
 * Flip an image horizontally or vertically
 */
export const flipImage = async (
  file: File,
  options: FlipOptions
): Promise<Blob> => {
  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) throw new Error('Canvas context unavailable');

  canvas.width = img.width;
  canvas.height = img.height;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Apply flips
  const scaleX = options.horizontal ? -1 : 1;
  const scaleY = options.vertical ? -1 : 1;
  
  ctx.translate(
    options.horizontal ? canvas.width : 0,
    options.vertical ? canvas.height : 0
  );
  ctx.scale(scaleX, scaleY);
  ctx.drawImage(img, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to flip image'));
      },
      getOutputMime(file),
      0.92
    );
  });
};

/**
 * Add text watermark to an image
 */
export const addWatermark = async (
  file: File,
  options: WatermarkOptions
): Promise<Blob> => {
  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) throw new Error('Canvas context unavailable');

  canvas.width = img.width;
  canvas.height = img.height;

  // Draw original image
  ctx.drawImage(img, 0, 0);

  // Configure watermark text
  const fontSize = options.fontSize || Math.max(20, Math.min(img.width, img.height) / 20);
  ctx.font = `bold ${fontSize}px Arial, sans-serif`;
  ctx.fillStyle = options.color || 'rgba(255, 255, 255, 0.5)';
  ctx.globalAlpha = options.opacity || 0.5;

  // Measure text
  const metrics = ctx.measureText(options.text);
  const textWidth = metrics.width;
  const textHeight = fontSize;

  // Calculate position
  const padding = fontSize / 2;
  let x = padding;
  let y = textHeight + padding;

  switch (options.position) {
    case 'top-right':
      x = canvas.width - textWidth - padding;
      y = textHeight + padding;
      break;
    case 'bottom-left':
      x = padding;
      y = canvas.height - padding;
      break;
    case 'bottom-right':
      x = canvas.width - textWidth - padding;
      y = canvas.height - padding;
      break;
    case 'center':
      x = (canvas.width - textWidth) / 2;
      y = (canvas.height + textHeight) / 2;
      break;
    default: // top-left
      break;
  }

  // Draw text shadow for visibility
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  // Draw watermark text
  ctx.fillText(options.text, x, y);

  // Reset alpha
  ctx.globalAlpha = 1;

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to add watermark'));
      },
      getOutputMime(file),
      0.92
    );
  });
};

/**
 * Crop an image to specified region
 */
export const cropImage = async (
  file: File,
  options: CropOptions
): Promise<Blob> => {
  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) throw new Error('Canvas context unavailable');

  // Validate crop dimensions
  const cropX = Math.max(0, Math.min(options.x, img.width));
  const cropY = Math.max(0, Math.min(options.y, img.height));
  const cropWidth = Math.min(options.width, img.width - cropX);
  const cropHeight = Math.min(options.height, img.height - cropY);

  canvas.width = cropWidth;
  canvas.height = cropHeight;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Draw cropped region
  ctx.drawImage(
    img,
    cropX, cropY, cropWidth, cropHeight,  // Source
    0, 0, cropWidth, cropHeight            // Destination
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to crop image'));
      },
      getOutputMime(file),
      0.92
    );
  });
};

/**
 * Extract dominant colors from an image (color palette)
 */
export const extractColorPalette = async (
  file: File,
  colorCount: number = 5
): Promise<string[]> => {
  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) throw new Error('Canvas context unavailable');

  // Use smaller canvas for faster processing
  const scale = Math.min(1, 100 / Math.max(img.width, img.height));
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Simple color quantization
  const colorMap = new Map<string, number>();
  
  for (let i = 0; i < data.length; i += 4) {
    // Quantize to reduce colors (round to nearest 32)
    const r = Math.round(data[i] / 32) * 32;
    const g = Math.round(data[i + 1] / 32) * 32;
    const b = Math.round(data[i + 2] / 32) * 32;
    
    const key = `${r},${g},${b}`;
    colorMap.set(key, (colorMap.get(key) || 0) + 1);
  }

  // Sort by frequency and get top colors
  const sortedColors = Array.from(colorMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, colorCount)
    .map(([color]) => {
      const [r, g, b] = color.split(',').map(Number);
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    });

  return sortedColors;
};

/**
 * Convert image to grayscale
 */
export const convertToGrayscale = async (file: File): Promise<Blob> => {
  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) throw new Error('Canvas context unavailable');

  canvas.width = img.width;
  canvas.height = img.height;

  ctx.filter = 'grayscale(100%)';
  ctx.drawImage(img, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to convert to grayscale'));
      },
      getOutputMime(file),
      0.92
    );
  });
};

/**
 * Adjust image brightness and contrast
 */
export const adjustBrightnessContrast = async (
  file: File,
  brightness: number = 100, // 0-200, 100 = normal
  contrast: number = 100    // 0-200, 100 = normal
): Promise<Blob> => {
  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) throw new Error('Canvas context unavailable');

  canvas.width = img.width;
  canvas.height = img.height;

  ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
  ctx.drawImage(img, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to adjust brightness/contrast'));
      },
      getOutputMime(file),
      0.92
    );
  });
};
