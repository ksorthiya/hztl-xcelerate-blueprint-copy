// Global
import { tv } from 'tailwind-variants';
import { JSX } from 'react';
// Local
import { Lists } from '.generated/Lists/Carousel.model';
import { withStandardComponentWrapper } from 'helpers/HOC';
import ImageWrapper from 'helpers/SitecoreWrappers/ImageWrapper/ImageWrapper';
import LinkWrapper from 'helpers/SitecoreWrappers/LinkWrapper/LinkWrapper';
import RichTextWrapper from 'helpers/SitecoreWrappers/RichTextWrapper/RichTextWrapper';
import PlainTextWrapper from 'helpers/SitecoreWrappers/PlainTextWrapper/PlainTextWrapper';
import { parseStyleParams } from 'lib/utils/style-param-utils';
import { getCtaStyle } from 'lib/utils/cta-utils';
import { getTestProps } from 'lib/testing/utils';

export type CarouselItemProps = Lists.Carousel.CarouselItem_Component;

const CarouselItem = (props: CarouselItemProps): JSX.Element => {
  const { description, image, primaryCTA, secondaryCTA, title } = props?.fields || {};

  /*
   * Rendering
   */

  const {
    content,
    cta,
    ctaButtons,
    descriptionText,
    heading,
    imageWrapper,
    slide,
    slideContent,
    slideMedia,
    wrapper,
  } = TAILWIND_VARIANTS();

  const styles = parseStyleParams(props.params, ['cta1', 'cta2']);

  return (
    <div
      className={slide()}
      data-component="authorable/shared/lists/carouselitem"
      {...getTestProps(`carousel-item-${props?.rendering?.uid}`)}
    >
      <div className={slideMedia()}>
        <ImageWrapper className={imageWrapper()} field={image} {...getTestProps(`image`)} />
        <div className={slideContent()}>
          <div className={content()}>
            <div className={wrapper()}>
              <PlainTextWrapper
                className={heading()}
                field={title}
                tag="h2"
                {...getTestProps(`heading`)}
              />
              {description && (
                <RichTextWrapper
                  className={descriptionText()}
                  field={description}
                  {...getTestProps(`description`)}
                />
              )}
            </div>
            {primaryCTA && (
              <div className={ctaButtons()}>
                <LinkWrapper
                  ctaSurface="onSurface"
                  aria-label={primaryCTA?.value.text}
                  className={cta({ style: styles.cta1?.ctaVariant })}
                  ctaStyle={getCtaStyle(styles.cta1, 'fill')}
                  field={primaryCTA}
                  {...getTestProps(`primary-cta`)}
                ></LinkWrapper>
                <LinkWrapper
                  ctaSurface="onSurface"
                  aria-label={secondaryCTA?.value.text}
                  className={cta({ style: styles.cta2?.ctaVariant })}
                  ctaStyle={getCtaStyle(styles.cta2, 'outline')}
                  field={secondaryCTA}
                  {...getTestProps(`secondary-cta`)}
                ></LinkWrapper>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Default = withStandardComponentWrapper(CarouselItem);

const TAILWIND_VARIANTS = tv({
  slots: {
    content: [
      'slide-content-inner',
      'flex',
      'w-full',
      'md:max-w-[548px]',
      'shrink-0',
      'self-stretch',
      'mr-spacing-spacing-16',
      'md:mx-spacing-spacing-40',
      'md:my-spacing-spacing-48',
      'flex-col',
      'items-start',
      'justify-center',
      'px-component-carousel-content-padding-x',
      'py-component-carousel-content-padding-y',
      'md:rounded-border-radius-container-l2',
      'md:border-component-hero-copy-border-width',
      'md:border-component-carousel-color-content-border',
      'bg-component-carousel-color-content-surface',
      'gap-component-carousel-buttons-margin-top',
    ],
    cta: [],
    descriptionText: [
      'carousel-rich-text',
      'text-component-carousel-color-body',
      'font-typography-body-font-family',
      'text-typography-body-large-font-size',
      'font-normal',
      'leading-[27px]',
      'line-clamp-3',
    ],
    ctaButtons: [
      'flex',
      'flex-col',
      'gap-spacing-spacing-12',
      'md:flex-row',
      'w-full',
      'md:w-auto',
    ],
    heading: [
      'text-component-carousel-color-title',
      'font-typography-header-font-family',
      'text-typography-header-large-font-size',
      'font-bold',
      'md:leading-[48px]',
      'leading-[38px]',
      'line-clamp-1',
    ],
    imageWrapper: [
      'relative',
      'md:absolute',
      'inset-0',
      'object-cover',
      'w-full',
      'overflow-hidden',
      'md:rounded-[12px]',
      'aspect-video',
      'bg-center',
      'bg-cover',
      'left-0',
      'top-0',
      'xl:h-[550px]',
      'md:h-[470px]',
      'self-stretch',
    ],
    slide: [
      'flex',
      'md:justify-center',
      'xl:h-[550px]',
      'md:min-h-[470px]',
      'flex-col',
      'relative',
    ],
    slideContent: [
      'slide-content',
      'relative',
      'flex',
      'w-full',
      'z-10',
      'md:box-border',
      'md:text-left',
      'h-full',
      'overflow-auto',
      'items-stretch',
      'justify-start',
      'md:items-center',
    ],
    slideMedia: ['slide-media', 'h-full', 'flex', 'flex-col', 'md:min-h-full'],
    wrapper: ['flex', 'flex-col', 'gap-component-carousel-content-spacing-vertical'],
  },
  variants: {
    style: {
      link: {
        cta: [],
      },
      fill: {
        cta: [],
      },
      outline: {
        cta: [],
      },
      ghost: {
        cta: [],
      },
    },
  },
});
