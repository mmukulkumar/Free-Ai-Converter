/**
 * Document Converter Utility
 * Handles DOCX, PDF, EPUB, and other document conversions
 * All processing done client-side
 */

import mammoth from 'mammoth';
import { jsPDF } from 'jspdf';

// ===== DOCX TO PDF =====

export interface DocxToPdfOptions {
    pageSize?: 'a4' | 'letter';
    orientation?: 'portrait' | 'landscape';
    margin?: number;  // in mm
    fontSize?: number;
}

/**
 * Convert DOCX (Word) to PDF
 * Uses mammoth.js to extract content and jsPDF to generate PDF
 */
export const convertDocxToPdf = async (
    file: File,
    options: DocxToPdfOptions = {}
): Promise<Blob> => {
    try {
        const arrayBuffer = await file.arrayBuffer();

        // Extract HTML from DOCX
        const result = await mammoth.convertToHtml({ arrayBuffer });
        const html = result.value;

        // Parse HTML to extract text and basic structure
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Create PDF
        const pageSize = options.pageSize || 'a4';
        const orientation = options.orientation || 'portrait';
        const margin = options.margin || 20;
        const fontSize = options.fontSize || 12;

        const pdf = new jsPDF({
            orientation: orientation === 'landscape' ? 'l' : 'p',
            unit: 'mm',
            format: pageSize
        });

        // Get page dimensions
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const textWidth = pageWidth - (margin * 2);

        let yPosition = margin;
        const lineHeight = fontSize * 0.4;  // Approximate line height in mm

        // Process each element
        const elements = doc.body.children;

        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const tagName = element.tagName.toLowerCase();
            const text = element.textContent || '';

            if (!text.trim()) continue;

            // Set font based on element type
            if (tagName === 'h1') {
                pdf.setFontSize(24);
                pdf.setFont('helvetica', 'bold');
            } else if (tagName === 'h2') {
                pdf.setFontSize(20);
                pdf.setFont('helvetica', 'bold');
            } else if (tagName === 'h3') {
                pdf.setFontSize(16);
                pdf.setFont('helvetica', 'bold');
            } else if (tagName === 'strong' || tagName === 'b') {
                pdf.setFontSize(fontSize);
                pdf.setFont('helvetica', 'bold');
            } else {
                pdf.setFontSize(fontSize);
                pdf.setFont('helvetica', 'normal');
            }

            // Split text into lines that fit within page width
            const lines = pdf.splitTextToSize(text, textWidth);

            for (const line of lines) {
                // Check if we need a new page
                if (yPosition + lineHeight > pageHeight - margin) {
                    pdf.addPage();
                    yPosition = margin;
                }

                pdf.text(line, margin, yPosition);
                yPosition += lineHeight * 1.5;
            }

            // Add spacing after headers
            if (['h1', 'h2', 'h3'].includes(tagName)) {
                yPosition += lineHeight;
            }
        }

        return pdf.output('blob');
    } catch (error) {
        console.error('DOCX to PDF conversion failed:', error);
        throw new Error('Failed to convert Word document to PDF. Ensure the file is a valid .docx file.');
    }
};

// ===== DOCX TO HTML =====

/**
 * Convert DOCX to HTML
 */
export const convertDocxToHtml = async (file: File): Promise<string> => {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });

        // Wrap in basic HTML document
        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${file.name.replace('.docx', '')}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            color: #333;
        }
        h1, h2, h3 { color: #1a1a2e; }
        p { margin: 1em 0; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f4f4f4; }
        img { max-width: 100%; height: auto; }
    </style>
</head>
<body>
${result.value}
</body>
</html>`.trim();

        return html;
    } catch (error) {
        console.error('DOCX to HTML conversion failed:', error);
        throw new Error('Failed to convert Word document to HTML.');
    }
};

// ===== DOCX TO TEXT =====

/**
 * Extract plain text from DOCX
 */
export const convertDocxToText = async (file: File): Promise<string> => {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value;
    } catch (error) {
        console.error('DOCX to text extraction failed:', error);
        throw new Error('Failed to extract text from Word document.');
    }
};

// ===== PDF TO TEXT (Basic) =====

/**
 * Extract text from PDF (first few pages)
 * Note: For better accuracy, use pdfjs-dist
 */
export const extractPdfText = async (file: File): Promise<string> => {
    try {
        const pdfjsLib = await import('pdfjs-dist');
        const pdfVersion = pdfjsLib.version || '4.0.379';
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfVersion}/pdf.worker.min.js`;

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        let fullText = '';
        const maxPages = Math.min(pdf.numPages, 50);  // Limit to 50 pages

        for (let i = 1; i <= maxPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                .map((item: any) => item.str)
                .join(' ');
            fullText += pageText + '\n\n';
        }

        return fullText.trim();
    } catch (error) {
        console.error('PDF text extraction failed:', error);
        throw new Error('Failed to extract text from PDF.');
    }
};

// ===== TEXT/HTML TO PDF =====

export interface TextToPdfOptions {
    title?: string;
    pageSize?: 'a4' | 'letter';
    fontSize?: number;
    margin?: number;
}

/**
 * Convert plain text to PDF
 */
export const convertTextToPdf = async (
    text: string,
    options: TextToPdfOptions = {}
): Promise<Blob> => {
    const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: options.pageSize || 'a4'
    });

    const margin = options.margin || 20;
    const fontSize = options.fontSize || 12;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const textWidth = pageWidth - (margin * 2);
    const lineHeight = fontSize * 0.4;

    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', 'normal');

    // Add title if provided
    let yPosition = margin;
    if (options.title) {
        pdf.setFontSize(18);
        pdf.setFont('helvetica', 'bold');
        pdf.text(options.title, margin, yPosition);
        yPosition += lineHeight * 3;
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', 'normal');
    }

    // Split text into paragraphs
    const paragraphs = text.split('\n');

    for (const paragraph of paragraphs) {
        if (!paragraph.trim()) {
            yPosition += lineHeight;
            continue;
        }

        const lines = pdf.splitTextToSize(paragraph, textWidth);

        for (const line of lines) {
            if (yPosition + lineHeight > pageHeight - margin) {
                pdf.addPage();
                yPosition = margin;
            }
            pdf.text(line, margin, yPosition);
            yPosition += lineHeight * 1.5;
        }
    }

    return pdf.output('blob');
};

// ===== HTML TO PDF =====

/**
 * Convert HTML string to PDF
 * Uses html2canvas for rendering
 */
export const convertHtmlToPdf = async (
    html: string,
    options: TextToPdfOptions = {}
): Promise<Blob> => {
    try {
        const html2canvas = (await import('html2canvas')).default;

        // Create temporary container
        const container = document.createElement('div');
        container.innerHTML = html;
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.width = '800px';
        container.style.padding = '40px';
        container.style.background = 'white';
        document.body.appendChild(container);

        // Render to canvas
        const canvas = await html2canvas(container, {
            scale: 2,
            useCORS: true,
            logging: false
        });

        document.body.removeChild(container);

        // Create PDF
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const pdf = new jsPDF({
            orientation: canvas.width > canvas.height ? 'l' : 'p',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });

        pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);

        return pdf.output('blob');
    } catch (error) {
        console.error('HTML to PDF conversion failed:', error);
        throw new Error('Failed to convert HTML to PDF.');
    }
};

// ===== EPUB HANDLING =====

/**
 * Create a simple EPUB from text/HTML content
 * Note: This creates a basic EPUB structure
 */
export const createEpub = async (
    content: string,
    metadata: {
        title: string;
        author?: string;
        language?: string;
    }
): Promise<Blob> => {
    // EPUB is essentially a ZIP file with specific structure
    // For simplicity, we'll create a minimal valid EPUB

    const { default: JSZip } = await import('jszip');
    const zip = new JSZip();

    const title = metadata.title || 'Untitled';
    const author = metadata.author || 'Unknown';
    const language = metadata.language || 'en';
    const uid = `urn:uuid:${crypto.randomUUID()}`;

    // mimetype (must be first, uncompressed)
    zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });

    // META-INF/container.xml
    zip.file('META-INF/container.xml', `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`);

    // OEBPS/content.opf
    zip.file('OEBPS/content.opf', `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="uid">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="uid">${uid}</dc:identifier>
    <dc:title>${escapeXml(title)}</dc:title>
    <dc:creator>${escapeXml(author)}</dc:creator>
    <dc:language>${language}</dc:language>
    <meta property="dcterms:modified">${new Date().toISOString().split('.')[0]}Z</meta>
  </metadata>
  <manifest>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
    <item id="chapter1" href="chapter1.xhtml" media-type="application/xhtml+xml"/>
  </manifest>
  <spine>
    <itemref idref="chapter1"/>
  </spine>
</package>`);

    // OEBPS/nav.xhtml
    zip.file('OEBPS/nav.xhtml', `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head>
  <title>Navigation</title>
</head>
<body>
  <nav epub:type="toc">
    <h1>Table of Contents</h1>
    <ol>
      <li><a href="chapter1.xhtml">${escapeXml(title)}</a></li>
    </ol>
  </nav>
</body>
</html>`);

    // OEBPS/chapter1.xhtml
    const isHtml = content.includes('<') && content.includes('>');
    const bodyContent = isHtml ? content : `<p>${content.split('\n').join('</p><p>')}</p>`;

    zip.file('OEBPS/chapter1.xhtml', `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>${escapeXml(title)}</title>
  <style>
    body { font-family: serif; line-height: 1.6; padding: 1em; }
    h1, h2, h3 { font-family: sans-serif; }
    p { margin: 1em 0; }
  </style>
</head>
<body>
  <h1>${escapeXml(title)}</h1>
  ${bodyContent}
</body>
</html>`);

    return await zip.generateAsync({ type: 'blob', mimeType: 'application/epub+zip' });
};

/**
 * Helper to escape XML special characters
 */
function escapeXml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

// ===== PDF TO DOCX (Simulated - Text Extraction) =====

/**
 * Convert PDF to DOCX-like format
 * Note: True PDF to DOCX requires complex layout analysis
 * This extracts text and creates a simple DOCX
 */
export const convertPdfToDocx = async (file: File): Promise<Blob> => {
    // Extract text from PDF
    const text = await extractPdfText(file);

    // Create a simple DOCX from the text
    // DOCX is a ZIP file with XML content
    const { default: JSZip } = await import('jszip');
    const zip = new JSZip();

    // [Content_Types].xml
    zip.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`);

    // _rels/.rels
    zip.file('_rels/.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`);

    // Convert text to DOCX paragraphs
    const paragraphs = text.split('\n\n').map(para =>
        `<w:p><w:r><w:t xml:space="preserve">${escapeXml(para.trim())}</w:t></w:r></w:p>`
    ).join('');

    // word/document.xml
    zip.file('word/document.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${paragraphs}
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/>
    </w:sectPr>
  </w:body>
</w:document>`);

    return await zip.generateAsync({
        type: 'blob',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });
};
