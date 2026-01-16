/**
 * Image preprocessing utilities for optimal OCR recognition
 * Includes contrast enhancement, grayscale conversion, and noise reduction
 */

export interface ImagePreprocessingOptions {
  contrast?: boolean;
  grayscale?: boolean;
  threshold?: boolean;
  sharpen?: boolean;
}

/**
 * Convert image to grayscale
 */
function grayscaleImage(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
): void {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    data[i] = gray;
    data[i + 1] = gray;
    data[i + 2] = gray;
  }

  ctx.putImageData(imageData, 0, 0);
}

/**
 * Enhance contrast for better text visibility
 */
function enhanceContrast(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
): void {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  let min = 255,
    max = 0;
  for (let i = 0; i < data.length; i += 4) {
    const gray = data[i];
    if (gray < min) min = gray;
    if (gray > max) max = gray;
  }

  const range = max - min;
  if (range > 0) {
    for (let i = 0; i < data.length; i += 4) {
      const gray = data[i];
      const normalized = Math.round(((gray - min) / range) * 255);
      data[i] = normalized;
      data[i + 1] = normalized;
      data[i + 2] = normalized;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

/**
 * Apply binary threshold to image
 */
function applyThreshold(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  threshold: number = 127
): void {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const gray = data[i];
    const value = gray > threshold ? 255 : 0;
    data[i] = value;
    data[i + 1] = value;
    data[i + 2] = value;
  }

  ctx.putImageData(imageData, 0, 0);
}

/**
 * Sharpen image using kernel convolution
 */
function sharpenImage(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
): void {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const width = canvas.width;
  const height = canvas.height;

  // Sharpen kernel
  const kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];

  const output = new Uint8ClampedArray(data);

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let sum = 0;
      let kernelIdx = 0;

      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const idx = ((y + dy) * width + (x + dx)) * 4;
          sum += data[idx] * kernel[kernelIdx++];
        }
      }

      const idx = (y * width + x) * 4;
      output[idx] = Math.min(255, Math.max(0, sum));
      output[idx + 1] = Math.min(255, Math.max(0, sum));
      output[idx + 2] = Math.min(255, Math.max(0, sum));
    }
  }

  imageData.data.set(output);
  ctx.putImageData(imageData, 0, 0);
}

/**
 * Preprocess image for optimal OCR
 */
export function preprocessImage(
  imageSource: string | HTMLImageElement | HTMLCanvasElement,
  options: ImagePreprocessingOptions = {
    contrast: true,
    grayscale: true,
    sharpen: true,
  }
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Failed to get canvas context'));
      return;
    }

    const processImage = () => {
      // Apply preprocessing filters
      if (options.grayscale) {
        grayscaleImage(canvas, ctx);
      }

      if (options.contrast) {
        enhanceContrast(canvas, ctx);
      }

      if (options.sharpen) {
        sharpenImage(canvas, ctx);
      }

      if (options.threshold) {
        applyThreshold(canvas, ctx);
      }

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert canvas to blob'));
          }
        },
        'image/png',
        0.95
      );
    };

    if (typeof imageSource === 'string') {
      // Base64 string or URL
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        processImage();
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = imageSource;
    } else if (imageSource instanceof HTMLImageElement) {
      canvas.width = imageSource.width;
      canvas.height = imageSource.height;
      ctx.drawImage(imageSource, 0, 0);
      processImage();
    } else if (imageSource instanceof HTMLCanvasElement) {
      canvas.width = imageSource.width;
      canvas.height = imageSource.height;
      ctx.drawImage(imageSource, 0, 0);
      processImage();
    } else {
      reject(new Error('Invalid image source'));
    }
  });
}

/**
 * Upscale image for better OCR accuracy
 */
export function upscaleImage(
  imageSource: string | HTMLImageElement,
  scale: number = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      // Use higher quality interpolation
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      resolve(canvas.toDataURL('image/jpeg', 0.95));
    };
    img.onerror = () => reject(new Error('Failed to load image'));

    if (typeof imageSource === 'string') {
      img.src = imageSource;
    } else {
      img.src = imageSource.src;
    }
  });
}

/**
 * Rotate image to correct orientation
 */
export function rotateImage(
  imageSource: string,
  degrees: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Calculate new dimensions after rotation
      const radians = (degrees * Math.PI) / 180;
      const width = img.width;
      const height = img.height;

      canvas.width = Math.abs(width * Math.cos(radians)) + Math.abs(height * Math.sin(radians));
      canvas.height = Math.abs(width * Math.sin(radians)) + Math.abs(height * Math.cos(radians));

      // Translate and rotate
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(radians);
      ctx.drawImage(img, -width / 2, -height / 2);

      resolve(canvas.toDataURL('image/jpeg', 0.95));
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageSource;
  });
}

/**
 * Full preprocessing pipeline with upscaling
 */
export async function fullPreprocessPipeline(
  imageSource: string
): Promise<string> {
  try {
    // Step 1: Upscale for better OCR
    const upscaled = await upscaleImage(imageSource, 2);

    // Step 2: Apply preprocessing
    const blob = await preprocessImage(upscaled);

    // Convert back to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = () => reject(new Error('Failed to read blob'));
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Preprocessing pipeline error:', error);
    throw error;
  }
}
