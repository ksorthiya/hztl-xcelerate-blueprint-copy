// Global
import React, { JSX } from 'react';
import { tv } from 'tailwind-variants';

// Local
import { Content } from '.generated/Content/FeatureSideBySide.model';
import { Field, LinkField, ComponentParams } from '@sitecore-content-sdk/nextjs';
import { withStandardComponentWrapper } from 'helpers/HOC';
import ImageWrapper from 'helpers/SitecoreWrappers/ImageWrapper/ImageWrapper';
import LinkWrapper from 'helpers/SitecoreWrappers/LinkWrapper/LinkWrapper';
import PlainTextWrapper from 'helpers/SitecoreWrappers/PlainTextWrapper/PlainTextWrapper';
import RichTextWrapper from 'helpers/SitecoreWrappers/RichTextWrapper/RichTextWrapper';
import { parseStyleParams } from 'lib/utils/style-param-utils';
import { getCtaStyle } from 'lib/utils/cta-utils';

import { BrandAndThemeProvider } from 'lib/context/BrandAndThemeContext';
import { SectionWrapper } from 'helpers/GenericWrappers/SectionWrapper/SectionWrapper';
import { Themes } from 'helpers/Constants/Constant';
import { getTestProps } from 'lib/testing/utils';

export type FeatureSidebySideProps = Content.FeatureSideBySide.FeatureSideBySide_Component;

// Reusable content component for both variants
const FeatureSidebySideContent = ({
  heading,
  description,
  cta1Link,
  cta2Link,
  eyebrow,
  subHeading,
  layout,
  params,
}: {
  heading?: Field<string>;
  description?: Field<string>;
  cta1Link?: LinkField;
  cta2Link?: LinkField;
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
        tag="h2"
        {...getTestProps(`heading`)}
      />
      <PlainTextWrapper
        className={subHeadingText()}
        field={subHeading}
        tag="h3"
        {...getTestProps(`sub-heading`)}
      />
      <RichTextWrapper
        className={descriptionText()}
        field={description}
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

const FeatureSidebySide = (props: FeatureSidebySideProps): JSX.Element => {
  const { cta1Link, cta2Link, description, heading, image, eyebrow, subHeading } =
    props?.fields || {};

  const theme = props?.params?.selectTheme as Themes;

  const { base, contentColumn, imageColumnBase, imageStyle } = TAILWIND_VARIANTS({
    layout: 'right',
  });

  return (
    <BrandAndThemeProvider theme={theme}>
      <SectionWrapper noPaddingSides noPaddingTop noPaddingBottom>
        <section
          className={base()}
          data-component="authorable/shared/content/feature-sidebyside"
          {...getTestProps(`component-feature-side-by-side-${props?.rendering?.uid}`)}
        >
          <div className={contentColumn()}>
            <FeatureSidebySideContent
              heading={heading}
              description={description}
              cta1Link={cta1Link}
              cta2Link={cta2Link}
              eyebrow={eyebrow}
              subHeading={subHeading}
              layout="right"
              params={props.params}
            />
          </div>
          <div className={imageColumnBase()}>
            <ImageWrapper className={imageStyle()} field={image} {...getTestProps(`image`)} />
          </div>
        </section>
      </SectionWrapper>
    </BrandAndThemeProvider>
  );
};

const ImageLeftVariant = (props: FeatureSidebySideProps): JSX.Element => {
  const { cta1Link, cta2Link, description, heading, image, eyebrow, subHeading } =
    props?.fields || {};

  const theme = props?.params?.selectTheme as Themes;

  const { base, contentColumn, imageColumnBase, imageStyle } = TAILWIND_VARIANTS({
    layout: 'left',
  });

  return (
    <BrandAndThemeProvider theme={theme}>
      <SectionWrapper noPaddingSides noPaddingTop noPaddingBottom>
        <section
          className={base()}
          data-component="authorable/shared/content/feature-sidebyside-image-left"
          {...getTestProps(`component-feature-side-by-side-image-left-${props?.rendering?.uid}`)}
        >
          <div className={imageColumnBase()}>
            <ImageWrapper className={imageStyle()} field={image} {...getTestProps(`image`)} />
          </div>
          <div className={contentColumn()}>
            <FeatureSidebySideContent
              heading={heading}
              description={description}
              cta1Link={cta1Link}
              cta2Link={cta2Link}
              eyebrow={eyebrow}
              subHeading={subHeading}
              layout="left"
              params={props.params}
            />
          </div>
        </section>
      </SectionWrapper>
    </BrandAndThemeProvider>
  );
};

export const Default = withStandardComponentWrapper(FeatureSidebySide);

export const ImageLeft = withStandardComponentWrapper(ImageLeftVariant);

const TAILWIND_VARIANTS = tv({
  defaultVariants: {
    layout: 'right',
  },
  slots: {
    base: [
      'relative',
      'flex',
      'items-center',
      'bg-component-feature-50-color-bg',
      'py-component-feature-50-container-padding-y',
      'px-component-feature-50-container-padding-x',
      'sm:pl-component-feature-50-container-padding-x',
      'md:pr-0',
    ],
    cta: [],
    contentColumn: [
      'flex',
      'w-full',
      'bg-component-feature-50-color-surface',
      'py-component-feature-50-content-padding-y',
      'px-component-feature-50-content-padding-x',
      'rounded-component-feature-50-content-radius',
      'h-fill-available',
      'md:w-3/5',
      'lg:w-1/2',
      'z-10',
    ],
    imageColumnBase: [
      'w-full',
      'overflow-hidden',
      'relative',
      'aspect-[1/1]',
      'py-component-feature-50-image-padding-y',
      'px-component-feature-50-image-padding-x',
      'rounded-component-feature-50-image-radius',
      'overflow-hidden',
      'md:min-h-[-webkit-fill-available]',
      'md:w-2/5',
      'lg:w-1/2',
      'xl:aspect-square',
    ],
    contentContainer: [
      'md:max-w-xl',
      'px-0',
      'w-full',
      'rounded-component-feature-50-content-radius',
      'sm:py-component-feature-50-image-padding-y',
      'md:px-0',
      'bg-component-feature-50-color-surface',
    ],
    ctaContainer: [
      'flex',
      'flex-col',
      'md:flex-row',
      'gap-gap-less',
      'py-general-spacing-buttons-margin-top',
      'md:justify-normal',
      '[&>*]:w-full',
      '[&>*]:md:w-auto',
    ],
    eyebrowText: [
      'text-component-feature-50-color-eyebrow',
      'font-typography-body-font-family',
      'text-typography-eyebrow-font-size',
      'font-bold',
      'uppercase',
      'line-clamp-1',
      'leading-typography-eyebrow-line-height',
      'tracking-[2.7px]',
      'pb-spacing-general-eyebrow-margin-bottom',
      'overflow-hidden',
    ],
    headingText: [
      'font-bold',
      'text-component-feature-50-color-title',
      'font-typography-header-font-family',
      'text-typography-header-xlarge-font-size',
      'leading-tight',
      'sm:line-clamp-2',
      'lg:line-clamp-auto',
    ],
    subHeadingText: [
      'text-component-feature-50-color-subtitle',
      'font-typography-header-font-family',
      'text-typography-header-medium-font-size',
      'font-bold',
      'leading-typography-header-medium-line-height',
      'sm:mb-spacing-spacing-16',
      'mb-general-spacing-subtitle-margin-bottom',
    ],
    descriptionText: [
      'mb-spacing-spacing-24',
      'text-component-feature-50-color-body',
      'font-typography-body-font-family',
      'text-typography-body-xlarge-font-size',
      'font-normal',
      'leading-typography-body-large-line-height',
      'sm:line-clamp-3',
      'lg:line-clamp-4',
    ],

    imageStyle: [
      'w-full',
      'h-full',
      'object-cover',
      'object-center',
      'overflow-hidden',
      'rounded-component-feature-50-image-radius',
    ],
  },
  variants: {
    style: {
      link: {
        cta: ['text-base'],
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
        base: ['flex-col', 'md:flex-row'],
        imageColumnBase: [
          'md:ml-component-feature-50-container-gutter',
          'md:mr-component-feature-50-container-padding-y',
        ],
      },
      left: {
        base: ['flex-col', 'md:flex-row'],
        imageColumnBase: ['md:mr-component-feature-50-container-gutter'],
        contentColumn: ['md:mr-component-feature-50-container-padding-y'],
      },
    },
    theme: {
      ThemesWhite: {
        imageColumnBase: ['rounded-border-radius-radius-3'],
      },
    },
  },
});
