
import { optimizeSVG } from './optimizer';
import { OptimizerSettings } from '../types';
import { jsPDF } from 'jspdf';
import heic2any from 'heic2any';
import * as pdfjsLib from 'pdfjs-dist';
import { removeBackground, removeBackgroundAdvanced, initializeBackgroundRemoval } from './backgroundRemover';

// Initialize PDF.js worker
// We point to the same version as defined in the importmap to avoid version mismatch errors
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://esm.sh/pdfjs-dist@5.4.530/build/pdf.worker.min.js';

// Formats that most modern browsers can decode natively via 'new Image()'
const NATIVE_READ_FORMATS = [
  'png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'ico', 'svg', 'avif'
];

export const convertFile = async (
  file: File, 
  tool: string,
  settings?: OptimizerSettings
): Promise<{ content: string | Blob; extension: string }> => {
  
  const toolParts = tool.split('-');
  const outputFmt = tool === 'optimizer' ? 'svg' : toolParts[toolParts.length - 1];
  const inputFmt = tool === 'optimizer' ? 'svg' : file.name.split('.').pop()?.toLowerCase() || '';

  // --- 0. Background Remover (AI) ---
  if (tool === 'bg-remover') {
      try {
          // Initialize background removal system if not already done
          await initializeBackgroundRemoval();
          
          // Use advanced background removal
          const blob = await removeBackgroundAdvanced(file);
          return { content: blob, extension: 'png' };
      } catch (error) {
          console.error("Background removal failed:", error);
          let errorMsg = "Failed to remove background.";
          
          if (error instanceof Error) {
             errorMsg += ` ${error.message}`;
          }
          throw new Error(errorMsg);
      }
  }

  // --- 0.5 Image Compressor ---
  if (tool === 'image-compressor') {
      let targetExt = inputFmt;
      
      // Handle Raw/HEIC conversion to JPG
      if (['heic', 'heif', 'raw', 'cr2', 'nef', 'arw'].includes(inputFmt)) targetExt = 'jpg';
      
      // Handle GIF: Canvas typically renders the first frame of a GIF. 
      // We convert it to PNG to preserve transparency if it exists, or WEBP if preferred.
      if (inputFmt === 'gif') targetExt = 'png'; 
      
      // Handle BMP: BMP is uncompressed. Converting to JPG yields massive savings.
      if (inputFmt === 'bmp') targetExt = 'jpg'; 

      // Fail-safe: If the target extension isn't a writable web format, default to JPG
      if (!['png', 'jpg', 'jpeg', 'webp'].includes(targetExt)) targetExt = 'jpg';
      
      const mimeType = getMimeType(targetExt);
      const bg = (['jpg', 'jpeg', 'bmp'].includes(targetExt)) ? '#ffffff' : undefined;
      
      // Default Settings
      let currentQuality = settings?.rasterOptions?.quality || 0.8;
      let currentScale = settings?.rasterOptions?.resize || 1;
      const grayscale = settings?.rasterOptions?.grayscale || false;

      // Special handling for HEIC input in compressor
      if (['heic', 'heif'].includes(inputFmt)) {
          return await convertHeic(file, targetExt, settings);
      }
      
      // Initial Attempt
      let bestResult = await convertImageToRaster(
           file, 
           mimeType, 
           targetExt, 
           bg, 
           false,
           { quality: currentQuality, resize: currentScale, grayscale }
      );

      // Smart Compression Loop
      // If the output file is larger than the input, and we are aiming for compression:
      // We reduce quality first, then resolution if needed.
      // NOTE: We only loop if the format is the same (e.g. JPG->JPG). 
      // If we converted BMP->JPG, the size reduction is usually instant, no loop needed.
      
      let attempts = 0;
      const maxAttempts = 6;
      const originalSize = file.size;
      const isFormatSwap = inputFmt !== targetExt;

      while (
          !isFormatSwap && 
          bestResult.content instanceof Blob && 
          bestResult.content.size >= originalSize && 
          attempts < maxAttempts
      ) {
          attempts++;
          
          // Strategy: Drop quality significantly first. If quality is already low, drop resolution.
          if (currentQuality > 0.5) {
              currentQuality -= 0.15;
          } else {
             // If quality is already low, start shrinking dimensions (resolution)
             currentScale *= 0.85; 
          }
          
          // Safety floor for quality
          if (currentQuality < 0.3) currentQuality = 0.3;

          // Re-process
          const nextResult = await convertImageToRaster(
            file, 
            mimeType, 
            targetExt, 
            bg, 
            false,
            { quality: currentQuality, resize: currentScale, grayscale }
          );
          
          // If the new result is smaller than the previous best result, update bestResult.
          if (nextResult.content instanceof Blob && nextResult.content.size < bestResult.content.size) {
              bestResult = nextResult;
          } else {
              break; 
          }
      }

      // FAIL-SAFE:
      // If result is still bigger (rare, but happens with already optimized files), return original
      // Only if formats match.
      if (!isFormatSwap && bestResult.content instanceof Blob && bestResult.content.size >= originalSize) {
           return { content: file, extension: targetExt };
      }

      return bestResult;
  }

  // --- 1. SVG Optimizer (Text -> Text) ---
  if (tool === 'optimizer') {
    const text = await file.text();
    const safeSettings = settings || getDefaultSettings();
    const optimized = optimizeSVG(text, safeSettings);
    return { content: optimized, extension: 'svg' };
  }

  // --- 2. HEIC/HEIF Conversion (HEIC -> JPG/PNG/PDF) ---
  if (inputFmt === 'heic' || inputFmt === 'heif') {
     return await convertHeic(file, outputFmt, settings);
  }

  // --- 3. PDF Generation (Image -> PDF) ---
  if (outputFmt === 'pdf') {
      if (NATIVE_READ_FORMATS.includes(inputFmt) || inputFmt === 'svg') {
          return await convertImageToPdf(file, settings);
      }
      // Fallback for document-to-pdf (simulated)
      return await simulateComplexConversion(file, 'pdf');
  }

  // --- 4. PDF Rasterization (PDF -> JPG/PNG) ---
  if (inputFmt === 'pdf' && ['jpg', 'png', 'webp'].includes(outputFmt)) {
      return await convertPdfToImage(file, outputFmt, settings);
  }

  // --- 5. Vectorization (Raster -> SVG) ---
  if (outputFmt === 'svg' && inputFmt !== 'svg') {
    return await convertImageToSvg(file);
  }

  // --- 6. Raster Conversion (Image -> JPG/PNG/WEBP/BMP) ---
  if (['jpg', 'jpeg', 'png', 'webp', 'bmp', 'gif'].includes(outputFmt)) {
    if (NATIVE_READ_FORMATS.includes(inputFmt)) {
       const mimeType = getMimeType(outputFmt);
       const bg = (['jpg', 'jpeg', 'bmp'].includes(outputFmt)) ? '#ffffff' : undefined;
       
       return await convertImageToRaster(
           file, 
           mimeType, 
           outputFmt, 
           bg, 
           inputFmt === 'svg',
           settings?.rasterOptions
        );
    }
  }

  // --- 7. Media & Document Simulation ---
  return await simulateComplexConversion(file, outputFmt);
};

// --- Helper Functions ---

const getDefaultSettings = (): OptimizerSettings => ({
    level: 'medium', 
    precision: 2, 
    removeComments: true, 
    removeMetadata: true, 
    mergePaths: false,
    pdfOptions: { pageSize: 'a4', orientation: 'portrait', margin: 'none', alignment: 'center', fitToPage: true },
    rasterOptions: { quality: 0.9, resize: 1, grayscale: false }
});

const getMimeType = (ext: string) => {
  switch(ext) {
    case 'jpg': case 'jpeg': return 'image/jpeg';
    case 'png': return 'image/png';
    case 'webp': return 'image/webp';
    case 'bmp': return 'image/bmp';
    case 'gif': return 'image/gif';
    case 'pdf': return 'application/pdf';
    case 'svg': return 'image/svg+xml';
    default: return 'application/octet-stream';
  }
};

/**
 * Converts HEIC/HEIF blobs to standard formats using heic2any
 */
const convertHeic = async (file: File, outputFmt: string, settings?: OptimizerSettings): Promise<{ content: Blob; extension: string }> => {
    try {
        const targetMime = outputFmt === 'png' ? 'image/png' : 'image/jpeg';
        const convertedBlob = await heic2any({
            blob: file,
            toType: targetMime,
            quality: settings?.rasterOptions?.quality || 0.9
        });
        const resultBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;

        if (outputFmt === 'pdf') {
            const ext = targetMime === 'image/png' ? 'png' : 'jpg';
            const tempFile = new File([resultBlob], `temp.${ext}`, { type: targetMime });
            return await convertImageToPdf(tempFile, settings);
        }

        return { content: resultBlob, extension: outputFmt === 'jpg' ? 'jpg' : 'png' };
    } catch (error) {
        console.error("HEIC Conversion failed", error);
        throw new Error("Could not decode HEIC file. Ensure your browser supports it.");
    }
};

/**
 * Converts PDF First Page to Image (JPG/PNG)
 */
const convertPdfToImage = async (file: File, outputFmt: string, settings?: OptimizerSettings): Promise<{ content: Blob; extension: string }> => {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Canvas context unavailable');

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport: viewport }).promise;

        const mime = getMimeType(outputFmt);
        const quality = settings?.rasterOptions?.quality || 0.9;

        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (blob) resolve({ content: blob, extension: outputFmt });
                else reject(new Error('PDF rasterization failed'));
            }, mime, quality);
        });
    } catch (e) {
        console.error(e);
        throw new Error("Failed to convert PDF. Encrypted PDFs are not supported.");
    }
};

/**
 * Converts Image to PDF using jsPDF
 */
const convertImageToPdf = (file: File, settings?: OptimizerSettings): Promise<{ content: Blob; extension: string }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const opts = settings?.pdfOptions || getDefaultSettings().pdfOptions;
                let docWidth: number, docHeight: number;
                let orientation: 'p' | 'l' = opts.orientation === 'landscape' ? 'l' : 'p';
                
                if (opts.pageSize === 'original') {
                    docWidth = img.width;
                    docHeight = img.height;
                    orientation = img.width > img.height ? 'l' : 'p';
                } else {
                    const isPortrait = orientation === 'p';
                    if (opts.pageSize === 'letter') {
                        docWidth = isPortrait ? 215.9 : 279.4;
                        docHeight = isPortrait ? 279.4 : 215.9;
                    } else { // A4
                        docWidth = isPortrait ? 210 : 297;
                        docHeight = isPortrait ? 297 : 210;
                    }
                }

                const unit = opts.pageSize === 'original' ? 'px' : 'mm';
                const pdf = new jsPDF({
                    orientation: orientation,
                    unit: unit,
                    format: opts.pageSize === 'original' ? [docWidth, docHeight] : opts.pageSize
                });

                let margin = 0;
                if (unit === 'mm') {
                    if (opts.margin === 'small') margin = 10;
                    if (opts.margin === 'large') margin = 25;
                }

                const workWidth = docWidth - (margin * 2);
                const workHeight = docHeight - (margin * 2);

                const mmPerPx = 0.264583;
                let effectiveImgW = unit === 'mm' ? img.width * mmPerPx : img.width;
                let effectiveImgH = unit === 'mm' ? img.height * mmPerPx : img.height;

                if (opts.fitToPage || effectiveImgW > workWidth || effectiveImgH > workHeight) {
                    const ratio = Math.min(workWidth / effectiveImgW, workHeight / effectiveImgH);
                    if (opts.fitToPage || ratio < 1) {
                        effectiveImgW *= ratio;
                        effectiveImgH *= ratio;
                    }
                }

                let x = margin + (opts.alignment === 'center' ? (workWidth - effectiveImgW) / 2 : 0);
                let y = margin + (opts.alignment === 'center' ? (workHeight - effectiveImgH) / 2 : 0);

                pdf.addImage(img, 'PNG', x, y, effectiveImgW, effectiveImgH);
                resolve({ content: pdf.output('blob'), extension: 'pdf' });
            };
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    });
};

/**
 * Converts Image to Raster (Canvas based)
 */
const convertImageToRaster = (
  file: File, 
  mimeType: string, 
  extension: string, 
  backgroundColor?: string,
  isSvgInput: boolean = false,
  options?: OptimizerSettings['rasterOptions']
): Promise<{ content: Blob; extension: string }> => {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    
    img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = options?.resize || 1;
        let width = Math.round(img.width * scale);
        let height = Math.round(img.height * scale);

        // Upscale small SVGs for better quality
        if (isSvgInput) {
            const minW = 2400 * scale;
            if (width < minW) {
                const r = minW / width;
                width = minW;
                height = height * r;
            }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('Canvas error')); return; }

        if (options?.grayscale) ctx.filter = 'grayscale(100%)';
        if (backgroundColor) {
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, width, height);
        }
        
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          URL.revokeObjectURL(url);
          if (blob) resolve({ content: blob, extension });
          else reject(new Error('Conversion failed'));
        }, mimeType, options?.quality || 0.9);
    };
    img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error(`Failed to decode file.`));
    };
    img.src = url;
  });
};

const convertImageToSvg = (file: File): Promise<{ content: string; extension: string }> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
          <image href="${base64}" width="100%" height="100%" />
        </svg>`.trim();
      resolve({ content: svg, extension: 'svg' });
    };
    reader.readAsDataURL(file);
  });
};

const simulateComplexConversion = (file: File, outputExt: string): Promise<{ content: Blob; extension: string }> => {
    return new Promise((resolve) => {
        const delay = Math.min(Math.max(file.size / 100000, 1000), 4000); 
        setTimeout(() => {
            console.log(`[Simulation] Converted ${file.name} to ${outputExt}`);
            resolve({ content: file, extension: outputExt });
        }, delay);
    });
};
