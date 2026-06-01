// Global
import { Text } from '@sitecore-content-sdk/nextjs';
import React, { useCallback, useRef, JSX } from 'react';
import { tv } from 'tailwind-variants';

// Local
import { Lists } from '.generated/Lists/Accordion.model';
import RichTextWrapper from 'helpers/SitecoreWrappers/RichTextWrapper/RichTextWrapper';
import { withStandardComponentWrapper } from 'helpers/HOC';
import { SvgIcon } from 'helpers/SvgIcon';
import { useScrollElementIntoView } from 'lib/hooks/useScrollElementIntoView';
import { useAccordionItemContext } from 'helpers/Context/AccordionContext';
import { getTestProps } from 'lib/testing/utils';
import { toValidId } from 'lib/utils/validate-id-utils';

export type AccordionItemProps = Lists.Accordion.AccordionItem_Component;

const AccordionItem = (props: AccordionItemProps): JSX.Element => {
  const { content, heading } = props?.fields || {};
  const { uid } = props?.rendering || {};

  const accordionId = `accordion-${uid}`;
  /*
   * REFS
   */

  const accordionItemButtonRef = useRef<HTMLButtonElement>(null);

  const accordionItemBodyRef = useRef<HTMLDivElement>(null);

  /*
   * State
   */

  const { isOpening, toggleOpen, isVisible, scrollToOpenPanel } = useAccordionItemContext(
    uid ?? '',
    accordionItemBodyRef
  );

  /*
   * Convenience Methods
   */

  const toggleAccordion = useCallback(() => {
    toggleOpen();
  }, [toggleOpen]);

  /*
   * Lifecycle
   */

  const scrollCondition = scrollToOpenPanel && isOpening;

  useScrollElementIntoView(accordionItemButtonRef.current, {
    stickyHeaderId: 'header',
    condition: scrollCondition,
    animationElement: accordionItemBodyRef.current,
    scrollTargetId: accordionId,
  });

  /*
   * Rendering
   */

  const {
    base,
    buttonWrapper,
    iconWrapper,
    contentContainer,
    contentContainerInner,
    richTextWrapper,
    headingText,
  } = TAILWIND_VARIANTS({
    isOpening,
    isVisible,
  });

  return (
    <div
      className={base()}
      data-component="authorable/shared/lists/accordionitem"
      key={accordionId}
      {...getTestProps(`accordion-item-${accordionId}`)}
    >
      <div className="flex flex-col gap">
        <button
          aria-expanded={isOpening}
          className={buttonWrapper()}
          onClick={toggleAccordion}
          ref={accordionItemButtonRef}
          type="button"
          aria-controls={`accordion-item-${toValidId(accordionId || '')}`}
          {...getTestProps(`toggle-button`)}
        >
          <Text field={heading} className={headingText()} tag="h3" {...getTestProps(`heading`)} />
          <span className={iconWrapper()} {...getTestProps(`icon`)}>
            <SvgIcon fill="none" icon="chevron-down" size="xs" viewBox="0 0 24 24" />
          </span>
        </button>
        <div
          aria-labelledby={accordionId}
          id={`accordion-item-${toValidId(accordionId || '')}`}
          className={contentContainer()}
          role="region"
          ref={accordionItemBodyRef}
          tabIndex={isOpening ? undefined : -1}
          aria-hidden={!isOpening}
        >
          <div className={contentContainerInner()}>
            <RichTextWrapper
              aria-required={isOpening}
              className={richTextWrapper()}
              field={content}
              tabIndex={-1}
              {...getTestProps(`content`)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const Default = withStandardComponentWrapper(AccordionItem);

const TAILWIND_VARIANTS = tv({
  defaultVariants: {
    isOpen: false,
    isVisible: true,
  },
  slots: {
    base: [
      'group',
      'border-solid',
      'border-component-accordion-item-border-width',
      'border-component-accordion-item-default-border',
      'hover:border-component-accordion-item-hover-border',
      'hover:bg-component-accordion-item-hover-surface',
      'rounded-border-radius-variety-accordion',
      'overflow-hidden',
      'hover:outline',
      'hover:outline-component-accordion-item-hover-border',
      'hover:-outline-offset-[var(--component-accordion-item-border-width-hover)]',
      'hover:outline-[var(--component-accordion-item-border-width-hover)]',
      '[&:has(:focus-visible)]:outline',
      '[&:has(:focus-visible)]:outline-4',
      '[&:has(:focus-visible)]:outline-componentTheme---bg-interaction-focus',
      '[&:has(:focus-visible)]:outline-offset-1',
    ],
    buttonWrapper: [
      'cursor-pointer',
      'duration-300',
      'flex',
      'items-center',
      'justify-between',
      'px-component-accordion-item-padding-item-x',
      'py-component-accordion-item-padding-item-y',
      'transition-none',
      'w-full',
      'scroll-mt-[123px]',
      'hover:underline',
      'focus-visible:outline-none',
    ],
    contentContainer: ['duration-300', 'ease-in-out', 'grid', 'overflow-hidden', 'transition-all'],
    contentContainerInner: ['overflow-hidden'],
    iconWrapper: [
      'transform',
      'transition-transform',
      'mx-spacing-spacing-4',
      'text-component-accordion-item-default-icon',
      'group-hover:text-component-accordion-item-hover-icon',
    ],
    richTextWrapper: [
      'text-left',
      'font-normal',
      'mb-0',
      'px-component-accordion-item-padding-item-x',
      'pb-component-accordion-item-padding-item-y',
      'font-typography-body-font-family',
      'text-typography-body-medium-font-size',
      'text-component-accordion-item-active-body',
      'font-normal',
      'leading-normal',
    ],
    headingText: [
      'text-component-accordion-item-default-label',
      'group-hover:text-component-accordion-item-hover-label',
      'font-typography-body-font-family',
      'text-typography-body-large-font-size',
      'font-bold',
      'text-left',
      'leading-typography-body-large-line-height',
    ],
  },
  variants: {
    isOpening: {
      false: {
        buttonWrapper: [
          'bg-component-accordion-item-default-surface',
          'hover:bg-component-accordion-item-hover-surface',
        ],
        contentContainer: [
          'grid-rows-[0fr]',
          'opacity-0',
          'pointer-events-none',
          'select-none',
          'invisible',
          'bg-component-accordion-item-default-surface',
        ],
        iconWrapper: [],
      },
      true: {
        base: ['border-component-accordion-item-active-border'],
        buttonWrapper: ['bg-component-accordion-item-active-surface'],
        headingText: ['!text-component-accordion-item-active-headline'],
        contentContainer: [
          'grid-rows-[1fr]',
          'opacity-100',
          'visible',
          'bg-component-accordion-item-active-surface',
        ],
        iconWrapper: ['rotate-180', 'text-component-accordion-item-active-icon'],
      },
    },

    isVisible: {
      false: ['max-sm:hidden'],
      true: [],
    },
  },
});
