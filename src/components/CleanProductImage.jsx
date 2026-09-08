import React, { useState, useEffect } from 'react';

/**
 * CleanProductImage
 * 
 * Auto-cleans solid background colors (black, white, light blue, grey) from product images
 * uploaded via Admin Panel so they float seamlessly inside Apple's #f5f5f7 showcase box,
 * exactly like Apple's official store layout (Image 2).
 */
export default function CleanProductImage({
  src,
  alt = '',
  className = 'max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 select-none',
  containerClassName = 'w-full h-64 sm:h-72 bg-[#f5f5f7] rounded-2xl flex items-center justify-center p-6 overflow-hidden relative mb-5 transition-colors duration-300 group-hover:bg-[#f2f2f4]',
  mixBlend = true,
}) {
  const [processedSrc, setProcessedSrc] = useState(src);
  const [isBlackBg, setIsBlackBg] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (!src) return;

    // Reset state for new src
    setProcessedSrc(src);
    setIsBlackBg(false);

    // If it's a data URL or local svg, try processing
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;

        if (w === 0 || h === 0) return;

        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(img, 0, 0);

        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;

        // Sample corners and borders to check for solid background box
        const samplePoints = [
          [0, 0],
          [w - 1, 0],
          [0, h - 1],
          [w - 1, h - 1],
          [Math.floor(w / 2), 0],
          [0, Math.floor(h / 2)],
          [w - 1, Math.floor(h / 2)],
          [Math.floor(w / 2), h - 1],
        ];

        let bgR = 0, bgG = 0, bgB = 0, validSamples = 0;

        samplePoints.forEach(([x, y]) => {
          const idx = (y * w + x) * 4;
          const alpha = data[idx + 3];
          if (alpha > 200) {
            bgR += data[idx];
            bgG += data[idx + 1];
            bgB += data[idx + 2];
            validSamples++;
          }
        });

        if (validSamples === 0) {
          // Already transparent
          return;
        }

        bgR = Math.round(bgR / validSamples);
        bgG = Math.round(bgG / validSamples);
        bgB = Math.round(bgB / validSamples);

        // Check corner color uniformity (max color difference among corners)
        let maxDiff = 0;
        samplePoints.forEach(([x, y]) => {
          const idx = (y * w + x) * 4;
          if (data[idx + 3] > 200) {
            const diff = Math.abs(data[idx] - bgR) + Math.abs(data[idx + 1] - bgG) + Math.abs(data[idx + 2] - bgB);
            if (diff > maxDiff) maxDiff = diff;
          }
        });

        // Detect if background is solid black or very dark
        const isDark = bgR < 40 && bgG < 40 && bgB < 40;
        if (isDark && isMounted) {
          setIsBlackBg(true);
        }

        // If background color is uniform across all corners (solid background square)
        if (maxDiff < 60) {
          const tolerance = 40;
          let modified = false;

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];

            if (a > 0) {
              const diff = Math.abs(r - bgR) + Math.abs(g - bgG) + Math.abs(b - bgB);
              if (diff <= tolerance) {
                data[i + 3] = 0; // Set alpha to transparent
                modified = true;
              } else if (diff <= tolerance + 25) {
                // Soft edge antialiasing
                const factor = (diff - tolerance) / 25;
                data[i + 3] = Math.round(a * factor);
                modified = true;
              }
            }
          }

          if (modified && isMounted) {
            ctx.putImageData(imgData, 0, 0);
            const dataUrl = canvas.toDataURL('image/png');
            setProcessedSrc(dataUrl);
          }
        }
      } catch (e) {
        // Fallback to original image if CORS or canvas errors occur
      }
    };

    img.onerror = () => {
      // Keep original
    };

    return () => {
      isMounted = false;
    };
  }, [src]);

  return (
    <div className={containerClassName}>
      <img
        src={processedSrc}
        alt={alt}
        className={`${className} ${
          mixBlend && !isBlackBg ? 'mix-blend-multiply' : ''
        }`}
        onError={(e) => {
          if (processedSrc !== src) {
            setProcessedSrc(src);
          }
        }}
      />
    </div>
  );
}
