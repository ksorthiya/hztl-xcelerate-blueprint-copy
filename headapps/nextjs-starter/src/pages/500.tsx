import { JSX } from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { ErrorPage } from '@sitecore-content-sdk/nextjs';
import Layout from 'src/Layout';
import scConfig from 'sitecore.config';
import client from 'lib/sitecore-client';
import components from '.sitecore/component-map';
import Providers from 'src/Providers';
import { CustomSitecorePageProps } from 'lib/page-props';

/**
 * Rendered in case if we have 500 error
 */
export const DefaultServerError = (): JSX.Element => (
  <>
    <Head>
      <title>500: Server Error</title>
    </Head>
    <div style={{ padding: 10 }}>
      <h1>500 Internal Server Error</h1>
      <p>There is a problem with the resource you are looking for, and it cannot be displayed.</p>
      <a href="/">Go to the Home page</a>
    </div>
  </>
);

const Custom500 = (props: CustomSitecorePageProps): JSX.Element => {
  if (!(props && props.page)) {
    return <DefaultServerError />;
  }

  return (
    <Providers componentProps={props.componentProps} page={props.page}>
      <Layout page={props.page} />
    </Providers>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const props: CustomSitecorePageProps = {
    page: null,
  };

  if (scConfig.generateStaticPaths) {
    try {
      props.page = await client.getErrorPage(ErrorPage.InternalServerError, {
        site: scConfig.defaultSite,
        locale: context.locale || context.defaultLocale || scConfig.defaultLanguage,
      });
      props.headLinks = props.page?.layout
        ? client.getHeadLinks(props.page?.layout, { enableStyles: true, enableThemes: true })
        : undefined;
    } catch (error) {
      console.log('Error occurred while fetching error pages');
      console.log(error);
    }
  }

  if (props.page) {
    props.componentProps = await client.getComponentData(props.page.layout, context, components);
  }

  return {
    props,
  };
};

export default Custom500;
