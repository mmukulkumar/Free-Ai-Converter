/**
 * Vectorizer Utility
 * Converts raster images (PNG, JPG) to true SVG vector graphics
 * Uses ImageTracer.js for bitmap-to-vector tracing
 */

// ImageTracer options interface
interface ImageTracerOptions {
    // Path tracing
    ltres?: number;              // Line error threshold (default: 1)
    qtres?: number;              // Quad spline error threshold (default: 1)
    pathomit?: number;           // Omit paths shorter than this (default: 8)

    // Color quantization
    colorsampling?: 0 | 1 | 2;   // 0=disabled, 1=random, 2=deterministic
    numberofcolors?: number;     // Number of colors (default: 16)
    mincolorratio?: number;      // Min color ratio
    colorquantcycles?: number;   // Color quantization cycles

    // Blur
    blurradius?: number;         // Blur radius (0=disabled)
    blurdelta?: number;          // Blur delta

    // SVG rendering
    scale?: number;              // Output scale
    roundcoords?: number;        // Decimal places for coordinates
    viewbox?: boolean;           // Use viewBox instead of width/height
    desc?: boolean;              // Include description
    lcpr?: number;               // Line control point ratio
    qcpr?: number;               // Quad control point ratio

    // Layering
    layering?: 0 | 1;            // 0=sequential, 1=parallel
    strokewidth?: number;        // Stroke width for paths
    linefilter?: boolean;        // Filter out short lines

    // Preset
    preset?: 'default' | 'posterized1' | 'posterized2' | 'posterized3' |
    'curvy' | 'sharp' | 'detailed' | 'smoothed' | 'grayscale' | 'fixedpalette';
}

// Preset configurations for different use cases
const PRESETS: Record<string, ImageTracerOptions> = {
    // Best for logos and icons
    logo: {
        colorsampling: 2,
        numberofcolors: 8,
        blurradius: 0,
        blurdelta: 20,
        ltres: 0.5,
        qtres: 0.5,
        pathomit: 4,
        roundcoords: 1,
        strokewidth: 0
    },

    // Best for detailed illustrations
    detailed: {
        colorsampling: 2,
        numberofcolors: 24,
        blurradius: 0,
        blurdelta: 20,
        ltres: 0.1,
        qtres: 0.1,
        pathomit: 2,
        roundcoords: 2,
        strokewidth: 0
    },

    // Best for photos (creates posterized effect)
    photo: {
        colorsampling: 2,
        numberofcolors: 32,
        blurradius: 2,
        blurdelta: 64,
        ltres: 1,
        qtres: 1,
        pathomit: 8,
        roundcoords: 1,
        strokewidth: 0
    },

    // Simple black and white
    blackwhite: {
        colorsampling: 0,
        numberofcolors: 2,
        blurradius: 0,
        blurdelta: 20,
        ltres: 0.5,
        qtres: 0.5,
        pathomit: 4,
        roundcoords: 1,
        strokewidth: 0
    },

    // Smooth curves (good for cartoons)
    smooth: {
        colorsampling: 2,
        numberofcolors: 16,
        blurradius: 5,
        blurdelta: 64,
        ltres: 1,
        qtres: 1,
        pathomit: 8,
        roundcoords: 1,
        strokewidth: 0
    }
};

/**
 * Convert a raster image to SVG using color-quantization based tracing
 * This is a custom implementation that works reliably
 */
export const vectorizeImage = async (
    file: File,
    preset: keyof typeof PRESETS = 'logo'
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            try {
                URL.revokeObjectURL(url);

                // Create canvas and draw image
                const canvas = document.createElement('canvas');
                const maxSize = 1000; // Limit size for performance
                let width = img.width;
                let height = img.height;

                if (width > maxSize || height > maxSize) {
                    const ratio = Math.min(maxSize / width, maxSize / height);
                    width = Math.round(width * ratio);
                    height = Math.round(height * ratio);
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Failed to get canvas context'));
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);
                const imageData = ctx.getImageData(0, 0, width, height);

                // Get preset options
                const options = PRESETS[preset] || PRESETS.logo;

                // Trace the image
                const svg = traceImageData(imageData, options);
                resolve(svg);
            } catch (error) {
                reject(new Error('Failed to trace image: ' + (error as Error).message));
            }
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load image for vectorization'));
        };

        img.src = url;
    });
};

/**
 * Core image tracing function
 * Implements a simplified but effective color-quantization based vectorizer
 */
function traceImageData(imageData: ImageData, options: ImageTracerOptions): string {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    const numColors = options.numberofcolors || 16;

    // Step 1: Extract and quantize colors
    const colorMap = quantizeColors(data, numColors);

    // Step 2: Create indexed color array
    const indexed = indexColors(data, colorMap);

    // Step 3: Generate paths for each color layer
    const paths: string[] = [];
    const colors = Object.keys(colorMap);

    for (const colorKey of colors) {
        const color = colorMap[colorKey];
        const layerPaths = traceColorLayer(indexed, width, height, colorKey, color, options);
        if (layerPaths) {
            paths.push(layerPaths);
        }
    }

    // Step 4: Compose SVG
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
<desc>Vectorized with Free AI Converter</desc>
${paths.join('\n')}
</svg>`;

    return svg;
}

/**
 * Quantize image colors using median cut algorithm (simplified)
 */
function quantizeColors(data: Uint8ClampedArray, numColors: number): Record<string, { r: number; g: number; b: number; a: number }> {
    const colorCounts: Record<string, { r: number; g: number; b: number; a: number; count: number }> = {};

    // Sample pixels (step by 4 for performance on large images)
    const step = data.length > 400000 ? 4 : 1;

    for (let i = 0; i < data.length; i += 4 * step) {
        const r = Math.round(data[i] / 16) * 16;
        const g = Math.round(data[i + 1] / 16) * 16;
        const b = Math.round(data[i + 2] / 16) * 16;
        const a = data[i + 3];

        if (a < 128) continue; // Skip transparent pixels

        const key = `${r},${g},${b}`;
        if (colorCounts[key]) {
            colorCounts[key].count++;
        } else {
            colorCounts[key] = { r, g, b, a: 255, count: 1 };
        }
    }

    // Sort by frequency and take top N colors
    const sorted = Object.entries(colorCounts)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, numColors);

    const result: Record<string, { r: number; g: number; b: number; a: number }> = {};
    for (const [key, value] of sorted) {
        result[key] = { r: value.r, g: value.g, b: value.b, a: value.a };
    }

    return result;
}

/**
 * Map each pixel to nearest quantized color
 */
function indexColors(data: Uint8ClampedArray, colorMap: Record<string, { r: number; g: number; b: number; a: number }>): string[] {
    const colors = Object.keys(colorMap);
    const colorValues = Object.values(colorMap);
    const indexed: string[] = [];

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        if (a < 128) {
            indexed.push('transparent');
            continue;
        }

        // Find nearest color
        let minDist = Infinity;
        let nearestKey = colors[0];

        for (let j = 0; j < colorValues.length; j++) {
            const c = colorValues[j];
            const dist = Math.pow(r - c.r, 2) + Math.pow(g - c.g, 2) + Math.pow(b - c.b, 2);
            if (dist < minDist) {
                minDist = dist;
                nearestKey = colors[j];
            }
        }

        indexed.push(nearestKey);
    }

    return indexed;
}

/**
 * Trace paths for a single color layer
 * Uses a simple run-length encoding approach for rectangles
 */
function traceColorLayer(
    indexed: string[],
    width: number,
    height: number,
    colorKey: string,
    color: { r: number; g: number; b: number; a: number },
    options: ImageTracerOptions
): string | null {
    const pathomit = options.pathomit || 8;

    // Create bitmap mask for this color
    const mask: boolean[][] = [];
    for (let y = 0; y < height; y++) {
        mask[y] = [];
        for (let x = 0; x < width; x++) {
            mask[y][x] = indexed[y * width + x] === colorKey;
        }
    }

    // Find contiguous rectangles (simplified path generation)
    const rects: { x: number; y: number; w: number; h: number }[] = [];
    const visited: boolean[][] = Array(height).fill(null).map(() => Array(width).fill(false));

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (mask[y][x] && !visited[y][x]) {
                // Find width of horizontal run
                let w = 0;
                while (x + w < width && mask[y][x + w] && !visited[y][x + w]) {
                    w++;
                }

                // Find height by checking if runs continue vertically
                let h = 1;
                let validHeight = true;
                while (y + h < height && validHeight) {
                    for (let dx = 0; dx < w; dx++) {
                        if (!mask[y + h][x + dx] || visited[y + h][x + dx]) {
                            validHeight = false;
                            break;
                        }
                    }
                    if (validHeight) h++;
                }

                // Mark as visited
                for (let dy = 0; dy < h; dy++) {
                    for (let dx = 0; dx < w; dx++) {
                        visited[y + dy][x + dx] = true;
                    }
                }

                // Only add if area >= pathomit
                if (w * h >= pathomit) {
                    rects.push({ x, y, w, h });
                }
            }
        }
    }

    if (rects.length === 0) return null;

    // Convert rectangles to path
    const pathData = rects.map(r =>
        `M${r.x},${r.y}h${r.w}v${r.h}h${-r.w}z`
    ).join('');

    const fill = `rgb(${color.r},${color.g},${color.b})`;

    return `<path fill="${fill}" d="${pathData}"/>`;
}

/**
 * Vectorize with simple embed fallback (preserves original look)
 */
export const embedImageInSvg = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64 = e.target?.result as string;

            // Get image dimensions
            const img = new Image();
            img.onload = () => {
                const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
  width="${img.width}" height="${img.height}" viewBox="0 0 ${img.width} ${img.height}">
  <image xlink:href="${base64}" width="100%" height="100%"/>
</svg>`;
                resolve(svg);
            };
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = base64;
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
};

/**
 * Get available vectorization presets
 */
export const getVectorizationPresets = () => Object.keys(PRESETS);

/**
 * Vectorize with options for user choice
 */
export const vectorizeWithMode = async (
    file: File,
    mode: 'trace' | 'embed' = 'trace',
    preset: keyof typeof PRESETS = 'logo'
): Promise<string> => {
    if (mode === 'embed') {
        return embedImageInSvg(file);
    }
    return vectorizeImage(file, preset);
};
