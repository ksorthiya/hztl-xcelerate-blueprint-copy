import { CtaVariants, CtaVariantValues } from 'lib/utils/style-param-utils/modules/ctas';

interface CtaStyle {
  ctaVariant?: CtaVariants;
}

const isValidCtaVariant = (value?: string): value is CtaVariants =>
  !!value && (CtaVariantValues as readonly string[]).includes(value);

const getCtaStyle = (ctaStyle: CtaStyle = {}, defaultVariant: CtaVariants) => {
  return {
    ...ctaStyle,
    ctaVariant: isValidCtaVariant(ctaStyle?.ctaVariant) ? ctaStyle.ctaVariant : defaultVariant,
  };
};

export { getCtaStyle };
