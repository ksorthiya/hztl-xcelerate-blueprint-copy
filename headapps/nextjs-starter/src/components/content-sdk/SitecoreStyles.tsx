import Head from 'next/head';
import { InlinedHtmlLink } from 'lib/page-props';

/**
 * Component to render `<link>` elements for Sitecore styles
 */
const SitecoreStyles = ({ headLinks }: { headLinks: InlinedHtmlLink[] | undefined }) => {
  if (!headLinks || headLinks.length === 0) {
    return null;
  }

  return (
    <Head>
      {headLinks.map((headLink) =>
        headLink.content ? (
          <style dangerouslySetInnerHTML={{ __html: headLink.content }} key={headLink.href} />
        ) : (
          <link rel={headLink.rel} key={headLink.href} href={headLink.href} />
        )
      )}
    </Head>
  );
};

export default SitecoreStyles;
