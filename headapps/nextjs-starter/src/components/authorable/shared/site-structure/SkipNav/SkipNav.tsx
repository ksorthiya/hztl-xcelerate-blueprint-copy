// Global
import React from 'react';
import { tv } from 'tailwind-variants';

// Local
import useDictionary from 'lib/hooks/useDictionary';
import { smoothScrollToElement } from 'lib/hooks/useScrollElementIntoView';
import { SvgIcon } from 'helpers/SvgIcon';
import PlainTextWrapper from 'helpers/SitecoreWrappers/PlainTextWrapper/PlainTextWrapper';
import { getTestProps } from 'lib/testing/utils';

const SkipNav: React.FC = () => {
  const { base } = TAILWIND_VARIANTS();
  const { getDictionaryValue } = useDictionary();
  /*
   * Rendering
   */
  return (
    <div
      data-component="authorable/shared/site-structure/skipnav/skipnav"
      {...getTestProps(`component-skip-nav`)}
    >
      <button
        className={base()}
        role="button"
        {...getTestProps(`link`)}
        onClick={() => {
          const elem = document.getElementById('main-content');
          if (elem) {
            smoothScrollToElement(elem, 'header', null, 0, undefined, () => {
              elem.setAttribute('tabindex', '-1');
              elem.focus({ preventScroll: true });
              elem.removeAttribute('tabindex');
            });
          }
        }}
      >
        <SvgIcon icon="arrow-down" size="s" />
        <PlainTextWrapper
          field={{ value: getDictionaryValue('SkipToMainContent') || 'Skip to main content' }}
          tag="p"
        />
      </button>
    </div>
  );
};

export default SkipNav;

const TAILWIND_VARIANTS = tv({
  slots: {
    base: [
      'left-1',
      'sr-only',
      'top-1',
      'z-50',
      'focus-visible:absolute',
      'focus-visible:not-sr-only',
      'focus-visible:flex',
      'focus-visible:items-center',
      'focus-visible:gap-spacing-spacing-8',
      'focus-visible:py-spacing-spacing-16',
      'focus-visible:px-spacing-spacing-24',
      'focus-visible:rounded-border-radius-variety-button',
      'focus-visible:border-border-width-button',
      'focus-visible:border-component-button-on-bg-filled-border',
      'focus-visible:bg-component-button-on-bg-filled-bg',
      'focus-visible:text-component-button-on-bg-filled-text',
      'focus-visible:font-typography-body-font-family',
      'focus-visible:text-typography-body-large-font-size',
      'focus-visible:outline-none',
      'focus-visible:ring-4',
      'focus-visible:ring-offset-1',
      'focus-visible:ring-offset-white/75',
      'focus-visible:ring-componentTheme---bg-interaction-focus',
    ],
  },
});
