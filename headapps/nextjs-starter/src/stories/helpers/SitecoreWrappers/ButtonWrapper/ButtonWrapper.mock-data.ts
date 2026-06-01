const defaultData = {
  className: '',
  ctaSurface: 'onBg' as const,
  ctaIconAlignment: 'right',
  id: 'buttonId',
  disabled: false,
  onClick: undefined,
  ctaVariant: 'fill',
  text: 'Button Text',
  title: 'Button Title',
  type: 'button',
};

export const disabledData = {
  ...defaultData,
  disabled: true,
};

export const styleLinkData = {
  ...defaultData,
  ctaVariant: 'link',
};

export const styleSecondaryData = {
  ...defaultData,
  ctaVariant: 'outline',
};

export const styleTertiaryData = {
  ...defaultData,
  ctaVariant: 'ghost',
};

export default defaultData;
