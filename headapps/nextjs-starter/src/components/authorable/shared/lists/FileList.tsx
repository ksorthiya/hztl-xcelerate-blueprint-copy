// Global
import React, { JSX } from 'react';
import { tv } from 'tailwind-variants';
import { Field } from '@sitecore-content-sdk/nextjs';

// Local
import { withStandardComponentWrapper } from 'helpers/HOC';
import { Lists } from '.generated/Lists/FileList.model';
import PlainTextWrapper from 'helpers/SitecoreWrappers/PlainTextWrapper/PlainTextWrapper';
import RichTextWrapper from 'helpers/SitecoreWrappers/RichTextWrapper/RichTextWrapper';
import LinkWrapper from 'helpers/SitecoreWrappers/LinkWrapper/LinkWrapper';
import { SvgIcon } from 'helpers/SvgIcon';
import { BrandAndThemeProvider } from 'lib/context/BrandAndThemeContext';
import { Themes } from 'helpers/Constants/Constant';
import { getTestProps } from 'lib/testing/utils';

export type FileListProps = Lists.FileList.FileList_Component;

interface MediaItem {
  id: string;
  url: string;
  name: string;
  displayName: string;
  fields: {
    Description?: Field<string>;
    Extension?: Field<string>;
    Keywords?: Field<string>;
    Size?: Field<string>;
    Title?: Field<string>;
  };
}

const FileList = (props: FileListProps): JSX.Element => {
  const { RenderingIdentifier } = props?.params || {};
  const { headline, description, ctaLink, selectFiles } = props?.fields || {};
  const theme = props?.params?.selectTheme as Themes;

  // Helper function to format file size
  const formatFileSize = (size: number): string => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  /*
   * Rendering
   */

  const {
    container,
    list,
    item,
    fileIcon,
    fileInfo,
    fileSize,
    headlineText,
    descriptionText,
    ctaLinkText,
    ctaWrapper,
    rightSection,
    fileDisplayName,
    fileTypeIcon,
    anchor,
  } = TAILWIND_VARIANTS();

  return (
    <section
      data-component="authorable/shared/lists/filelist"
      id={RenderingIdentifier}
      aria-label="Downloadable files"
      {...getTestProps(`component-file-list-${props?.rendering?.uid}`)}
    >
      <BrandAndThemeProvider theme={theme}>
        <div className={container()}>
          <div>
            <PlainTextWrapper
              editable
              field={headline}
              tag="h2"
              className={headlineText()}
              {...getTestProps(`headline`)}
            />
            <RichTextWrapper
              field={description}
              className={descriptionText()}
              {...getTestProps(`description`)}
            />
            <div className={ctaWrapper()}>
              <LinkWrapper
                ctaSurface="onBg"
                ctaVariant="fill"
                field={ctaLink}
                className={ctaLinkText()}
                {...getTestProps(`cta`)}
              />
            </div>
          </div>
          {selectFiles ? (
            <ul className={list()}>
              {selectFiles.map((fl: MediaItem, _index: number) => (
                <li key={fl.id} className={item()}>
                  <a
                    href={fl.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={anchor()}
                    aria-label={`Download ${fl.displayName}${fl.fields.Size?.value ? ` (${formatFileSize(Number(fl.fields.Size.value))})` : ''}${fl.fields.Extension?.value ? ` - ${fl.fields.Extension.value.toUpperCase()} file` : ''}`}
                    {...getTestProps(`file-link-${_index}`)}
                  >
                    <div className={fileInfo()}>
                      <SvgIcon
                        icon="file-download"
                        size="xs"
                        className={fileTypeIcon()}
                        aria-hidden="true"
                      />
                      <span className={fileDisplayName()} {...getTestProps(`file-name-${_index}`)}>
                        {fl.displayName}
                      </span>
                    </div>
                    <div className={rightSection()}>
                      <span className={fileSize()} {...getTestProps(`file-size-${_index}`)}>
                        {fl.fields.Size?.value && formatFileSize(Number(fl.fields.Size.value))}
                      </span>
                      {fl.fields.Size?.value && fl.fields.Extension?.value && ' '}
                      <span
                        className={fileIcon()}
                        aria-label={`File type: ${fl.fields.Extension?.value?.toUpperCase()}`}
                        {...getTestProps(`file-extension-${_index}`)}
                      >
                        {fl.fields.Extension?.value && fl.fields.Extension.value.toUpperCase()}
                      </span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <></>
          )}
        </div>
      </BrandAndThemeProvider>
    </section>
  );
};

export const Default = withStandardComponentWrapper(FileList, false);

const TAILWIND_VARIANTS = tv({
  slots: {
    container: [
      'relative',
      'grid',
      'grid-cols-1',
      'md:grid-cols-2',
      'gap-spacing-spacing-8',
      'py-component-section-padding-y',
      'px-component-section-padding-x',
      'before:absolute',
      'before:inset-y-0',
      'before:left-[calc(-50vw+50%)]',
      'before:right-[calc(-50vw+50%)]',
      'before:bg-component-section-color-bg',
      'before:-z-10',
    ],
    list: ['flex', 'flex-col', 'gap-spacing-spacing-8', 'md:gap-spacing-spacing-16'],
    anchor: [
      'flex',
      'items-center',
      'justify-between',
      'self-stretch',
      'w-full',
      'group',
      'py-component-file-list-item-padding-y',
      'px-component-file-list-item-padding-x',
    ],
    item: [
      'bg-component-file-list-item-color-default-surface',
      'text-component-file-list-item-color-default-title',
      'border',
      'border-component-file-list-item-border-width',
      'border-component-file-list-item-color-default-border',
      'rounded-component-file-list-item-border-radius',
      'transition-colors',
      'duration-200',
      'hover:border-component-file-list-item-color-hover-border',
      'hover:bg-component-file-list-item-color-hover-surface',
      'hover:text-component-file-list-item-color-hover-title',
    ],
    headlineText: [
      'font-bold',
      'text-component-section-color-title',
      'text-typography-header-xlarge-font-size',
      'leading-typography-header-xlarge-line-height',
      'font-typography-header-font-family',
      'leading-tight',
      'mb-spacing-general-title-margin-bottom',
      'not-italic',
    ],
    descriptionText: [
      'text-component-section-color-body',
      'font-typography-body-font-family',
      'text-typography-body-large-font-size',
      'font-normal',
      'not-italic',
      'leading-typography-body-large-line-height',
      'mb-spacing-general-copy-margin-bottom',
    ],
    ctaWrapper: ['flex', 'justify-start'],
    ctaLinkText: ['mt-spacing-general-buttons-margin-top', 'w-full', 'md:w-auto'],
    fileInfo: ['flex', 'flex-row', 'items-center'],
    fileTypeIcon: [
      'flex-shrink-0',
      'mr-2',
      'text-typography-body-small-font-size',
      'text-component-file-list-item-color-default-icon',
      'group-hover:text-component-file-list-item-color-hover-icon',
    ],
    fileDisplayName: [
      'font-bold',
      'text-typography-body-small-font-size',
      'text-component-file-list-item-color-default-title',
      'group-hover:text-component-file-list-item-color-hover-title',
      'underline',
    ],
    rightSection: [
      'flex',
      'items-center',
      'gap-4',
      'text-typography-body-small-font-size',
      'text-component-file-list-item-color-default-detail-text',
      'group-hover:text-component-file-list-item-color-hover-detail-text',
    ],
    fileSize: [
      'font-typography-body-font-family',
      'text-typography-body-small-font-size',
      'text-component-file-list-item-color-default-detail-text',
    ],
    fileIcon: [
      'text-typography-body-small-font-size',
      'text-component-file-list-item-color-default-detail-text',
    ],
  },
});
