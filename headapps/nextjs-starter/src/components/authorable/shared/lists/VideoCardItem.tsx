// Global
import React, { useState, useRef, useEffect, JSX } from 'react';
import { tv } from 'tailwind-variants';

// Local
import { Lists } from '.generated/Lists/VideoCardItem.model';
import { withStandardComponentWrapper } from 'helpers/HOC';
import ImageWrapper from 'helpers/SitecoreWrappers/ImageWrapper/ImageWrapper';
import PlainTextWrapper from 'helpers/SitecoreWrappers/PlainTextWrapper/PlainTextWrapper';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { useCardListContext } from './CardList';
import useDictionary from 'lib/hooks/useDictionary';
import { getVideoPlatform, getProcessedVideoUrl } from 'lib/utils/videoUtils';
import { lockBodyScroll, unlockBodyScroll } from 'lib/utils/scroll-lock';
import { getTestProps } from 'lib/testing/utils';
import ButtonWrapper, {
  ctaTailwindVariant,
} from 'helpers/SitecoreWrappers/ButtonWrapper/ButtonWrapper';
import { getCtaStyle } from 'lib/utils/cta-utils';
import { parseStyleParams } from 'lib/utils/style-param-utils';

export type VideoCardItemProps = Lists.VideoCardItem.VideoCardItem_Component;

const VideoCardItem = (props: VideoCardItemProps): JSX.Element => {
  const { videoUrl, cardImage, description, eyebrow, heading, subHeading } = props?.fields || {};
  const { RenderingIdentifier } = props?.params || {};

  const styles = parseStyleParams(props.params, ['cta2']);
  const ctaStyle = getCtaStyle(styles.cta2, 'link');

  // Get column count from CardList context
  const cardListColCount = useCardListContext();

  const iconClasses = ctaTailwindVariant({
    color: 'onSurfaceAlternate',
    iconAlignment: 'right',
    size: 'xl',
    style: ctaStyle.ctaVariant || 'link',
    visibility: 'visible',
  }).icon();

  const { getDictionaryValue } = useDictionary();

  // State for video modal
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [triggerElement, setTriggerElement] = useState<HTMLButtonElement | null>(null);

  // Refs for focus management
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const playButtonOverlayRef = useRef<HTMLButtonElement>(null);
  const videoLinkRef = useRef<HTMLButtonElement>(null);

  /*
   * Video Modal Functions
   */

  const handleVideoClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setTriggerElement(e.currentTarget);
    if (videoUrl?.value) {
      setIsVideoModalOpen(true);
    }
  };

  const handleCloseVideoModal = () => {
    setIsVideoModalOpen(false);
  };

  // Effect to handle Escape key press for closing the modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isVideoModalOpen) {
        handleCloseVideoModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVideoModalOpen]);

  // Effect for focus management
  useEffect(() => {
    if (isVideoModalOpen) {
      // Focus the modal's close button when it opens
      closeButtonRef.current?.focus();
    } else {
      // Return focus to the trigger element when the modal closes
      triggerElement?.focus();
    }
  }, [isVideoModalOpen, triggerElement]);

  // Effect for scroll locking when video modal opens/closes
  useEffect(() => {
    if (isVideoModalOpen) {
      lockBodyScroll();
    } else {
      unlockBodyScroll();
    }

    // Cleanup on unmount
    return () => {
      if (isVideoModalOpen) {
        unlockBodyScroll();
      }
    };
  }, [isVideoModalOpen]);

  // Check if video URL is valid
  const isValidVideoUrl = videoUrl?.value && getVideoPlatform(videoUrl.value);

  /*
   * Rendering
   */

  const {
    body,
    contentWrapper,
    content,
    descriptionText,
    eyebrowText,
    videoImageContainer,
    headingText,
    subheading,
    container,
    videoLink,
    modalOverlay,
    modalContent,
    modalCloseButton,
    playButtonOverlay,
    modalTitle,
    modalSubheading,
    modalDescription,
    videoPlayIcon,
    videoOverlay,
    playButtonIcon,
    modalVideoContainer,
    modalVideoIframe,
    noImageContainer,
    noImageIcon,
    imageWrapper,
  } = TAILWIND_VARIANTS({ colCount: cardListColCount });

  return (
    <div
      className={'h-full'}
      {...getTestProps(`component-video-card-item-${props?.rendering?.uid}`)}
    >
      <article
        className={container()}
        data-component="authorable/shared/lists/videocarditem"
        id={RenderingIdentifier}
      >
        <button
          ref={playButtonOverlayRef}
          onClick={handleVideoClick}
          className={videoImageContainer()}
          type="button"
          aria-label={`Play video: ${heading?.value || 'Video'}`}
          aria-expanded={isVideoModalOpen}
          aria-controls={`video-modal-${RenderingIdentifier}`}
        >
          {cardImage?.value?.src ? (
            <ImageWrapper
              field={cardImage}
              className={imageWrapper()}
              {...getTestProps(`thumbnail-image`)}
            />
          ) : (
            <div className={noImageContainer()} {...getTestProps(`no-image-container`)}>
              <SvgIcon icon="no-image" size="lg" viewBox="0 0 240 240" className={noImageIcon()} />
            </div>
          )}
          {isValidVideoUrl && (
            <>
              <span className={videoOverlay()} {...getTestProps(`video-overlay`)} />
              <span className={playButtonOverlay()} {...getTestProps(`play-button-overlay`)}>
                <SvgIcon
                  icon="play-control"
                  viewBox="0 0 44 44"
                  size="m"
                  className={playButtonIcon()}
                />
              </span>
            </>
          )}
        </button>
        <div className={body()}>
          <div className={contentWrapper()}>
            <div className={content()}>
              <PlainTextWrapper
                className={eyebrowText()}
                editable
                field={eyebrow}
                tag="div"
                {...getTestProps(`eyebrow`)}
              />
              <PlainTextWrapper
                className={headingText()}
                field={heading}
                tag="h3"
                {...getTestProps(`video-title`)}
              />
              <PlainTextWrapper
                className={subheading()}
                field={subHeading}
                tag="h4"
                {...getTestProps(`sub-heading`)}
              />
              <PlainTextWrapper
                className={descriptionText()}
                field={description}
                {...getTestProps(`description`)}
              />
            </div>
            {isValidVideoUrl && (
              <ButtonWrapper
                ctaSurface="onCard"
                ctaStyle={getCtaStyle(styles.cta2, 'link')}
                onClick={handleVideoClick}
                ref={videoLinkRef}
                aria-label={getDictionaryValue('WatchVideo', 'Watch Video')}
                aria-expanded={isVideoModalOpen}
                aria-controls={`video-modal-${RenderingIdentifier}`}
                {...getTestProps(`play-cta`)}
              >
                <span className={videoLink()}>
                  {getDictionaryValue('WatchVideo') || 'Watch Video'}
                  <SvgIcon
                    icon="video-play"
                    size="xs"
                    viewBox="0 0 18 18"
                    className={`${videoPlayIcon()} ${iconClasses}`}
                  />
                </span>
              </ButtonWrapper>
            )}
          </div>
        </div>
      </article>

      {/* Custom Video Modal */}
      {isVideoModalOpen && (
        <div
          id={`video-modal-${RenderingIdentifier}`}
          className={modalOverlay()}
          onClick={handleCloseVideoModal}
          {...getTestProps(`video-modal-${RenderingIdentifier}`)}
        >
          <div className={modalContent()} onClick={(e) => e.stopPropagation()}>
            <button
              ref={closeButtonRef}
              onClick={handleCloseVideoModal}
              className={modalCloseButton()}
              type="button"
              aria-label="Close video modal"
              {...getTestProps(`close-video-modal`)}
            >
              <SvgIcon icon="close" size="xxs" />
            </button>
            <div className={modalVideoContainer()}>
              <iframe
                src={getProcessedVideoUrl(videoUrl?.value || '')}
                title={heading?.value || 'Video'}
                className={modalVideoIframe()}
                allowFullScreen
                allow="autoplay; fullscreen; picture-in-picture"
                sandbox="allow-same-origin allow-scripts allow-presentation"
                {...getTestProps(`video-iframe`)}
              />
            </div>
            <div>
              <PlainTextWrapper
                className={modalTitle()}
                field={heading}
                tag="h3"
                {...getTestProps(`modal-title`)}
              />
              <PlainTextWrapper
                className={modalSubheading()}
                field={subHeading}
                tag="h4"
                {...getTestProps(`modal-sub-heading`)}
              />
              <PlainTextWrapper
                className={modalDescription()}
                field={description}
                {...getTestProps(`modal-description`)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const Default = withStandardComponentWrapper(VideoCardItem);

const TAILWIND_VARIANTS = tv({
  defaultVariants: {
    style: 'primary',
    colCount: '1',
  },
  slots: {
    container: [
      'flex',
      'h-full',
      'w-full',
      'overflow-hidden',
      'border-solid',
      'border-component-card-item-video-border-width',
      'border-component-card-item-video-color-border',
      'rounded-component-card-item-article-card-radius',
      'bg-component-card-item-video-color-surface',
    ],
    body: ['flex', 'flex-col', 'h-full', 'w-full', 'justify-center', 'items-center'],
    contentWrapper: [
      'flex',
      'flex-col',
      'w-full',
      'gap-spacing-spacing-4',
      'pt-component-card-item-video-portrait-content-padding-top',
      'pb-component-card-item-video-portrait-content-padding-bottom',
      'px-component-card-item-video-portrait-content-padding-x',
    ],
    content: ['flex', 'flex-col', 'h-full', 'w-full'],
    eyebrowText: [
      'font-semibold',
      'text-component-card-item-video-color-eyebrow',
      'text-typography-body-small-font-size',
      'mb-spacing-spacing-4',
      'font-regular',
      'line-clamp-1',
    ],
    videoImageContainer: [
      'relative',
      'min-h-max',
      'w-full',
      'rounded-component-card-item-video-image-radius',
      'overflow-hidden',
      'aspect-video',
      'text-color-fill-brand-1',
      'transition',
      'duration-300',
      'ease-in-out',
      'group',
      'pt-component-card-item-video-portrait-image-padding-top',
      'px-component-card-item-video-portrait-image-padding-x',
      'pb-component-card-item-video-portrait-image-padding-bottom',
    ],
    headingText: [
      'font-typography-font-weight-bold',
      'text-typography-body-large-font-size',
      'text-component-card-item-video-color-title',
      'leading-typography-body-large-line-height',
      'line-clamp-1',
    ],
    subheading: [
      'font-semibold',
      'text-typography-body-medium-font-size',
      'leading-typography-body-medium-line-height',
      'text-component-card-item-video-color-subheading',
      'line-clamp-1',
    ],
    descriptionText: [
      'text-typography-body-medium-font-size',
      'text-component-card-item-video-color-body',
      'leading-typography-body-medium-line-height',
      'font-typography-body-small-font-weight',
    ],
    videoLink: [
      'flex',
      'font-typography-font-weight-bold',
      'text-typography-body-large-font-size',
      'mt-component-card-item-video-landscape-content-button-margin-top',
      'items-center',
      'w-fit',
      'gap-2',
      'group-hover:opacity-75',
      'transition-opacity',
      'duration-200',
    ],
    modalOverlay: [
      'fixed',
      'inset-0',
      'bg-black',
      'bg-opacity-75',
      'flex',
      'items-center',
      'justify-center',
      'z-50',
      'p-4',
    ],
    modalContent: [
      'flex',
      'flex-col',
      'relative',
      'bg-component-modal-surface',
      'w-full',
      'rounded-border-radius-variety-container',
      'md:p-spacing-spacing-40',
      'px-spacing-spacing-16',
      'py-spacing-spacing-24',
      'max-w-4xl',
      'max-h-[90vh]',
      'gap-4',
      'overflow-y-auto',
    ],
    modalCloseButton: [
      'absolute',
      'right-2',
      'top-2',
      'md:top-4',
      'md:right-8',
      'text-typography-body-large-font-size',
      'font-typography-font-weight-bold',
      'text-color-text-text-secondary',
      'hover:text-color-text-text',
      'cursor-pointer',
      'z-10',
      'w-8',
      'h-8',
      'flex',
      'items-center',
      'justify-center',
    ],
    playButtonOverlay: ['absolute', 'z-10'],
    modalTitle: [
      'font-typography-font-weight-bold',
      'text-typography-body-large-font-size',
      'text-modal-title',
      'line-clamp-2',
    ],
    modalSubheading: [
      'font-typography-font-weight-bold',
      'text-typography-body-large-font-size',
      'text-component-modal-subtitle',
      'line-clamp-2',
    ],
    modalDescription: [
      'text-typography-body-medium-font-size',
      'text-component-modal-body',
      'leading-typography-body-medium-line-height',
      'mb-spacing-spacing-8',
      'font-typography-body-small-font-weight',
    ],
    videoPlayIcon: ['!h-5', '!w-5', 'transition-all', 'duration-300'],
    videoOverlay: [
      'absolute',
      'inset-0',
      'bg-black',
      'bg-opacity-0',
      'group-hover:bg-black/30',
      'group-focus:bg-black/30',
      'transition-all',
      'duration-300',
      'ease-in-out',
      'mt-component-card-item-video-portrait-image-padding-top',
      'mx-component-card-item-video-portrait-image-padding-x',
      'mb-component-card-item-video-portrait-image-padding-bottom',
      'rounded-component-card-item-video-image-radius',
    ],
    playButtonIcon: ['transition-all', 'duration-300'],
    modalVideoContainer: [
      'relative',
      'w-full',
      'aspect-video',
      'mt-spacing-spacing-16',
      'rounded-border-radius-variety-label',
      'overflow-hidden',
    ],
    modalVideoIframe: [
      'absolute',
      'top-0',
      'left-0',
      'w-full',
      'h-full',
      'rounded-border-radius-variety-label',
    ],
    noImageContainer: [
      'flex',
      'items-center',
      'justify-center',
      'h-full',
      'bg-color-neutral-1-400',
      'rounded-component-card-item-video-image-radius',
    ],
    noImageIcon: ['text-color-text-text-secondary', 'opacity-50'],
    imageWrapper: [
      'w-full',
      'h-full',
      'object-cover',
      'rounded-component-card-item-video-image-radius',
    ],
  },
  variants: {
    colCount: {
      '1': {
        container: ['flex-col', 'md:flex-row', 'md:gap-0'],
        videoImageContainer: [
          'sm:py-component-card-item-video-landscape-image-padding-y',
          'sm:px-component-card-item-video-landscape-image-padding-x',
          'sm:pr-0',
        ],
        videoOverlay: [
          'sm:my-component-card-item-video-landscape-image-padding-y',
          'sm:mx-component-card-item-video-landscape-image-padding-x',
          'sm:mr-0',
        ],
        body: ['flex-row', 'items-start', 'text-left', 'lg:pl-0'],
        description: ['md:line-clamp-3', 'lg:line-clamp-6'],
        contentWrapper: [
          'text-left',
          'justify-center',
          'sm:py-component-card-item-video-landscape-content-padding-y',
          'sm:px-component-card-item-video-landscape-content-padding-x',
          'lg:py-component-card-item-video-landscape-content-1-col-padding-y',
          'lg:px-component-card-item-video-landscape-content-1-col-padding-x',
        ],
        playButtonOverlay: [
          'bottom-3',
          'right-3',
          'lg:bottom-5',
          'lg:right-5',
          'scale-75',
          'lg:scale-100',
        ],
      },
      '2': {
        container: ['flex-col', 'md:flex-row'],
        videoImageContainer: [
          'aspect-video',
          'lg:aspect-[5/4]',
          'sm:py-component-card-item-video-landscape-image-padding-y',
          'sm:px-component-card-item-video-landscape-image-padding-x',
          'sm:pr-0',
        ],
        videoOverlay: [
          'sm:my-component-card-item-video-landscape-image-padding-y',
          'sm:mx-component-card-item-video-landscape-image-padding-x',
          'sm:mr-0',
        ],
        body: ['flex-row', 'items-start', 'text-left'],
        description: ['md:line-clamp-3', 'lg:line-clamp-2'],
        contentWrapper: [
          'text-left',
          'justify-center',
          'sm:py-component-card-item-video-landscape-content-padding-y',
          'sm:px-component-card-item-video-landscape-content-padding-x',
        ],
        playButtonOverlay: ['bottom-3', 'right-3', 'scale-75'],
      },
      '3': {
        container: ['flex-col'],
        body: ['flex-col', 'items-start', 'text-left'],
        contentWrapper: ['h-full', 'text-left'],
        playButtonOverlay: ['bottom-3', 'right-3', 'scale-75'],
        videoLink: ['h-auto', 'items-end'],
      },
      '4': {
        container: ['flex-col'],
        body: ['flex-col', 'items-center', 'text-left'],
        contentWrapper: ['h-full', 'text-left'],
        playButtonOverlay: ['bottom-3', 'right-3', 'scale-75'],
        videoLink: ['h-auto', 'items-end'],
      },
    },
  },
});
