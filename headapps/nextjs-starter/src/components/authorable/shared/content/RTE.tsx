// Global
import React, { JSX } from 'react';
import { tv } from 'tailwind-variants';

// Local
import { Content } from '.generated/Content/RTE.model';
import { withStandardComponentWrapper } from 'helpers/HOC';
import RichTextWrapper from 'helpers/SitecoreWrappers/RichTextWrapper/RichTextWrapper';
import { SectionWrapper } from 'helpers/GenericWrappers/SectionWrapper/SectionWrapper';
import useDictionary from 'lib/hooks/useDictionary';
import { getTestProps } from 'lib/testing/utils';

export type RTEProps = Content.Rte.Rte_Component;

const RTE = (props: RTEProps): JSX.Element => {
  const { text } = props?.fields || {};
  const { RenderingIdentifier, styles } = props?.params || {};

  const { getDictionaryValue } = useDictionary();

  /*
   * RENDERING
   */

  const extendedTailwindVariants = tv({
    extend: TAILWIND_VARIANTS,
    slots: {
      base: [styles?.trimEnd()],
    },
  });

  const { base, contentContainer } = extendedTailwindVariants();

  let richTextField = text;

  if (!text || text.value === '') {
    richTextField = { ...text, value: getDictionaryValue('RTEText') };
  }

  const children = <RichTextWrapper field={richTextField} {...getTestProps(`rich-text`)} />;

  return (
    <div
      className={base()}
      data-component="authorable/shared/content/rte"
      id={RenderingIdentifier}
      {...getTestProps(`component-rte-${props?.rendering?.uid}`)}
    >
      <SectionWrapper>
        <div className={contentContainer()}>{children}</div>
      </SectionWrapper>
    </div>
  );
};

export const Default = withStandardComponentWrapper(RTE);

const TAILWIND_VARIANTS = tv({
  slots: {
    base: [],
    contentContainer: [],
    placeholder: ['is-empty-hint'],
  },
});
