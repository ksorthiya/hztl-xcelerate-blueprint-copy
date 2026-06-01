import React, { useEffect, useState } from 'react';
import { normalizeImageUrl } from '../ImageWrapper/ImageWrapper';
import { useSvgCache } from 'lib/hooks/sitecore/context';

export interface SvgImageWrapperProps {
  src: string; // URL or path to the SVG
  fallback?: React.ReactNode; // Shown while loading or on error
  alt?: string; // Accessible label
  className?: string; // CSS classes
  sanitize?: boolean; // Enable basic built-in sanitization
  shouldHaveAriaLabel?: boolean; // Whether to add aria-label to the svg
}

export const SvgImageWrapper: React.FC<SvgImageWrapperProps> = ({
  src,
  fallback = null,
  alt = '',
  className = '',
  sanitize = true,
  shouldHaveAriaLabel = true,
}) => {
  const [error, setError] = useState<boolean>(false);

  const svgCache = useSvgCache();

  const normalizedSrc = normalizeImageUrl(src, true) ?? '';
  const cachedSvg = svgCache?.[normalizedSrc];

  const sanitizedSvg = cachedSvg ? sanitizeSvg(cachedSvg, className) : null;

  const [svgHtml, setSvgHtml] = useState<string | null>(sanitizedSvg);

  useEffect(() => {
    const setSvg = async () => {
      if (cachedSvg) {
        return;
      }
      if (!normalizedSrc) {
        setError(true);
        setSvgHtml(null);
        return;
      }

      let svgText = await fetchSvg();

      if (svgText) {
        if (sanitize) {
          svgText = sanitizeSvg(svgText, className);
        }
        setSvgHtml(svgText);
      } else {
        setError(true);
        setSvgHtml(null);
      }
    };
    const fetchSvg = async () => {
      try {
        if (!normalizedSrc) {
          setError(true);
          setSvgHtml(null);
          return;
        }
        const response = await fetch(normalizedSrc);
        if (!response.ok || !response.headers.get('content-type')?.includes('image/svg')) {
          throw new Error('Invalid SVG file or blocked');
        }

        const svgText = await response.text();

        return svgText;
      } catch (err) {
        console.error('Error loading SVG:', err);
        return null;
      }
    };
    setSvg();
  }, [sanitize, className, svgCache, normalizedSrc, cachedSvg]);

  if (error || !svgHtml) {
    return <div className={className}>{fallback}</div>;
  }

  return (
    <div
      role={shouldHaveAriaLabel ? 'img' : undefined}
      aria-label={shouldHaveAriaLabel ? alt : undefined}
      dangerouslySetInnerHTML={{ __html: svgHtml }}
    />
  );
};

function sanitizeSvg(svgText: string, className: string = '') {
  return svgText
    .replace(/<script.*?>.*?<\/script>/gi, '')
    .replace(/on\w+=".*?"/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/<svg([^>]+)?/i, `<svg$1 class="${className}"`)
    .replace(/<path([^>]*?)\/?>/gi, (_match, attrs) => {
      return `<path${attrs} class="${className}" />`;
    });
}
