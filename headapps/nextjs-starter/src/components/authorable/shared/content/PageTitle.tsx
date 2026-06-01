// Global
import React, { JSX } from 'react';
import { tv } from 'tailwind-variants';
import clsx from 'clsx';

// Lib
import { BrandAndThemeProvider } from 'lib/context/BrandAndThemeContext';

// Local
import { withStandardComponentWrapper } from 'helpers/HOC';
import PlainTextWrapper from 'helpers/SitecoreWrappers/PlainTextWrapper/PlainTextWrapper';
import { Content } from '.generated/Content/PageTitle.model';
import LinkWrapper from 'helpers/SitecoreWrappers/LinkWrapper/LinkWrapper';
import { Alignment, Themes } from 'helpers/Constants/Constant';
import RichTextWrapper from 'helpers/SitecoreWrappers/RichTextWrapper/RichTextWrapper';
import { parseStyleParams } from 'lib/utils/style-param-utils';
import { getCtaStyle } from 'lib/utils/cta-utils';
import { XceleratePage } from 'src/baseTypes/Xcelerate.HztlFoundation.model';
import { getTestProps } from 'lib/testing/utils';
import { useCurrentPage } from 'lib/hooks/sitecore/context';

// Types
export type PageTitleProps = Content.PageTitle.PageTitle_Component;
export type PageTitleParametersProps = Content.PageTitle.PageTitleParameters_Component;

const PageTitle = (props: PageTitleProps): JSX.Element => {
  const styles = parseStyleParams(props.params, ['cta1']);

  const theme = props?.params?.selectTheme as Themes;
  const alignment = (props?.params?.alignment as Alignment) || 'Left'; // Default: Left

  const { description, title, ctaLink } = props?.fields || {};

  const currentPage = useCurrentPage<XceleratePage>();
  const { pageTitle, pageDescription } = currentPage?.fields ?? {};

  const {
    base,
    cta,
    backgroundWrapper,
    contentWrapper,
    titleWrappers,
    headlineText,
    descriptionText,
    actionButtonWrapper,
  } = TAILWIND_VARIANTS({
    alignment: alignment as Alignment,
  });

  /*
   * Rendering
   */

  return (
    <section
      className={clsx(base(), styles)}
      data-component="authorable/shared/content/pageTitle"
      {...getTestProps(`component-page-title-${props?.rendering?.uid}`)}
    >
      <BrandAndThemeProvider theme={theme}>
        <div className={clsx(backgroundWrapper())} {...getTestProps(`background`)}></div>
        <div className={contentWrapper()}>
          <div className={titleWrappers()}>
            <PlainTextWrapper
              className={clsx(headlineText())}
              field={title}
              fallbacks={[pageTitle]}
              tag="h1"
              {...getTestProps(`headline`)}
            />
            <RichTextWrapper
              className={clsx(descriptionText())}
              field={description}
              fallbacks={[pageDescription]}
              {...getTestProps(`description`)}
            />
          </div>

          <div className={actionButtonWrapper()}>
            <LinkWrapper
              ctaSurface="onBg"
              className={cta({ style: styles.cta1?.ctaVariant })}
              ctaStyle={getCtaStyle(styles.cta1, 'fill')}
              field={ctaLink}
              {...getTestProps(`cta`)}
            />
          </div>
        </div>
      </BrandAndThemeProvider>
    </section>
  );
};

export const Default = withStandardComponentWrapper(PageTitle);

const TAILWIND_VARIANTS = tv({
  defaultVariants: {
    style: 'fill',
  },
  slots: {
    cta: [],
    base: [
      'container',
      'max-w-none',
      'relative',
      'w-full',
      'flex',
      'items-center',
      'px-layout-variety-margin-x',
      'min-h-height-min-height-page-title-min-height',
    ],
    backgroundWrapper: [
      'absolute',
      'inset-0',
      'z-0',
      'left-[calc(-50vw+50%)]',
      'right-[calc(-50vw+50%)]',
      'bg-component-section-color-bg',
    ],
    contentWrapper: [
      'relative',
      'flex',
      'flex-col',
      'gap-spacing-general-copy-margin-bottom',
      'lg:max-w-typography-copy-max-Width',
    ],
    titleWrappers: [
      'flex',
      'flex-col',
      'gap-spacing-general-title-margin-bottom',
      'text-component-section-color-title',
    ],
    headlineText: [
      'text-typography-header-xlarge-font-size',
      'font-typography-header-font-family',
      'font-bold',
      'leading-normal',
      'text-component-section-color-title',
    ],
    descriptionText: [
      'font-typography-body-font-family',
      'font-normal',
      'leading-normal',
      'text-component-section-color-body',
      'text-typography-body-large-font-size',
    ],
    actionButtonWrapper: [
      'flex',
      'flex-col',
      'md:flex-row',
      'pt-spacing-general-buttons-margin-top',
    ],
  },
  variants: {
    alignment: {
      Left: {
        contentWrapper: ['justify-start', 'text-left'],
        actionButtonWrapper: ['justify-start'],
        iconWrapper: ['justify-start'],
      },
      Center: {
        base: ['justify-center'],
        contentWrapper: ['justify-center', 'text-center', 'm-auto'],
        actionButtonWrapper: ['justify-center'],
        iconWrapper: ['justify-center'],
        descriptionText: ['text-center'],
      },
      Right: {
        contentWrapper: ['justify-end', 'text-right', 'float-right'],
        actionButtonWrapper: ['justify-end'],
        iconWrapper: ['justify-end'],
        descriptionText: ['text-right'],
      },
    },
    style: {
      link: {
        cta: [
          'flex',
          'items-center',
          'gap-2',
          'text-base',
          // TODO: NEED TO UPDAT FIGMA TOKENS.
          // This is a temporary fix to make the cta link themeable.
          'text-component-accordion-toggle-toggle-active',
        ],
      },
      fill: {
        cta: ['px-8'],
      },
      outline: {
        cta: ['px-8'],
      },
      ghost: {
        cta: ['px-8'],
      },
    },
  },
});
