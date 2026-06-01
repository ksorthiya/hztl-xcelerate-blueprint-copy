// Global
import type { Meta, StoryObj } from '@storybook/react';

// Local
import ButtonWrapper, {
  CtaPropsNormal,
} from 'helpers/SitecoreWrappers/ButtonWrapper/ButtonWrapper';
import { expandObj, flattenObj } from 'lib/object-parser';
import { GtmEvent } from 'lib/utils/gtm-utils';
import { ButtonHTMLAttributes } from 'react';
import defaultData, {
  disabledData,
  styleLinkData,
  styleSecondaryData,
  styleTertiaryData,
} from 'stories/helpers/SitecoreWrappers/ButtonWrapper/ButtonWrapper.mock-data';

const meta: Meta<ButtonWrapperStoryProps> = {
  argTypes: {
    className: { description: 'Can be used to apply custom Tailwind CSS selectors to a link.' },
    ctaIconAlignment: {
      defaultValue: 'right',
      description: "The alignment parameter for the button's icon.",
    },
    disabled: { defaultValue: false, description: 'The enabled/disabled flag for the button.' },
    id: { description: 'The unique identifier for the link.' },
    onClick: { description: 'The handler function for the "onClick" event.' },
    ctaVariant: {
      control: 'select',
      defaultValue: 'fill',
      description: 'The variant of the button.',
      options: ['fill', 'outline', 'ghost', 'link'],
    },
    text: { description: 'The text for the link.' },
    title: { description: 'The title for the link.' },
    type: {
      control: 'select',
      defaultValue: 'button',
      description: 'The type of button.',
      options: ['button', 'reset', 'submit'],
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
## Overview
The Button Wrapper component provides a container for buttons, managing their alignment, spacing, and responsive behavior within a layout. It can hold multiple buttons and ensures consistent styling and placement across different screen sizes.

## Usage
Use the Button Wrapper when you need to group one or more buttons together in a structured format, such as for forms, toolbars, or call-to-action sections. It ensures that buttons are evenly spaced, aligned, and responsive, enhancing user interaction and visual clarity.`,
      },
    },
    controls: { sort: 'requiredFirst' },
  },
  tags: ['autodocs'],
  title: 'Helpers/Sitecore Wrappers/Button Wrapper',
};

export default meta;

type Story = StoryObj<ButtonWrapperStoryProps>;

export const Default: Story = {
  args: {
    ...flattenObj(defaultData),
  },
  name: 'Default (Primary)',
  render: (args: ButtonWrapperStoryProps) => {
    return <ButtonWrapper {...expandObj({ ...args })} />;
  },
};

export const Secondary: Story = {
  args: {
    ...flattenObj(styleSecondaryData),
  },
  render: (args: ButtonWrapperStoryProps) => {
    return <ButtonWrapper {...expandObj({ ...args })} />;
  },
};

export const Tertiary: Story = {
  args: {
    ...flattenObj(styleTertiaryData),
  },
  render: (args: ButtonWrapperStoryProps) => {
    return <ButtonWrapper {...expandObj({ ...args })} />;
  },
};

export const Disabled: Story = {
  args: {
    ...flattenObj(disabledData),
  },
  render: (args: ButtonWrapperStoryProps) => {
    return <ButtonWrapper {...expandObj({ ...args })} />;
  },
};

export const Link: Story = {
  args: {
    ...flattenObj(styleLinkData),
  },
  render: (args: ButtonWrapperStoryProps) => {
    return <ButtonWrapper {...expandObj({ ...args })} />;
  },
};

/** Use for Storybook (and similar) so `ctaVariant` is not widened by the `custom` props branch. */
export type ButtonWrapperStoryProps = ButtonHTMLAttributes<HTMLButtonElement> &
  CtaPropsNormal &
  React.PropsWithChildren & {
    className?: string;
    gtmEvent?: GtmEvent;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    text?: string;
  };
