// Global
import React, { JSX } from 'react';
import { tv } from 'tailwind-variants';
import { Image as JSSImage } from '@sitecore-content-sdk/nextjs';
// Local
import { Media } from '.generated/Media/InlineImage.model';
import { withStandardComponentWrapper } from 'helpers/HOC';
import PlainTextWrapper from 'helpers/SitecoreWrappers/PlainTextWrapper/PlainTextWrapper';
import { useIsMobile } from 'lib/hooks/useIsMobile';
import useIsEditing from 'lib/hooks/useIsEditing';
import { EditingHelpText } from 'helpers/Editing/EditingHelpText';
import useDictionary from 'lib/hooks/useDictionary';
import { SectionWrapper } from 'helpers/GenericWrappers/SectionWrapper/SectionWrapper';
import { getTestProps } from 'lib/testing/utils';
import { getNextImageProps } from 'lib/utils/image-utils';

export type InlineImageProps = Media.InlineImage.InlineImage_Component;

const InlineImage = (props: InlineImageProps): JSX.Element => {
  const { desktopImage, mobileImage, caption } = props?.fields || {};
  const isMobile = useIsMobile();
  const isEditing = useIsEditing();
  const { getDictionaryValue } = useDictionary();

  const { fallbackImage, caption: captionClass, imageContainer } = TAILWIND_VARIANTS();

  // Show placeholder in editing mode if no desktop image is provided
  // Desktop image is mandatory as it's the primary image and required for the component to render
  // Mobile image is optional and only used for responsive optimization on smaller screens
  if (isEditing && !desktopImage?.value?.src) {
    return (
      <SectionWrapper>
        <EditingHelpText priority="warning">
          {getDictionaryValue('ImageUnavailable') ||
            'Select the entire InlineImage block to edit both desktop and mobile images.'}
        </EditingHelpText>
        <figure data-component="authorable/shared/media/inline-image">
          <div className={imageContainer()}>
            <JSSImage
              editable={true}
              field={desktopImage}
              className={fallbackImage()}
              alt="No image selected"
            />
          </div>
          <figcaption className={captionClass()}>
            <PlainTextWrapper field={caption} />
          </figcaption>
        </figure>
      </SectionWrapper>
    );
  }

  // Don't render if no desktop image is provided
  if (!desktopImage?.value?.src) {
    return <></>;
  }

  // Use desktop image as fallback if mobile image is not provided
  const effectiveMobileImage = mobileImage?.value?.src ? mobileImage : desktopImage;

  // Don't render if effectiveMobileImage doesn't have valid value
  if (!effectiveMobileImage?.value?.src) {
    return <></>;
  }

  // Helper function to safely convert string dimensions to numbers from sitecore
  const toDimension = (value: string | number | undefined, fallback: number): number => {
    const parsed = typeof value === 'number' ? value : parseInt(String(value || ''), 10);
    return isNaN(parsed) ? fallback : parsed;
  };

  // Get optimized image props for both desktop and mobile images
  const {
    srcSet: desktopSrcSet,
    src: desktopSrc,
    ...desktopRest
  } = getNextImageProps({
    src: desktopImage.value.src,
    width: toDimension(desktopImage.value.width as string | number, 1280),
    height: toDimension(desktopImage.value.height as string | number, 516),
  });

  const { srcSet: mobileSrcSet, src: mobileSrc } = getNextImageProps({
    src: effectiveMobileImage.value.src,
    width: toDimension(effectiveMobileImage.value.width as string | number, 600),
    height: toDimension(effectiveMobileImage.value.height as string | number, 400),
  });

  if (!desktopSrcSet || !mobileSrcSet) {
    return <></>;
  }
  // Determine which alt text to use based on screen size
  const altText = isMobile
    ? (effectiveMobileImage.value.alt as string) || ''
    : (desktopImage.value.alt as string) || '';

  return (
    <SectionWrapper>
      <figure
        data-component="authorable/shared/media/inline-image"
        {...getTestProps(`component-inline-image-${props?.rendering?.uid}`)}
      >
        <picture>
          {/* Desktop Image - md+ screens */}
          <source
            media="(min-width: 768px)"
            srcSet={desktopSrcSet || desktopSrc}
            {...getTestProps(`desktop-image`)}
          />

          {/* Mobile Image - <md screens */}
          <source
            media="(max-width: 767px)"
            srcSet={mobileSrcSet || mobileSrc}
            {...getTestProps(`mobile-image`)}
          />

          {/* Fallback image */}
          <img
            {...desktopRest}
            src={desktopSrc}
            alt={altText}
            className={fallbackImage()}
            {...getTestProps(`fallback-image`)}
          />
        </picture>

        {(isEditing || caption?.value) && (
          <figcaption className={captionClass()}>
            <PlainTextWrapper field={caption} {...getTestProps(`caption`)} />
          </figcaption>
        )}
      </figure>
    </SectionWrapper>
  );
};

export const Default = withStandardComponentWrapper(InlineImage);

const TAILWIND_VARIANTS = tv({
  slots: {
    fallbackImage: ['max-w-full', 'h-auto', 'rounded-border-radius-image'],
    caption: ['mt-2', 'text-body-small', 'text-color-text-text-secondary', 'italic'],
    imageContainer: ['flex', 'flex-col', 'items-center'],
  },
});
