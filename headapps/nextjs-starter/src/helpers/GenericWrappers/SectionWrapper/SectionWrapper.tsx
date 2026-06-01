import { TextAlignment } from 'lib/context/TextAlignmentContext';
import { createContext, useContext } from 'react';
import { tv } from 'tailwind-variants';

export interface SectionWrapperProps
  extends React.HTMLAttributes<HTMLDivElement>,
    React.PropsWithChildren {
  hasHeaderContent?: boolean;
  textAlignment?: TextAlignment;
  noPaddingTop?: boolean;
  noPaddingBottom?: boolean;
  noPaddingSides?: boolean;
  isCentered75?: boolean;
}

export const SectionWrapper = ({
  children,
  hasHeaderContent,
  textAlignment,
  noPaddingTop,
  noPaddingBottom,
  noPaddingSides,
  isCentered75,
}: SectionWrapperProps) => {
  const { isInsideSectionWrapper } = useContext(SectionWrapperContext);
  const { base, sectionContentWrapper } = TAILWIND_VARIANTS({
    textAlignment,
  });

  // We don't want to double-wrap, if we're already inside one, don't add another one.
  if (isInsideSectionWrapper) {
    return children;
  }
  return (
    <SectionWrapperContext.Provider value={{ isInsideSectionWrapper: true }}>
      <div
        data-component="generic-wrappers/section-wrapper"
        className={base({
          textAlignment,
          removePaddingTop: noPaddingTop,
          removePaddingBottom: noPaddingBottom,
          removePaddingLeftRight: noPaddingSides,
        })}
      >
        <div
          className={sectionContentWrapper({
            hasHeaderContent: hasHeaderContent,
            displayCenter75: isCentered75,
          })}
        >
          {children}
        </div>
      </div>
    </SectionWrapperContext.Provider>
  );
};

interface SectionWrapperContextType {
  isInsideSectionWrapper: boolean;
}

const SectionWrapperContext = createContext<SectionWrapperContextType>({
  isInsideSectionWrapper: false,
});

const TAILWIND_VARIANTS = tv({
  slots: {
    base: [
      'relative',
      'flex',
      'flex-col',
      'justify-center',
      'items-start',
      'self-stretch',
      'gap-layout-variety-gutter',
      'before:absolute',
      'before:inset-y-0',
      'before:left-[calc(-50vw+50%)]',
      'before:right-[calc(-50vw+50%)]',
      'before:bg-component-section-color-bg',
      'before:-z-10',
    ],
    sectionContentWrapper: ['flex', 'flex-col', 'w-full', 'h-auto'],
  },
  variants: {
    textAlignment: {
      Left: {
        base: 'text-left',
      },
      Center: {
        base: 'text-center',
      },
      Right: {
        base: 'text-right',
      },
    },
    hasHeaderContent: {
      true: {
        sectionContentWrapper: 'gap-spacing-general-section-margin-bottom',
      },
      false: {
        sectionContentWrapper: 'gap-0',
      },
    },
    removePaddingTop: {
      true: {
        base: ['pt-0'],
      },
      false: {
        base: ['pt-component-section-padding-y'],
      },
    },
    removePaddingBottom: {
      true: {
        base: ['pb-0'],
      },
      false: {
        base: ['pb-component-section-padding-y'],
      },
    },
    removePaddingLeftRight: {
      true: {
        base: [],
      },
      false: {
        base: ['px-component-section-padding-x'],
      },
    },
    displayCenter75: {
      true: {
        sectionContentWrapper: ['max-w-layout-container-center70-max-width', 'mx-auto'],
      },
      false: {
        sectionContentWrapper: [],
      },
    },
  },
  defaultVariants: {
    textAlignment: 'Left',
    removePaddingTop: false,
    removePaddingBottom: false,
    removePaddingLeftRight: false,
    displayCenter75: false,
  },
});
