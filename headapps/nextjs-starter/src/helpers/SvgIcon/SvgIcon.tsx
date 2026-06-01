// Global
import React, { JSX } from 'react';
import { tv } from 'tailwind-variants';
import { IconMapping, IconTypes } from './SvgIconMapping';

export type SvgIconSize = 'xxs' | 'xs' | 's' | 'sm' | 'm' | 'md' | 'em' | 'lg';

export type SVGFill = 'currentColor' | 'none';

export interface SvgIconProps {
  className?: string;
  fill?: SVGFill; // The "fill" attribute must be applied to individual <path /> tags in order to be effective. Applying it to <svg /> does nothing.
  icon: IconTypes;
  size?: SvgIconSize;
  viewBox?: string; // This could pretty easily be hard coded as the "size" attribute is doing the hard work here.
  title?: string;
}

const SvgIcon = ({
  className,
  fill = 'currentColor',
  icon,
  size = 'sm',
  viewBox = '0 0 24 24',
  title,
}: SvgIconProps): JSX.Element => {
  if (!icon) return <></>;

  const IconContent = IconMapping[icon];

  return (
    <svg
      className={TAILWIND_VARIANTS({ className, size })}
      fill={fill}
      viewBox={viewBox}
      data-icon={icon}
      xmlns="http://www.w3.org/2000/svg"
    >
      {title && <title>{title}</title>}
      <IconContent />
    </svg>
  );
};

export default SvgIcon;

const TAILWIND_VARIANTS = tv({
  base: [],
  variants: {
    size: {
      xxs: ['!h-3', '!w-3'], //added solely for fixing the search and results UI
      xs: ['!h-4', '!w-4'],
      s: ['!h-6', '!w-6'],
      sm: ['!h-8', '!w-8'], // 32px
      m: ['!h-12', '!w-12'], // 48px
      md: ['!h-16', '!w-16'], // 64px
      lg: ['!h-24', '!w-24'],
      em: ['!h-em', '!w-em'],
    },
  },
});
