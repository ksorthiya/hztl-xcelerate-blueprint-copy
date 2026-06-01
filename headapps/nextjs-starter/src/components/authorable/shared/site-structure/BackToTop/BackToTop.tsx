// Global
import { tv } from 'tailwind-variants';

// Local
import { SvgIcon } from 'helpers/SvgIcon';
import useDictionary from 'lib/hooks/useDictionary';
import { useIsScrolled } from 'lib/hooks/useIsScrolled';
import { getTestProps } from 'lib/testing/utils';

const tailwindVariants = tv({
  slots: {
    base: [
      'fixed',
      'bottom-4',
      'right-2',
      'z-40',
      'flex',
      'items-center',
      'gap-4',
      'group',
      'md:bottom-6',
      'md:right-6',
      'transition-opacity',
      'duration-300',
      'ease-in-out',
    ],
    button: [
      'flex',
      'items-center',
      'justify-center',
      'w-11',
      'h-11',
      'md:w-14',
      'md:h-14',
      'p-spacing-spacing-16',
      'gap-spacing-spacing-8',
      'bg-component-button-on-surface-filled-bg',
      'text-component-button-on-surface-filled-icon',
      'border',
      'border-border-width-button',
      'border-white',
      'rounded-border-radius-variety-button',
      'shadow-lg',
      'hover:bg-component-button-on-surface-filled-bg-hover',
      'focus-visible:outline-none',
      'focus-visible:ring-4',
      'focus-visible:ring-offset-1',
      'focus-visible:ring-offset-white/75',
      'focus-visible:ring-componentTheme---surface-interaction-focus',
      'disabled:bg-component-button-on-surface-filled-bg-disabled',
      'transition-colors',
      'duration-200',
      'group',
    ],
    label: [
      'hidden',
      'bg-color-general-bg-light',
      'text-color-general-text-darkest',
      'duration-300',
      'md:flex',
      'font-semibold',
      'items-center',
      'justify-center',
      'min-h-8',
      'md:min-h-8',
      'mt-0',
      'w-0',
      'order-first',
      'overflow-hidden',
      'py-spacing-spacing-8',
      'rounded',
      'transition-[width,padding]',
      'whitespace-nowrap',
      'group-hover:px-4',
      'group-hover:w-auto',
      'group-focus:px-4',
      'group-focus:w-auto',
    ],
  },
  variants: {
    isVisible: {
      true: {
        base: ['opacity-100', 'pointer-events-auto'],
      },
      false: {
        base: ['opacity-0', 'pointer-events-none'],
      },
    },
  },
});

const BackToTop = () => {
  const isScrolled = useIsScrolled();

  const { getDictionaryValue } = useDictionary();
  const fallbackText = 'Back to top';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const { base, button, label } = tailwindVariants({ isVisible: isScrolled });

  return (
    <div
      className={base()}
      data-component="authorable/shared/site-structure/backtotop"
      {...getTestProps(`component-back-to-top`)}
    >
      <button
        className={button()}
        onClick={scrollToTop}
        aria-label={getDictionaryValue('BackToTopText') || fallbackText}
        aria-hidden={!isScrolled}
        disabled={!isScrolled}
        type="button"
        {...getTestProps(`back-to-top-button`)}
      >
        <span className="sr-only">{getDictionaryValue('BackToTopText') || fallbackText}</span>
        <SvgIcon icon="chevron-up" size="xs" />
      </button>
      <span className={label()}>{getDictionaryValue('BackToTopText') || fallbackText}</span>
    </div>
  );
};

export default BackToTop;
