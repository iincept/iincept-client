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
  containerClassName = 'w-full h-64 sm:h-72 bg-white rounded-2xl flex items-center justify-center p-6 overflow-hidden relative mb-5 transition-colors duration-300 group-hover:bg-[#f0f0f2]',
  mixBlend = true,
  fallbackSrc = '',
}) {
  const NEUTRAL_PLACEHOLDER = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300" fill="none"><rect width="300" height="300" rx="16" fill="%23f5f5f7"/><path d="M150 120c-16.569 0-30 13.431-30 30s13.431 30 30 30 30-13.431 30-30-13.431-30-30-30z" fill="%23e5e5e7"/></svg>';

  const getSmartFallback = (name, rawSrc) => {
    if (fallbackSrc) return fallbackSrc;
    return NEUTRAL_PLACEHOLDER;
  };

  const sanitizeSrc = (inputSrc) => {
    if (!inputSrc || typeof inputSrc !== 'string' || inputSrc.trim() === '' || inputSrc.includes('undefined') || inputSrc.includes('null')) {
      return getSmartFallback(alt, inputSrc);
    }
    const trimmed = inputSrc.trim();
    if (trimmed.startsWith('uploads/')) {
      return `/${trimmed}`;
    }
    return trimmed;
  };

  const initialSrc = sanitizeSrc(src);
  const [processedSrc, setProcessedSrc] = useState(initialSrc);
  const [isBlackBg, setIsBlackBg] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const currentSrc = sanitizeSrc(src);

    setProcessedSrc(currentSrc);
    setIsBlackBg(false);
    setHasFailed(false);
    setIsLoading(true);

    if (!currentSrc) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = currentSrc;

    img.onload = () => {
      let finalSrc = currentSrc;
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;

        if (w > 0 && h > 0) {
          canvas.width = w;
          canvas.height = h;
          ctx.drawImage(img, 0, 0);

          const imgData = ctx.getImageData(0, 0, w, h);
          const data = imgData.data;

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

          if (validSamples > 0) {
            bgR = Math.round(bgR / validSamples);
            bgG = Math.round(bgG / validSamples);
            bgB = Math.round(bgB / validSamples);

            let maxDiff = 0;
            samplePoints.forEach(([x, y]) => {
              const idx = (y * w + x) * 4;
              if (data[idx + 3] > 200) {
                const diff = Math.abs(data[idx] - bgR) + Math.abs(data[idx + 1] - bgG) + Math.abs(data[idx + 2] - bgB);
                if (diff > maxDiff) maxDiff = diff;
              }
            });

            const isDark = bgR < 40 && bgG < 40 && bgB < 40;
            if (isDark && isMounted) {
              setIsBlackBg(true);
            }

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
                    data[i + 3] = 0;
                    modified = true;
                  } else if (diff <= tolerance + 25) {
                    const factor = (diff - tolerance) / 25;
                    data[i + 3] = Math.round(a * factor);
                    modified = true;
                  }
                }
              }

              if (modified) {
                ctx.putImageData(imgData, 0, 0);
                finalSrc = canvas.toDataURL('image/png');
              }
            }
          }
        }
      } catch (e) {
        // Ignore canvas CORS error
      }

      if (isMounted) {
        setProcessedSrc(finalSrc);
        setIsLoading(false);
      }
    };

    img.onerror = () => {
      if (isMounted) {
        const fb = getSmartFallback(alt, currentSrc);
        if (processedSrc !== fb) {
          setProcessedSrc(fb);
          setHasFailed(true);
        }
        setIsLoading(false);
      }
    };

    return () => {
      isMounted = false;
    };
  }, [src, alt]);

  return (
    <div className={`${containerClassName} relative overflow-hidden`}>
      {isLoading && (
        <div className="absolute inset-0 bg-zinc-100 animate-pulse flex items-center justify-center rounded-2xl z-10" />
      )}
      <img
        src={processedSrc}
        alt={alt}
        onLoad={() => setIsLoading(false)}
        className={`${className} ${
          mixBlend && !isBlackBg ? 'mix-blend-multiply' : ''
        } ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={() => {
          if (!hasFailed) {
            const fb = getSmartFallback(alt, src);
            setProcessedSrc(fb);
            setHasFailed(true);
          }
          setIsLoading(false);
        }}
      />
    </div>
  );
}
