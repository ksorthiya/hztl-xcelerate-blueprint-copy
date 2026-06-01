// Global
import React, { JSX } from 'react';
import { tv } from 'tailwind-variants';

// Local
import { Content } from '.generated/Content/Hero.model';
import { Field, LinkField, ComponentParams } from '@sitecore-content-sdk/nextjs';
import { withStandardComponentWrapper } from 'helpers/HOC';
import ImageWrapper from 'helpers/SitecoreWrappers/ImageWrapper/ImageWrapper';
import LinkWrapper from 'helpers/SitecoreWrappers/LinkWrapper/LinkWrapper';
import PlainTextWrapper from 'helpers/SitecoreWrappers/PlainTextWrapper/PlainTextWrapper';
import RichTextWrapper from 'helpers/SitecoreWrappers/RichTextWrapper/RichTextWrapper';
import { parseStyleParams } from 'lib/utils/style-param-utils';
import { getCtaStyle } from 'lib/utils/cta-utils';

import { useCurrentPage } from 'lib/hooks/sitecore/context';
import { XceleratePage } from 'src/baseTypes/Xcelerate.HztlFoundation.model';
import { BrandAndThemeProvider } from 'lib/context/BrandAndThemeContext';
import { Themes, Layout } from 'helpers/Constants/Constant';
import { getTestProps } from 'lib/testing/utils';

export type HeroProps = Content.Hero.Hero_Component;
// Reusable content component for both variants
const HeroContent = ({
  heading,
  description,
  cta1Link,
  cta2Link,
  heroTitle,
  heroDescription,
  eyebrow,
  subHeading,
  layout,
  params,
}: {
  heading?: Field<string>;
  description?: Field<string>;
  cta1Link?: LinkField;
  cta2Link?: LinkField;
  heroTitle?: Field<string>;
  heroDescription?: Field<string>;
  eyebrow?: Field<string>;
  subHeading?: Field<string>;
  layout: 'left' | 'right';
  params?: ComponentParams;
}): JSX.Element => {
  const styles = parseStyleParams(params, ['cta1', 'cta2']);

  const {
    contentContainer,
    headingText,
    descriptionText,
    ctaContainer,
    cta,
    eyebrowText,
    subHeadingText,
  } = TAILWIND_VARIANTS({ layout });

  return (
    <div className={contentContainer()}>
      <PlainTextWrapper
        className={eyebrowText()}
        field={eyebrow}
        tag="div"
        {...getTestProps(`eyebrow`)}
      />
      <PlainTextWrapper
        className={headingText()}
        field={heading}
        fallbacks={[heroTitle]}
        tag="h1"
        {...getTestProps(`heading`)}
      />
      <PlainTextWrapper
        className={subHeadingText()}
        field={subHeading}
        tag="h2"
        {...getTestProps(`sub-heading`)}
      />
      <RichTextWrapper
        className={descriptionText()}
        field={description}
        fallbacks={[heroDescription]}
        tag="div"
        {...getTestProps(`description`)}
      />
      <div className={ctaContainer()}>
        <LinkWrapper
          ctaSurface="onSurface"
          className={cta({ style: styles.cta1?.ctaVariant })}
          ctaStyle={getCtaStyle(styles.cta1, 'fill')}
          field={cta1Link}
          suppressNewTabIcon={true}
          {...getTestProps(`link-cta1`)}
        />
        <LinkWrapper
          ctaSurface="onSurface"
          className={cta({ style: styles.cta2?.ctaVariant })}
          ctaStyle={getCtaStyle(styles.cta2, 'outline')}
          field={cta2Link}
          suppressNewTabIcon={true}
          {...getTestProps(`link-cta2`)}
        />
      </div>
    </div>
  );
};

const Hero = (props: HeroProps): JSX.Element => {
  const { cta1Link, cta2Link, description, heading, image, eyebrow, subHeading } =
    props?.fields || {};
  const currentPage = useCurrentPage<XceleratePage>();
  const { heroTitle, heroDescription, heroImage } = currentPage?.fields ?? {};

  const theme = props?.params?.selectTheme as Themes;
  const layout = (props?.params?.layout as Layout) || 'Full'; // Default: Full

  const { base, innerContainer, contentColumn, imageColumnBase, imageColumnRight, imageStyle } =
    TAILWIND_VARIANTS({
      layout: 'right',
      heroLayout: layout as Layout,
    });

  return (
    <BrandAndThemeProvider theme={theme}>
      <section
        className={base()}
        data-component="authorable/shared/content/hero"
        {...getTestProps(`component-hero-${props?.rendering?.uid}`)}
      >
        <div className={innerContainer()}>
          <div className={contentColumn()}>
            <HeroContent
              heading={heading}
              description={description}
              cta1Link={cta1Link}
              cta2Link={cta2Link}
              heroTitle={heroTitle}
              heroDescription={heroDescription}
              eyebrow={eyebrow}
              subHeading={subHeading}
              layout="right"
              params={props.params}
            />
          </div>
          <div className={`${imageColumnBase()} ${imageColumnRight()}`}>
            <ImageWrapper
              className={imageStyle()}
              field={image}
              fallbacks={[heroImage]}
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              {...getTestProps(`hero-image`)}
            />
          </div>
        </div>
      </section>
    </BrandAndThemeProvider>
  );
};

const ImageLeftVariant = (props: HeroProps): JSX.Element => {
  const { cta1Link, cta2Link, description, heading, image, eyebrow, subHeading } =
    props?.fields || {};
  const currentPage = useCurrentPage<XceleratePage>();
  const { heroTitle, heroDescription, heroImage } = currentPage?.fields ?? {};

  const theme = props?.params?.selectTheme as Themes;
  const layout = (props?.params?.layout as Layout) || 'Full'; // Default: Full

  const { base, innerContainer, contentColumn, imageColumnBase, imageColumnLeft, imageStyle } =
    TAILWIND_VARIANTS({
      layout: 'left',
      heroLayout: layout as Layout,
    });

  return (
    <BrandAndThemeProvider theme={theme}>
      <section
        className={base()}
        data-component="authorable/shared/content/hero-image-left"
        {...getTestProps(`component-hero-image-left-${props?.rendering?.uid}`)}
      >
        <div className={innerContainer()}>
          <div className={`${imageColumnBase()} ${imageColumnLeft()}`}>
            <ImageWrapper
              className={imageStyle()}
              field={image}
              fallbacks={[heroImage]}
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              {...getTestProps(`hero-image`)}
            />
          </div>
          <div className={contentColumn()}>
            <HeroContent
              heading={heading}
              description={description}
              cta1Link={cta1Link}
              cta2Link={cta2Link}
              heroTitle={heroTitle}
              heroDescription={heroDescription}
              eyebrow={eyebrow}
              subHeading={subHeading}
              layout="left"
              params={props.params}
            />
          </div>
        </div>
      </section>
    </BrandAndThemeProvider>
  );
};

export const Default = withStandardComponentWrapper(Hero);

export const ImageLeft = withStandardComponentWrapper(ImageLeftVariant);

const TAILWIND_VARIANTS = tv({
  defaultVariants: {
    layout: 'right',
  },
  slots: {
    base: ['flex', 'justify-center', 'items-center'],
    innerContainer: [
      'flex',
      'items-center',
      'flex-1',
      'w-full',
      'gap-component-hero-space-between',
      'bg-component-hero-color-surface',
      'rounded-component-hero-border-radius',
      'min-w-columns-variety-full-min-width',
      'max-w-columns-variety-full-max-width',
      'overflow-hidden',
    ],
    cta: [],
    contentColumn: ['flex', 'w-full', 'md:w-1/2'],
    imageColumnBase: [
      'w-full',
      'md:w-1/2',
      'rounded-component-hero-image-border-radius',
      'aspect-[4/3]',
      'border-component-hero-image-border-width',
      'border-component-hero-color-image-border',
      'px-component-hero-image-padding-x',
      'py-component-hero-image-padding-y',
      'min-h-component-hero-image-min-height',
      'overflow-hidden',
    ],
    imageColumnRight: [],
    imageColumnLeft: [],
    contentContainer: [
      'px-component-hero-copy-padding-x',
      'py-component-hero-copy-padding-y',
      'w-full',
      'bg-component-hero-color-copy-surface',
      'border-component-hero-copy-border-width',
      'border-component-hero-color-copy-border',
      'rounded-component-hero-copy-border-radius',
    ],
    ctaContainer: [
      'flex',
      'flex-col',
      'md:flex-row',
      'mt-component-hero-copy-buttons-margin-top',
      'gap-spacing-spacing-8',
      'md:justify-normal',
      '[&>*]:w-full',
      '[&>*]:md:w-auto',
    ],
    descriptionText: [
      'text-component-hero-color-body',
      'font-typography-body-font-family',
      'text-typography-body-large-font-size',
      'font-normal',
      'leading-typography-line-height-body-large',
      'sm:line-clamp-2',
      'xl:line-clamp-5',
    ],
    headingText: [
      'font-bold',
      'text-component-hero-color-title',
      'font-typography-header-font-family',
      'text-typography-header-xlarge-font-size',
      'leading-tight',
      'sm:line-clamp-1',
      'lg:line-clamp-2',
    ],
    eyebrowText: [
      'text-component-hero-color-eyebrow',
      'font-typography-body-font-family',
      'text-typography-eyebrow-font-size',
      'font-bold',
      'leading-typography-eyebrow-line-height',
      'tracking-[2.7px]',
      'pb-general-spacing-subtitle-margin-bottom',
      'uppercase',
      'line-clamp-1',
    ],
    subHeadingText: [
      'text-component-hero-color-subtitle',
      'font-typography-header-font-family',
      'text-typography-header-medium-font-size',
      'font-bold',
      'leading-typography-header-medium-line-height',
      'my-component-hero-copy-spacing-vertical',
      'sm:line-clamp-1',
      'lg:line-clamp-2',
    ],
    imageStyle: [
      'w-full',
      'h-full',
      'object-cover',
      'rounded-component-hero-image-border-radius',
      'overflow-hidden',
    ],
  },
  variants: {
    style: {
      link: {
        cta: [
          'flex',
          'items-center',
          'my-auto',
          'gap-2',
          'text-base',
          // TODO: NEED TO UPDATE FIGMA TOKENS.
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
    layout: {
      right: {
        innerContainer: ['flex-col', 'md:flex-row'],
      },
      left: {
        innerContainer: ['flex-col', 'md:flex-row'],
      },
    },
    heroLayout: {
      Full: {
        base: [
          'relative',
          'before:z-[-1]',
          'before:h-full',
          'before:absolute',
          'before:top-0',
          'before:left-[calc(-50vw+50%)]',
          'before:right-[calc(-50vw+50%)]',
          'before:bg-component-hero-color-bg',
          'py-component-hero-padding-y',
          'px-component-hero-padding-x',
          'xl:px-spacing-spacing-80',
        ],
      },
      Wide: {
        base: [
          'relative',
          'before:z-[-1]',
          'before:h-full',
          'before:absolute',
          'before:top-0',
          'before:left-[calc(-50vw+50%)]',
          'before:bg-component-hero-color-bg',
          'before:right-[calc(-50vw+50%)]',
          'py-component-hero-padding-y',
          'xl:px-0',
        ],
      },
    },
  },
});
