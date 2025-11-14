/**
 * Extracts a JSON code block from a Markdown string and parses it.
 * @param {string} markdown - The string containing the Markdown.
 * @returns {T | null} The parsed JSON object or null if parsing fails.
 */
export function parseJsonFromMarkdown<T>(markdown: string): T | null {
  try {
    // Regex to find a JSON code block
    const jsonBlockRegex = /```(json)?\s*([\s\S]*?)\s*```/;
    const match = markdown.match(jsonBlockRegex);

    if (match && match[2]) {
      // If a code block is found, parse its content
      return JSON.parse(match[2]) as T;
    } else {
      // If no block is found, try to parse the whole string as a fallback
      // This handles cases where the API returns raw JSON without the markdown wrapper
      return JSON.parse(markdown.trim()) as T;
    }
  } catch (error) {
    console.error("Failed to parse JSON from string:", markdown, error);
    return null;
  }
}

/**
 * Generates a simple, unique-enough ID for client-side rendering.
 * @returns {string} A unique string ID.
 */
export const generateUniqueId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};


/**
 * Converts a file (like a PDF) to a Base64 encoded data URL.
 * Does not perform compression.
 * @param {File} file The file to convert.
 * @returns {Promise<{ base64: string; url: string; mimeType: string }>}
 */
export const fileToDataUrl = (file: File): Promise<{ base64: string; url: string; mimeType: string }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const url = reader.result as string;
            const base64 = url.split(',')[1];
            resolve({ base64, url, mimeType: file.type });
        };
        reader.onerror = error => reject(error);
    });
};

/**
 * Compresses an image file before converting it to a Base64 encoded data URL.
 * @param {File} file The image file to compress.
 * @param {number} maxWidth The maximum width of the output image.
 * @param {number} quality The quality of the output JPEG image (0 to 1).
 * @returns {Promise<{ base64: string; url: string; mimeType: string }>}
 */
export const compressImage = (file: File, maxWidth: number = 1280, quality: number = 0.8): Promise<{ base64: string; url: string; mimeType: string }> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const scale = maxWidth / img.width;
            const width = scale < 1 ? maxWidth : img.width;
            const height = scale < 1 ? img.height * scale : img.height;
            
            canvas.width = width;
            canvas.height = height;
            
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                return reject(new Error('Could not get canvas context'));
            }
            
            ctx.drawImage(img, 0, 0, width, height);
            
            const url = canvas.toDataURL('image/jpeg', quality);
            const base64 = url.split(',')[1];
            
            URL.revokeObjectURL(img.src);
            resolve({ base64, url, mimeType: 'image/jpeg' });
        };
        img.onerror = (error) => {
            URL.revokeObjectURL(img.src);
            reject(error);
        };
    });
};

const getHashFromString = (seed: string): number => {
    let hash = 0;
    if (!seed || seed.length === 0) seed = 'default-seed';
    for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};


/**
 * Generates a mock, non-financial identifier for the user's treevü card.
 * @param {string} seed - A string to seed the generator (e.g., user ID).
 * @returns {string} A formatted treevü ID string.
 */
export const generateMockTreevuId = (seed: string): string => {
    let hash = getHashFromString(seed);
    const part1 = (Math.abs(hash) % 9000 + 1000).toString();
    
    // Scramble the hash a bit more for the next part
    hash = getHashFromString(part1 + seed);
    const part2 = (Math.abs(hash) % 9000 + 1000).toString();

    return `TVU-XXXX-XXXX-${part2}`;
};

/**
 * Generates a mock "Member Since" year.
 * In a real app, this would parse user.createdAt.
 * @returns {string} A 2-digit year string.
 */
export const getMemberSinceYear = (): string => {
    // For this pilot, we'll use a static year.
    return '24';
};

/**
 * Generates a mock, non-financial card number.
 * @param {string} seed - A string to seed the generator.
 * @returns {string} A formatted card number string.
 */
export const generateMockCardNumber = (seed: string): string => {
    let hash = getHashFromString('card1' + seed);
    const part1 = (Math.abs(hash) % 9000 + 1000).toString();
    hash = getHashFromString('card2' + seed);
    const part2 = (Math.abs(hash) % 9000 + 1000).toString();
    hash = getHashFromString('card3' + seed);
    const part3 = (Math.abs(hash) % 9000 + 1000).toString();
    hash = getHashFromString('card4' + seed);
    const part4 = (Math.abs(hash) % 9000 + 1000).toString();
    return `${part1} ${part2} ${part3} ${part4}`;
};

/**
 * Generates a mock expiry date.
 * @param {string} seed - A string to seed the generator.
 * @returns {string} A formatted MM/YY string.
 */
export const generateMockExpiryDate = (seed: string): string => {
    let hash = getHashFromString('expiry' + seed);
    const month = (Math.abs(hash) % 12 + 1).toString().padStart(2, '0');
    const currentYear = new Date().getFullYear() % 100;
    const year = (currentYear + 2 + (Math.abs(hash) % 4)).toString();
    return `${month}/${year}`;
};

/**
 * Generates a mock CVV.
 * @param {string} seed - A string to seed the generator.
 * @returns {string} A 3-digit string.
 */
export const generateMockCvv = (seed: string): string => {
    let hash = getHashFromString('cvv' + seed);
    return (Math.abs(hash) % 900 + 100).toString();
};

export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  if (!hex) return null;
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

// percent is a value between -100 and 100
export const adjustColor = (hex: string, percent: number): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  let { r, g, b } = rgb;
  const amount = Math.floor(255 * (percent / 100));

  r = Math.max(0, Math.min(255, r + amount));
  g = Math.max(0, Math.min(255, g + amount));
  b = Math.max(0, Math.min(255, b + amount));

  const toHex = (c: number) => `0${c.toString(16)}`.slice(-2);

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export const getContrastColor = (hex: string): string => {
    const rgb = hexToRgb(hex);
    if (!rgb) return '#020617'; // default to dark blue/black
    const { r, g, b } = rgb;
    // Formula from WCAG to determine luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    // Use dark text on light colors, and white text on dark colors
    return luminance > 0.5 ? '#020617' : '#FFFFFF';
};