
export type ToolType = string;

export interface OptimizedFile {
  id: string;
  originalName: string;
  originalSize: number;
  optimizedSize: number;
  optimizedContent: string | Blob; // Can be string (SVG) or Blob (Binary for PNG/JPG/PDF)
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'ERROR';
  blobUrl?: string;
  originalBlobUrl?: string; // URL for the original file for comparison
  outputExtension: string;
  rawFile?: File; // Store reference for queue processing
  errorMessage?: string;
}

export interface TabItem {
  id: ToolType;
  label: string;
  isNew?: boolean;
  category?: 'image' | 'document' | 'raw' | 'vector' | 'video' | 'audio' | 'other';
}

export interface PdfPageOptions {
  pageSize: 'a4' | 'letter' | 'original';
  orientation: 'portrait' | 'landscape';
  margin: 'none' | 'small' | 'large'; // none=0, small=10mm, large=25mm
  alignment: 'center' | 'top-left';
  fitToPage: boolean;
}

export interface RasterOptions {
  quality: number; // 0.1 to 1.0
  resize: number; // 0.1 to 1.0 (scale factor)
  grayscale: boolean;
}

// Image Tool Specific Options
export interface ResizeOptions {
  width: number;
  height: number;
  maintainAspect: boolean;
  fit: 'contain' | 'cover' | 'fill';
}

export interface RotateOptions {
  degrees: 0 | 90 | 180 | 270;
}

export interface CropOptions {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WatermarkOptions {
  text: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  fontSize: number;
  opacity: number;
  color: string;
}

export interface ImageToolOptions {
  resize?: ResizeOptions;
  rotate?: RotateOptions;
  crop?: CropOptions;
  watermark?: WatermarkOptions;
}

export interface OptimizerSettings {
  // SVG Specific
  level: 'low' | 'medium' | 'high';
  precision: number;
  removeComments: boolean;
  removeMetadata: boolean; // Applies to both SVG and Raster
  mergePaths: boolean;

  // PDF Specific
  pdfOptions: PdfPageOptions;

  // Raster Specific (JPG, PNG, WEBP)
  rasterOptions: RasterOptions;

  // Image Tool Options (Resize, Rotate, Crop, Watermark)
  imageToolOptions?: ImageToolOptions;
}
