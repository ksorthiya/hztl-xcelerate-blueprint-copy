// Global
import { sendGTMEvent } from '@next/third-parties/google';
import React, { ButtonHTMLAttributes, forwardRef, JSX } from 'react';
import { tv } from 'tailwind-variants';

// Local
import { SvgIcon } from 'helpers/SvgIcon';
import { GtmEvent } from 'lib/utils/gtm-utils';
import { StyleParamRecord } from 'lib/utils/style-param-utils';
import {
  CtaElements,
  CtaIconAlignments,
  CtaIcons,
  CtaSizes,
  CtaStyleProperties,
  CtaVariants,
  CtaVisibility,
} from 'lib/utils/style-param-utils/modules/ctas';

export type CtaSurface = 'onBg' | 'onSurface' | 'onCard';
export type CtaColor = 'onBg' | 'onSurface' | 'onSurfaceAlternate';

type CtaPropsBase = {
  ctaVariant?: CtaVariants | 'custom';
  ctaStyle?: StyleParamRecord<CtaElements, CtaStyleProperties>;
  ctaIcon?: CtaIcons;
  ctaIconAlignment?: CtaIconAlignments;
  ctaVisibility?: CtaVisibility;
  ctaSize?: CtaSizes;
};

// ctaComponentClass is optional for custom buttons
type CtaPropsCustom = CtaPropsBase & {
  ctaVariant: 'custom';
};

export type CtaPropsNormal = CtaPropsBase & {
  ctaVariant?: CtaVariants;
  ctaSurface?: CtaSurface;
};

export type CtaProps = CtaPropsCustom | CtaPropsNormal;

export type ButtonWrapperProps = ButtonHTMLAttributes<HTMLButtonElement> &
  CtaProps &
  React.PropsWithChildren & {
    className?: string;
    gtmEvent?: GtmEvent;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    text?: string;
  };

const ButtonWrapper = forwardRef<HTMLButtonElement, ButtonWrapperProps>(
  (
    { className, gtmEvent, onClick, text, children, ...props }: ButtonWrapperProps,
    ref
  ): JSX.Element | null => {
    const ctaIcon = props.ctaIcon ?? props.ctaStyle?.ctaIcon;
    const ctaVariant = props.ctaVariant ?? props.ctaStyle?.ctaVariant ?? 'fill';
    const ctaIconAlignment = props.ctaIconAlignment ?? props.ctaStyle?.ctaIconAlignment ?? 'right';
    const ctaNormalProps = props as CtaPropsNormal | undefined;
    const ctaSurface =
      (ctaNormalProps?.ctaSurface === 'onCard'
        ? 'onSurfaceAlternate'
        : ctaNormalProps?.ctaSurface) ?? 'onBg';
    delete (props as CtaPropsNormal).ctaSurface;
    const ctaSize = props.ctaSize ?? props.ctaStyle?.ctaSize ?? 'xl';

    const { base, icon } = ctaTailwindVariant({
      className: className,
      iconAlignment: ctaIconAlignment,
      style: ctaVariant,
      color: ctaSurface,
      size: ctaSize,
    });

    /*
     * EVENT HANDLERS
     */

    const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (gtmEvent) {
        sendGTMEvent({ ...gtmEvent });
      }

      if (onClick) {
        onClick(e);
      }
    };

    /*
     * RENDERING
     */

    // If no content is present, don't print
    if (!text && !children) return <></>;

    return (
      <button className={base()} onClick={handleOnClick} ref={ref} disabled={props.disabled}>
        {text}
        {children}
        {ctaIcon && <SvgIcon className={icon()} icon={ctaIcon} size="xs" />}
      </button>
    );
  }
);

ButtonWrapper.displayName = 'ButtonWrapper';

export default ButtonWrapper;

export const ctaTailwindVariant = tv({
  slots: {
    base: ['group', 'inline-flex', 'gap-spacing-spacing-8'],
    icon: [],
  },
  variants: {
    size: {
      xl: {
        base: [
          'py-component-button-xl-padding-y',
          'px-component-button-xl-padding-x',
          'font-typography-button-font-family',
          'text-typography-button-xlarge-font-size',
          'font-typography-button-xlarge-font-weight',
          'leading-[var(--typography-button-xlarge-line-height)]',
          'tracking-[var(--typography-button-xlarge-letter-spacing)]',
        ],
      },
      lg: {
        base: [
          'py-component-button-l-padding-y',
          'px-component-button-l-padding-x',
          'font-typography-button-font-family',
          'text-typography-button-large-font-size',
          'font-typography-button-large-font-weight',
          'leading-[var(--typography-button-large-line-height)]',
          'tracking-[var(--typography-button-large-letter-spacing)]',
        ],
      },
    },
    iconAlignment: {
      left: {
        base: ['flex-row-reverse'],
      },
      right: {
        base: ['flex-row'],
      },
    },
    style: {
      custom: {
        base: [],
      },
      link: {
        base: [
          'border-0',
          'h-fit',
          'w-fit',
          'items-center',
          'focus-visible:underline',
          'focus-visible:outline-none',
          'focus-visible:rounded-border-radius-variety-button',
          'focus-visible:ring-4',
          'focus-visible:ring-offset-1',
          'focus-visible:ring-offset-white/75',
        ],
      },
      fill: {
        base: [
          'overflow-hidden',
          'rounded-border-radius-variety-button',
          'border-border-width-button',
          'items-center',
          'justify-center',
          'text-center',
          'transition-colors',
          'duration-300',
          'focus-visible:outline-none',
          'focus-visible:ring-4',
          'focus-visible:ring-offset-1',
          'focus-visible:ring-offset-white/75',
        ],
      },
      outline: {
        base: [
          'overflow-hidden',
          'rounded-border-radius-variety-button',
          'border-border-width-button',
          'items-center',
          'justify-center',
          'gap-spacing-spacing-8',
          'w-full',
          'md:w-auto',
          'min-w-[7.5rem]',
          'text-center',
          'disabled:no-underline',
          'focus-visible:outline-none',
          'focus-visible:ring-4',
          'focus-visible:ring-offset-1',
          'focus-visible:ring-offset-white/75',
          'hover:no-underline',
          'transition-colors',
          'duration-300',
        ],
      },
      ghost: {
        base: [
          'overflow-hidden',
          'rounded-border-radius-variety-button',
          'border-border-width-button',
          'gap-spacing-spacing-8',
          'items-center',
          'justify-center',
          'text-center',
          'focus-visible:outline-none',
          'focus-visible:ring-4',
          'focus-visible:ring-offset-1',
          'focus-visible:ring-offset-white/75',
        ],
      },
    },
    visibility: {
      visible: {
        base: [],
      },
      hidden: {
        base: ['hidden'],
      },
    },
    color: {
      onBg: {
        base: [],
      },
      onSurface: {
        base: [],
      },
      onSurfaceAlternate: {
        base: [],
      },
    },
  },
  compoundVariants: [
    {
      style: 'fill',
      color: 'onBg',
      class: {
        base: [
          'border-component-button-on-bg-filled-border',
          'bg-component-button-on-bg-filled-bg',
          'text-component-button-on-bg-filled-text',
          'hover:border-component-button-on-bg-filled-border-hover',
          'hover:bg-component-button-on-bg-filled-bg-hover',
          'hover:text-component-button-on-bg-filled-text-hover',
          'focus-visible:ring-componentTheme---bg-interaction-focus',
          'active:border-component-button-on-bg-filled-border-pressed',
          'active:bg-component-button-on-bg-filled-bg-pressed',
          'active:text-component-button-on-bg-filled-text-pressed',
          'disabled:border-component-button-on-bg-filled-border-disabled',
          'disabled:bg-component-button-on-bg-filled-bg-disabled',
          'disabled:text-component-button-on-bg-filled-text-disabled',
        ],
        icon: [
          'text-component-button-on-bg-filled-icon',
          'group-hover:text-component-button-on-bg-filled-icon-hover',
          'group-active:text-component-button-on-bg-filled-icon-pressed',
          'disabled:text-component-button-on-bg-filled-icon-disabled',
        ],
      },
    },
    {
      style: 'fill',
      color: 'onSurface',
      class: {
        base: [
          'border-component-button-on-surface-filled-border',
          'bg-component-button-on-surface-filled-bg',
          'text-component-button-on-surface-filled-text',
          'hover:border-component-button-on-surface-filled-border-hover',
          'hover:bg-component-button-on-surface-filled-bg-hover',
          'hover:text-component-button-on-surface-filled-text-hover',
          'focus-visible:ring-componentTheme---surface-interaction-focus',
          'active:border-component-button-on-surface-filled-border-pressed',
          'active:bg-component-button-on-surface-filled-bg-pressed',
          'active:text-component-button-on-surface-filled-text-pressed',
          'disabled:border-component-button-on-surface-filled-border-disabled',
          'disabled:bg-component-button-on-surface-filled-bg-disabled',
          'disabled:opacity-40',
        ],
        icon: [
          'text-component-button-on-surface-filled-icon',
          'group-hover:text-component-button-on-surface-filled-icon-hover',
          'group-active:text-component-button-on-surface-filled-icon-pressed',
          'disabled:text-component-button-on-surface-filled-icon-disabled',
        ],
      },
    },
    {
      style: 'fill',
      color: 'onSurfaceAlternate',
      class: {
        base: [
          'border-component-button-on-surface-alternate-filled-border',
          'bg-component-button-on-surface-alternate-filled-bg',
          'text-component-button-on-surface-alternate-filled-text',
          'hover:border-component-button-on-surface-alternate-filled-border-hover',
          'hover:bg-component-button-on-surface-alternate-filled-bg-hover',
          'hover:text-component-button-on-surface-alternate-filled-text-hover',
          'focus-visible:ring-componentTheme---surface-alternate-interaction-focus',
          'active:border-component-button-on-surface-alternate-filled-border-pressed',
          'active:bg-component-button-on-surface-alternate-filled-bg-pressed',
          'active:text-component-button-on-surface-alternate-filled-text-pressed',
          'disabled:opacity-40',
        ],
        icon: [
          'text-component-button-on-surface-alternate-filled-icon',
          'group-hover:text-component-button-on-surface-alternate-filled-icon-hover',
          'group-active:text-component-button-on-surface-alternate-filled-icon-pressed',
        ],
      },
    },

    {
      style: 'outline',
      color: 'onBg',
      class: {
        base: [
          'border-component-button-on-bg-outline-border',
          'bg-component-button-on-bg-outline-bg',
          'text-component-button-on-bg-outline-text',
          'hover:border-component-button-on-bg-outline-border-hover',
          'hover:bg-component-button-on-bg-outline-bg-hover',
          'hover:text-component-button-on-bg-outline-text-hover',
          'focus-visible:ring-componentTheme---bg-interaction-focus',
          'active:border-component-button-on-bg-outline-border-pressed',
          'active:bg-component-button-on-bg-outline-bg-pressed',
          'active:text-component-button-on-bg-outline-text-pressed',
          'disabled:opacity-40',
        ],
        icon: [
          'text-component-button-on-bg-outline-icon',
          'group-hover:text-component-button-on-bg-outline-icon-hover',
          'group-active:text-component-button-on-bg-outline-icon-pressed',
        ],
      },
    },
    {
      style: 'outline',
      color: 'onSurface',
      class: {
        base: [
          'border-component-button-on-surface-outline-border',
          'bg-component-button-on-surface-outline-bg',
          'text-component-button-on-surface-outline-text',
          'hover:border-component-button-on-surface-outline-border-hover',
          'hover:bg-component-button-on-surface-outline-bg-hover',
          'hover:text-component-button-on-surface-outline-text-hover',
          'focus-visible:ring-componentTheme---surface-interaction-focus',
          'active:border-component-button-on-surface-outline-border-pressed',
          'active:bg-component-button-on-surface-outline-bg-pressed',
          'active:text-component-button-on-surface-outline-text-pressed',
          'disabled:opacity-40',
        ],
        icon: [
          'text-component-button-on-surface-outline-icon',
          'group-hover:text-component-button-on-surface-outline-icon-hover',
          'group-active:text-component-button-on-surface-outline-icon-pressed',
        ],
      },
    },
    {
      style: 'outline',
      color: 'onSurfaceAlternate',
      class: {
        base: [
          'border-component-button-on-surface-alternate-outline-border',
          'bg-component-button-on-surface-alternate-outline-bg',
          'text-component-button-on-surface-alternate-outline-text',
          'hover:border-component-button-on-surface-alternate-outline-border-hover',
          'hover:bg-component-button-on-surface-alternate-outline-bg-hover',
          'hover:text-component-button-on-surface-alternate-outline-text-hover',
          'focus-visible:ring-componentTheme---surface-alternate-interaction-focus',
          'active:border-component-button-on-surface-alternate-outline-border-pressed',
          'active:bg-component-button-on-surface-alternate-outline-bg-pressed',
          'active:text-component-button-on-surface-alternate-outline-text-pressed',
          'disabled:opacity-40',
        ],
        icon: [
          'text-component-button-on-surface-alternate-outline-icon',
          'group-hover:text-component-button-on-surface-alternate-outline-icon-hover',
          'group-active:text-component-button-on-surface-alternate-outline-icon-pressed',
        ],
      },
    },

    {
      style: 'ghost',
      color: 'onBg',
      class: {
        base: [
          'border-component-button-on-bg-ghost-border',
          'bg-component-button-on-bg-ghost-bg',
          'text-component-button-on-bg-ghost-text',
          'hover:border-component-button-on-bg-ghost-border-hover',
          'hover:bg-component-button-on-bg-ghost-bg-hover',
          'hover:text-component-button-on-bg-ghost-text-hover',
          'focus-visible:ring-componentTheme---bg-interaction-focus',
          'active:border-component-button-on-bg-ghost-border-hover',
          'active:bg-component-button-on-bg-ghost-bg-hover',
          'active:text-component-button-on-bg-ghost-text-hover',
          'disabled:border-component-button-on-bg-ghost-border-disabled(This token was deleted, please fix before committing)',
          'disabled:bg-component-button-on-bg-ghost-bg-disabled(This token was deleted, please fix before committing)',
        ],
        icon: [
          'text-component-button-on-bg-ghost-icon',
          'group-hover:text-component-button-on-bg-ghost-icon-hover',
          'group-active:text-component-button-on-bg-ghost-icon-hover',
          'disabled:text-component-button-on-bg-ghost-icon-disabled(This token was deleted, please fix before committing)',
        ],
      },
    },
    {
      style: 'ghost',
      color: 'onSurface',
      class: {
        base: [
          'border-component-button-on-surface-ghost-border',
          'bg-component-button-on-surface-ghost-bg',
          'text-component-button-on-surface-ghost-text',
          'hover:border-component-button-on-surface-ghost-border-hover',
          'hover:bg-component-button-on-surface-ghost-bg-hover',
          'hover:text-component-button-on-surface-ghost-text-hover',
          'focus-visible:ring-componentTheme---surface-interaction-focus',
          'active:border-component-button-on-surface-ghost-border-pressed',
          'active:bg-component-button-on-surface-ghost-bg-pressed',
          'active:text-component-button-on-surface-ghost-text-pressed',
          'disabled:opacity-40',
        ],
        icon: [
          'text-component-button-on-surface-ghost-icon',
          'group-hover:text-component-button-on-surface-ghost-icon-hover',
          'group-active:text-component-button-on-surface-ghost-icon-pressed',
        ],
      },
    },
    {
      style: 'ghost',
      color: 'onSurfaceAlternate',
      class: {
        base: [
          'border-component-button-on-surface-alternate-ghost-border',
          'bg-component-button-on-surface-alternate-ghost-bg',
          'text-component-button-on-surface-alternate-ghost-text',
          'hover:border-component-button-on-surface-alternate-ghost-border-hover',
          'hover:bg-component-button-on-surface-alternate-ghost-bg-hover',
          'hover:text-component-button-on-surface-alternate-ghost-text-hover',
          'focus-visible:ring-componentTheme---surface-alternate-interaction-focus',
          'active:border-component-button-on-surface-alternate-ghost-border-pressed',
          'active:bg-component-button-on-surface-alternate-ghost-bg-pressed',
          'active:text-component-button-on-surface-alternate-ghost-text-pressed',
          'disabled:opacity-40',
        ],
        icon: [
          'text-component-button-on-surface-alternate-ghost-icon',
          'group-hover:text-component-button-on-surface-alternate-ghost-icon-hover',
          'group-active:text-component-button-on-surface-alternate-ghost-icon-pressed',
        ],
      },
    },

    {
      style: 'link',
      color: 'onBg',
      class: {
        base: [
          'bg-transparent',
          'text-component-button-on-bg-link-text',
          'hover:text-component-button-on-bg-link-text-hover',
          'hover:border-component-button-on-bg-link-border-hover',
          'focus-visible:ring-componentTheme---bg-interaction-focus',
          'active:text-component-button-on-bg-link-text-hover',
          'disabled:opacity-40',
        ],
        // Icon intentionally uses the *-text tokens (not *-icon) so the icon color
        // matches the text color in every state. The *-link-icon-* tokens resolve
        // to a different family (`action`) than *-link-text-* (`link-link`) in some
        // brand themes, which causes a visible mismatch. Remove once tokens are aligned.
        icon: [
          'text-component-button-on-bg-link-text',
          'group-hover:text-component-button-on-bg-link-text-hover',
          'group-active:text-component-button-on-bg-link-text-hover',
        ],
      },
    },
    {
      style: 'link',
      color: 'onSurface',
      class: {
        base: [
          'bg-transparent',
          'text-component-button-on-surface-link-text',
          'hover:text-component-button-on-surface-link-text-hover',
          'hover:border-component-button-on-surface-link-border-hover',
          'focus-visible:ring-componentTheme---surface-interaction-focus',
          'active:text-component-button-on-surface-link-text-hover',
          'disabled:opacity-40',
        ],
        icon: [
          'text-component-button-on-surface-link-text',
          'group-hover:text-component-button-on-surface-link-text-hover',
          'group-active:text-component-button-on-surface-link-text-hover',
        ],
      },
    },
    {
      style: 'link',
      color: 'onSurfaceAlternate',
      class: {
        base: [
          'bg-transparent',
          'text-component-button-on-surface-alternate-link-text',
          'hover:text-component-button-on-surface-alternate-link-text-hover',
          'hover:border-component-button-on-surface-alternate-link-border-hover',
          'focus-visible:ring-componentTheme---surface-alternate-interaction-focus',
          'active:text-component-button-on-surface-alternate-link-text-hover',
          'disabled:opacity-40',
        ],
        icon: [
          'text-component-button-on-surface-alternate-link-text',
          'group-hover:text-component-button-on-surface-alternate-link-text-hover',
          'group-active:text-component-button-on-surface-alternate-link-text-hover',
        ],
      },
    },

    {
      style: 'link',
      class: {
        base: ['!p-spacing-spacing-2'],
      },
    },
    {
      style: 'outline',
      size: 'xl',
      class: {
        base: ['min-h-14'],
      },
    },
    {
      style: 'outline',
      size: 'lg',
      class: {
        base: ['min-h-11'],
      },
    },
  ],
});
