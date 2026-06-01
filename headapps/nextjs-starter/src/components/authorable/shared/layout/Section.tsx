// Global
import React, { JSX } from 'react';
// Local
import { withStandardComponentWrapper } from 'helpers/HOC';
import { PlaceholderWrapper } from 'helpers/SitecoreWrappers/PlaceholderWrapper/PlaceholderWrapper';
import { Layout } from '.generated/Layout/Section.model';
import { tv } from 'tailwind-variants';
import { BrandAndThemeProvider } from 'lib/context/BrandAndThemeContext';
import { Themes } from 'helpers/Constants/Constant';
import PlainTextWrapper from 'helpers/SitecoreWrappers/PlainTextWrapper/PlainTextWrapper';
import { TextAlignmentProvider, TextAlignment } from 'lib/context/TextAlignmentContext';
import { getTestProps } from 'lib/testing/utils';
import { SectionWrapper } from 'helpers/GenericWrappers/SectionWrapper/SectionWrapper';

export type SectionProps = Layout.Section.Section_Component;
export type SectionParametersProps = Layout.Section.SectionParameters_Component;

const Section = (props: SectionProps): JSX.Element => {
  const { DynamicPlaceholderId, RenderingIdentifier } = props?.params || {};
  const {
    title,
    description,
    removePaddingTop,
    removePaddingBottom,
    removePaddingLeftRight,
    displayCenter75,
  } = props?.fields || {};

  const theme = props?.params?.selectTheme as Themes;
  const textAlignment = (props?.params?.alignment as TextAlignment) || 'Left';
  const hasHeaderContent = Boolean(title?.value || description?.value);
  const noPaddingTop = Boolean(removePaddingTop?.value);
  const noPaddingBottom = Boolean(removePaddingBottom?.value);
  const noPaddingSides = Boolean(removePaddingLeftRight?.value);
  const isCentered75 = Boolean(displayCenter75?.value);

  const phKey = `section-${DynamicPlaceholderId}`;

  const { sectionTitle, sectionDescription, sectionHeaderWrapper } = TAILWIND_VARIANTS({
    textAlignment,
  });

  /*
   * RENDERING
   */

  return (
    <div
      data-component="authorable/shared/layout/section"
      id={RenderingIdentifier}
      {...getTestProps(`component-section-${props?.rendering?.uid}`)}
    >
      <BrandAndThemeProvider theme={theme}>
        <TextAlignmentProvider textAlignment={textAlignment}>
          <SectionWrapper
            hasHeaderContent={hasHeaderContent}
            textAlignment={textAlignment}
            noPaddingTop={noPaddingTop}
            noPaddingBottom={noPaddingBottom}
            noPaddingSides={noPaddingSides}
            isCentered75={isCentered75}
          >
            <div className={sectionHeaderWrapper()}>
              <PlainTextWrapper className={sectionTitle()} field={title} tag="h2" />
              <span className={sectionDescription()}>
                <PlainTextWrapper field={description} />
              </span>
            </div>
            <PlaceholderWrapper name={phKey} rendering={props.rendering} />
          </SectionWrapper>
        </TextAlignmentProvider>
      </BrandAndThemeProvider>
    </div>
  );
};

export const Default = withStandardComponentWrapper(Section, false);

const TAILWIND_VARIANTS = tv({
  slots: {
    sectionTitle: [
      'text-component-section-color-title',
      'font-typography-header-font-family',
      'text-typography-header-large-font-size',
      'font-bold',
      'leading-tight',
    ],
    sectionDescription: [
      'text-component-section-color-body',
      'font-typography-body-font-family',
      'text-typography-body-medium-font-size',
      'leading-normal',
    ],
    sectionHeaderWrapper: [
      'flex',
      'flex-col',
      'gap-general-spacing-title-margin-bottom',
      'max-w-columns-two-third-max-width',
    ],
  },
  variants: {
    textAlignment: {
      Left: {
        sectionHeaderWrapper: [],
      },
      Center: {
        sectionHeaderWrapper: 'mx-auto',
      },
      Right: {
        sectionHeaderWrapper: [],
      },
    },
  },
  defaultVariants: {
    textAlignment: 'Left',
    hasContent: false,
    removePaddingTop: false,
    removePaddingBottom: false,
    removePaddingLeftRight: false,
    displayCenter75: false,
  },
});
