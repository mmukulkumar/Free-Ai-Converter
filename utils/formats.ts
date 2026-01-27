
import { TabItem } from '../types';

// List of image formats
const FORMATS = [
  '3FR', 'ARW', 'AVIF', 'BMP', 'CR2', 'CRW', 'CUR', 'DCM', 'DCR', 'DDS', 'DNG',
  'ERF', 'EXR', 'FAX', 'FTS', 'G3', 'G4', 'GIF', 'GV', 'HDR', 'HEIC', 'HEIF',
  'HRZ', 'ICO', 'IIQ', 'IPL', 'JBG', 'JBIG', 'JFI', 'JFIF', 'JIF', 'JNX', 'JP2',
  'JPE', 'JPEG', 'JPG', 'JPS', 'K25', 'KDC', 'MAC', 'MAP', 'MEF', 'MNG', 'MRW',
  'MTV', 'NEF', 'NRW', 'ORF', 'OTB', 'PAL', 'PALM', 'PAM', 'PBM', 'PCD', 'PCT',
  'PCX', 'PDB', 'PEF', 'PES', 'PFM', 'PGM', 'PGX', 'PICON', 'PICT', 'PIX',
  'PLASMA', 'PNG', 'PNM', 'PPM', 'PSD', 'PWP', 'RAF', 'RAS', 'RGB', 'RGBA',
  'RGBO', 'RGF', 'RLA', 'RLE', 'RW2', 'SCT', 'SFW', 'SGI', 'SIX', 'SIXEL',
  'SR2', 'SRF', 'SUN', 'SVG', 'TGA', 'TIFF', 'TIM', 'TM2', 'UYVY', 'VIFF',
  'VIPS', 'WBMP', 'WEBP', 'WMZ', 'WPG', 'X3F', 'XBM', 'XC', 'XCF', 'XPM',
  'XV', 'XWD', 'YUV'
];

// 1. Core Tools (Vector/Image specialized)
const CORE_TOOLS: TabItem[] = [
  { id: 'image-compressor', label: 'Image Compressor', category: 'image', isNew: true },
  { id: 'bg-remover', label: 'Background Remover', category: 'image', isNew: true },
  { id: 'image-resizer', label: 'Image Resizer', category: 'image', isNew: true },
  { id: 'image-rotator', label: 'Image Rotator', category: 'image', isNew: true },
  { id: 'image-cropper', label: 'Image Cropper', category: 'image', isNew: true },
  { id: 'image-watermark', label: 'Watermark Tool', category: 'image', isNew: true },
  { id: 'optimizer', label: 'SVG Optimizer', category: 'vector' },
  { id: 'svg-png', label: 'SVG to PNG', category: 'vector' },
  { id: 'png-svg', label: 'PNG to SVG', category: 'vector' }, // Re-categorized to vector as output is vector
  { id: 'jpg-svg', label: 'JPG to SVG', category: 'vector' },
  { id: 'pdf-svg', label: 'PDF to SVG', category: 'vector' },
  { id: 'svg-pdf', label: 'SVG to PDF', category: 'document' },
  { id: 'webp-png', label: 'WEBP to PNG', category: 'image' },
  { id: 'png-webp', label: 'PNG to WEBP', category: 'image', isNew: true },
  { id: 'png-bmp', label: 'PNG to BMP', category: 'image', isNew: true },
  { id: 'heic-jpg', label: 'HEIC to JPG', category: 'image' },
  { id: 'webp-bmp', label: 'WEBP to BMP', category: 'image' },
];

// 2. Extra Tools (Video, Audio, Docs) - Matching the Menu
const EXTRA_TOOLS: TabItem[] = [
  // Video
  { id: 'mp4-mp3', label: 'MP4 to MP3', category: 'audio' },
  { id: 'mov-mp3', label: 'MOV to MP3', category: 'audio' },
  { id: 'mov-mp4', label: 'MOV to MP4', category: 'video' },
  { id: 'mp4-gif', label: 'MP4 to GIF', category: 'video' },
  { id: 'webm-gif', label: 'WEBM to GIF', category: 'video' },

  // Audio
  { id: 'mp3-wav', label: 'MP3 to WAV', category: 'audio' },
  { id: 'wav-mp3', label: 'WAV to MP3', category: 'audio' },
  { id: 'mp3-ogg', label: 'MP3 to OGG', category: 'audio' },

  // Documents
  { id: 'docx-pdf', label: 'Word to PDF', category: 'document' },
  { id: 'pdf-docx', label: 'PDF to Word', category: 'document' },
  { id: 'pdf-epub', label: 'PDF to EPUB', category: 'document' },
  { id: 'epub-pdf', label: 'EPUB to PDF', category: 'document' },
  { id: 'heic-pdf', label: 'HEIC to PDF', category: 'document' },
  { id: 'jpg-pdf', label: 'JPG to PDF', category: 'document' },

  // Other / Image
  { id: 'gif-mp4', label: 'GIF to MP4', category: 'video' },
  { id: 'jpg-gif', label: 'JPG to GIF', category: 'image' },
  { id: 'apng-gif', label: 'APNG to GIF', category: 'image' },
];

const getCategory = (fmt: string): TabItem['category'] => {
  const raw = ['ARW', 'CR2', 'NEF', 'ORF', 'SR2', 'DNG', 'RAF', 'RW2', 'PEF', 'X3F', '3FR'];
  const doc = ['PDF', 'EPS'];
  if (fmt === 'SVG') return 'vector';
  if (raw.includes(fmt)) return 'raw';
  if (doc.includes(fmt)) return 'document';
  return 'image';
};

export const generateTabs = (): TabItem[] => {
  const tabs: TabItem[] = [...CORE_TOOLS, ...EXTRA_TOOLS];

  const existingIds = new Set(tabs.map(t => t.id));

  // Generate [Format] -> JPG and [Format] -> PNG for all formats
  FORMATS.forEach(fmt => {
    const lowerFmt = fmt.toLowerCase();

    // Create 'To JPG' tool
    if (lowerFmt !== 'jpg' && lowerFmt !== 'jpeg') {
      const id = `${lowerFmt}-jpg`;
      if (!existingIds.has(id)) {
        tabs.push({
          id,
          label: `${fmt} to JPG`,
          category: getCategory(fmt)
        });
        existingIds.add(id);
      }
    }

    // Create 'To PNG' tool
    if (lowerFmt !== 'png') {
      const id = `${lowerFmt}-png`;
      if (!existingIds.has(id)) {
        tabs.push({
          id,
          label: `${fmt} to PNG`,
          category: getCategory(fmt)
        });
        existingIds.add(id);
      }
    }
  });

  return tabs.sort((a, b) => {
    // Priority sorting handled by category grouping in UI, but simple sort here
    if (a.id === 'image-compressor') return -1;
    if (a.id === 'bg-remover') return -1;
    if (a.id === 'optimizer') return -1;
    return a.label.localeCompare(b.label);
  });
};

export const ALL_TABS = generateTabs();

// Segregated Menu Definitions
export const MENU_CATEGORIES = [
  {
    title: 'Image',
    items: [
      { label: 'Image Compressor', id: 'image-compressor' },
      { label: 'Background Remover', id: 'bg-remover' },
      { label: 'Image Resizer', id: 'image-resizer' },
      { label: 'Image Rotator', id: 'image-rotator' },
      { label: 'Image Cropper', id: 'image-cropper' },
      { label: 'Watermark Tool', id: 'image-watermark' },
      { label: 'PNG to WEBP', id: 'png-webp' },
      { label: 'PNG to BMP', id: 'png-bmp' },
      { label: 'HEIC to JPG', id: 'heic-jpg' },
      { label: 'WEBP to PNG', id: 'webp-png' },
      { label: 'WEBP to BMP', id: 'webp-bmp' },
      { label: 'PNG to JPG', id: 'png-jpg' },
      { label: 'JPG to PNG', id: 'jpg-png' },
      { label: 'BMP to JPG', id: 'bmp-jpg' },
      { label: 'TIFF to JPG', id: 'tiff-jpg' },
    ]
  },
  {
    title: 'Vector',
    items: [
      { label: 'SVG Optimizer', id: 'optimizer' },
      { label: 'SVG to PNG', id: 'svg-png' },
      { label: 'PNG to SVG', id: 'png-svg' },
      { label: 'JPG to SVG', id: 'jpg-svg' },
      { label: 'PDF to SVG', id: 'pdf-svg' },
    ]
  },
  {
    title: 'Document',
    items: [
      { label: 'Word to PDF', id: 'docx-pdf' },
      { label: 'PDF to Word', id: 'pdf-docx' },
      { label: 'PDF to JPG', id: 'pdf-jpg' },
      { label: 'JPG to PDF', id: 'jpg-pdf' },
      { label: 'HEIC to PDF', id: 'heic-pdf' },
      { label: 'PDF to EPUB', id: 'pdf-epub' },
    ]
  },
  {
    title: 'Video',
    items: [
      { label: 'MP4 to MP3', id: 'mp4-mp3' },
      { label: 'MOV to MP4', id: 'mov-mp4' },
      { label: 'MP4 to GIF', id: 'mp4-gif' },
      { label: 'GIF to MP4', id: 'gif-mp4' },
      { label: 'WEBM to GIF', id: 'webm-gif' },
    ]
  },
  {
    title: 'Audio',
    items: [
      { label: 'MP3 to WAV', id: 'mp3-wav' },
      { label: 'WAV to MP3', id: 'wav-mp3' },
      { label: 'MP3 to OGG', id: 'mp3-ogg' },
      { label: 'MOV to MP3', id: 'mov-mp3' },
    ]
  },
  {
    title: 'Tools',
    items: [
      { label: 'Image to GIF', id: 'jpg-gif' },
      { label: 'APNG to GIF', id: 'apng-gif' },
    ]
  }
];
