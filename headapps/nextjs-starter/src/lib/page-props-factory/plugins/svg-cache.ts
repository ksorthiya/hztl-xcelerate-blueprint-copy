import { CustomSitecorePageProps } from 'lib/page-props';
import { Plugin } from '..';
import { deepSearch } from 'lib/utils/object-utils';
import { ImageField, debug } from '@sitecore-content-sdk/nextjs';
import { normalizeImageUrl } from 'helpers/SitecoreWrappers/ImageWrapper/ImageWrapper';

// The SVG cache is a server-side render optimization. On a cache miss,
// `SvgImageWrapper` falls back to fetching the SVG on the client, so
// individual fetch failures here must never crash the page render.
const FETCH_TIMEOUT_MS = 5000;

class SvgCachePlugin implements Plugin {
  order = 4;

  async exec(props: CustomSitecorePageProps) {
    if (props.notFound || !props.page) return props;

    // Get all SVG Image fields
    const fields = deepSearch(
      props.page.layout.sitecore.route,
      (x: ImageField) => !!x?.value?.src?.match(/\.svg([\?\#]?.*)?$/)
    );

    // Don't fetch the same SVG multiple times
    const distinctSvgs = [
      ...new Set(
        fields
          .map((field) => normalizeImageUrl(field.value?.src, true))
          .filter((src) => !!src) as string[]
      ),
    ];

    const svgCache: Record<string, string> = {};
    let failures = 0;

    // `allSettled` signals intent: some fetches may fail and that's OK.
    await Promise.allSettled(
      distinctSvgs.map(async (src) => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
        try {
          const response = await fetch(src, { signal: controller.signal });
          if (!response.ok) {
            failures++;
            return;
          }
          const svgText = await response.text();
          if (svgText) {
            svgCache[src] = svgText;
          }
        } catch {
          failures++;
        } finally {
          clearTimeout(timeout);
        }
      })
    );

    if (failures > 0) {
      debug.common(
        'svg-cache: cached %d, missed %d (clients will fetch on demand)',
        Object.keys(svgCache).length,
        failures
      );
    }

    props.page.layout.sitecore.context.svgCache = svgCache;

    return props;
  }
}

export const svgCachePlugin = new SvgCachePlugin();
