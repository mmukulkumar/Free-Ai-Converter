
import { OptimizerSettings } from "../types";

/**
 * formatting bytes to human readable string
 */
export const formatBytes = (bytes: number, decimals = 1) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Helper to check if two SVG elements have identical attributes (ignoring 'd')
 */
const areAttributesEqual = (el1: Element, el2: Element): boolean => {
    const attrs1 = el1.attributes;
    const attrs2 = el2.attributes;
    
    // Helper to get attributes except 'd', sorted by name
    const filterD = (attrs: NamedNodeMap) => 
        Array.from(attrs)
            .filter(a => a.name !== 'd')
            .sort((a, b) => a.name.localeCompare(b.name));
    
    const a1 = filterD(attrs1);
    const a2 = filterD(attrs2);

    if (a1.length !== a2.length) return false;

    for (let i = 0; i < a1.length; i++) {
        if (a1[i].name !== a2[i].name || a1[i].value !== a2[i].value) {
            return false;
        }
    }
    return true;
};

/**
 * Parses SVG string, merges adjacent paths with same attributes, returns new SVG string.
 */
const mergeSameAttributesPaths = (svgString: string): string => {
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgString, 'image/svg+xml');
        
        // Check for parse errors
        const error = doc.getElementsByTagName('parsererror');
        if (error.length > 0) return svgString;

        // We check containers that usually hold shapes
        const containers = doc.querySelectorAll('svg, g, defs, symbol, marker, mask, pattern');
        
        containers.forEach(container => {
            let children = Array.from(container.children);
            if (children.length < 2) return;

            // Iterate through children
            for (let i = 0; i < children.length - 1; i++) {
                const current = children[i];
                const next = children[i+1];

                // Check if both are paths
                if (current.tagName === 'path' && next.tagName === 'path') {
                    if (areAttributesEqual(current, next)) {
                        // Merge logic: append d2 to d1
                        const d1 = current.getAttribute('d') || '';
                        const d2 = next.getAttribute('d') || '';
                        current.setAttribute('d', `${d1} ${d2}`);
                        
                        // Remove the next element
                        container.removeChild(next);
                        
                        // Reset list and index to verify the newly merged element against the next one
                        children = Array.from(container.children);
                        i--; 
                    }
                }
            }
        });

        return new XMLSerializer().serializeToString(doc);
    } catch (e) {
        console.warn('Path merge failed', e);
        return svgString;
    }
};

/**
 * A robust client-side SVG optimizer.
 * Supports configurable levels and precision rounding.
 */
export const optimizeSVG = (svgContent: string, settings: OptimizerSettings): string => {
  let result = svgContent;

  // 1. Remove XML declaration & DOCTYPE (Always remove for web use)
  result = result.replace(/<\?xml.*?>/gi, '');
  result = result.replace(/<!DOCTYPE.*?>/gi, '');

  // 2. Remove Comments
  if (settings.removeComments || settings.level !== 'low') {
    result = result.replace(/<!--[\s\S]*?-->/g, '');
  }

  // 3. Remove Metadata (Editor data, sodipodi, inkscape stuff)
  if (settings.removeMetadata || settings.level !== 'low') {
    result = result.replace(/<metadata>[\s\S]*?<\/metadata>/gi, '');
    result = result.replace(/xmlns:[\w]+="[^"]*"/gi, ''); // Remove xmlns:inkscape etc (rough regex)
  }
  
  // 4. Merge Paths (Optional)
  if (settings.mergePaths) {
      result = mergeSameAttributesPaths(result);
  }

  // 5. Numeric Precision Rounding
  // Finds numbers like 10.123456 and rounds them based on precision setting
  if (settings.precision >= 0) {
      const p = settings.precision;
      result = result.replace(/(\d+\.\d+)/g, (match) => {
          const num = parseFloat(match);
          // If precision is 0, round to integer. Else toFixed.
          const rounded = Number(num.toFixed(p));
          return rounded.toString();
      });
  }

  // 6. White Space and Formatting based on Level
  if (settings.level === 'low') {
      // Just simple trim
      result = result.trim();
  } else if (settings.level === 'medium') {
      // Remove newlines and tabs, collapse multiple spaces
      result = result.replace(/\s+/g, ' ');
      result = result.replace(/>\s+</g, '><');
      result = result.trim();
  } else if (settings.level === 'high') {
      // Aggressive: Remove all non-essential whitespace
      result = result.replace(/\s+/g, ' ');
      result = result.replace(/>\s+</g, '><');
      // Remove spaces around attributes (e.g., width = "10" -> width="10")
      result = result.replace(/\s*=\s*/g, '=');
      // Remove space before closing tag
      result = result.replace(/\s+\/>/g, '/>');
      result = result.trim();
  }

  return result;
};

export const calculateSavings = (original: number, optimized: number): string => {
  if (original === 0) return '0%';
  const savings = ((original - optimized) / original) * 100;
  return savings.toFixed(1) + '%';
};
