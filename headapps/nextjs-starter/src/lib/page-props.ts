// Global
import { HTMLLink, SitecorePageProps } from '@sitecore-content-sdk/nextjs';

// Local
import { MockErrorData } from 'helpers/ErrorHandling/HandleMockError';

/**
 * Sitecore page props
 */
export interface CustomSitecorePageProps extends SitecorePageProps {
  /** Used when we are testing our error handling */
  mockError?: MockErrorData | null;
  headLinks?: InlinedHtmlLink[];
}
/**
 * Html Link with inlined content for faster load times
 */
export type InlinedHtmlLink = HTMLLink & {
  content?: string;
};
