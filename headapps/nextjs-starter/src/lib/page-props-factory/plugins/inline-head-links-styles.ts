import { CustomSitecorePageProps } from 'lib/page-props';
import { Plugin } from '..';
import client from 'lib/sitecore-client';

class InlineHeadLinksStylesPlugin implements Plugin {
  order = 11;

  async exec(props: CustomSitecorePageProps) {
    if (props.notFound) return props;
    if (!props.page?.layout) return props;

    const headLinks = client.getHeadLinks(props.page?.layout, {
      enableStyles: true,
      enableThemes: true,
    });
    for (const headLink of headLinks) {
      if (headLink.rel === 'stylesheet') {
        try {
          headLink.content = await fetch(headLink.href).then((response) => response.text());
        } catch (error) {
          console.error('Error fetching stylesheet', error);
        }
      }
    }
    props.headLinks = headLinks;
    return props;
  }
}

export const inlineHeadLinksStylesPlugin = new InlineHeadLinksStylesPlugin();
