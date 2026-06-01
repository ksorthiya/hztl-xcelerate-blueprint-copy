import { tv } from 'tailwind-variants';
import PLACEHOLDER_IMAGE from 'public/assets/article-default-image.png';
import LinkWrapper from 'helpers/SitecoreWrappers/LinkWrapper/LinkWrapper';
import useDictionary from 'lib/hooks/useDictionary';
import PlainTextWrapper from 'helpers/SitecoreWrappers/PlainTextWrapper/PlainTextWrapper';
import RichTextWrapper from 'helpers/SitecoreWrappers/RichTextWrapper/RichTextWrapper';
import ImageWrapper from 'helpers/SitecoreWrappers/ImageWrapper/ImageWrapper';
import ArticleTagsWrapper from '../ArticleTagsWrapper/ArticleTagsWrapper';
import formatDate from 'lib/utils/date-formatter';
import { getTestProps } from 'lib/testing/utils';

export type ArticleModel = {
  id: string;
  article_title?: string;
  article_description?: string;
  article_image?: string;
  article_url?: string;
  article_category?: string;
  article_tags?: string[];
  article_publisheddate?: string;
  article_subheading?: string;
};

export type ArticleCardWrapperProps = {
  article: ArticleModel;
  isHorizontalCardLayout?: boolean;
  isOneColHorizontalLayout?: boolean;
};

const ArticleCardWrapper = ({
  article,
  isHorizontalCardLayout = false,
  isOneColHorizontalLayout = false,
}: ArticleCardWrapperProps) => {
  const { getDictionaryValue } = useDictionary();
  const publishedDate = formatDate(article?.article_publisheddate);

  const {
    base,
    imageContainer,
    imageStyle,
    categoryTag,
    articleContentWrapper,
    articleTextContentWrapper,
    articleTitleStyle,
    descriptionStyle,
    textDescriptionWrapper,
    articleDateStyle,
    readMoreButtonStyle,
    articleContentGroup,
  } = TAILWIND_VARIANTS();

  return (
    <div className={base({ isHorizontalCardLayout })}>
      <div className={imageContainer({ isHorizontalCardLayout })}>
        <LinkWrapper
          field={{
            href: article?.article_url,
          }}
          ctaVariant="custom"
          {...getTestProps(`link`)}
        >
          <ImageWrapper
            className={imageStyle()}
            field={{
              value: {
                src: article?.article_image || PLACEHOLDER_IMAGE?.src,
                alt: article?.article_title,
              },
            }}
            {...getTestProps(`image`)}
          />
        </LinkWrapper>
        <PlainTextWrapper
          className={categoryTag()}
          field={{ value: article?.article_category }}
          tag="p"
          {...getTestProps(`category`)}
        />
      </div>
      <div className={articleContentWrapper({ isHorizontalCardLayout, isOneColHorizontalLayout })}>
        <div className={articleContentGroup()}>
          <div className={articleTextContentWrapper()}>
            <div className={textDescriptionWrapper()}>
              <PlainTextWrapper
                className={articleTitleStyle()}
                field={{ value: article?.article_title }}
                tag="h2"
                {...getTestProps(`title`)}
              />
              <RichTextWrapper
                className={descriptionStyle()}
                field={{ value: article?.article_subheading }}
                tag="p"
                {...getTestProps(`description`)}
              />
            </div>
            <PlainTextWrapper
              className={articleDateStyle()}
              field={{ value: publishedDate }}
              tag="p"
              {...getTestProps(`date`)}
            />
          </div>
          <LinkWrapper
            className={readMoreButtonStyle()}
            field={{
              text: `${getDictionaryValue('ReadMore') || 'Read more'}`,
              href: article?.article_url,
            }}
            ctaSurface="onCard"
            ctaVariant="link"
            ctaIcon="arrow-right"
            role="link"
            ctaIconAlignment="right"
            {...getTestProps(`cta`)}
          />
        </div>
        <ArticleTagsWrapper
          tags={article?.article_tags || []}
          maxTagsBreakPointNumber={3}
          {...getTestProps(`article-tags-wrapper`)}
        />
      </div>
    </div>
  );
};

export default ArticleCardWrapper;

const TAILWIND_VARIANTS = tv({
  slots: {
    base: [
      'flex',
      'flex-col',
      'border-component-card-item-article-color-border',
      'border-component-card-item-article-border-width',
      'rounded-component-card-item-article-card-radius',
      'bg-component-card-item-article-color-surface',
    ],
    imageContainer: ['relative'],
    imageStyle: [
      'aspect-[16/9]',
      'rounded-component-card-item-article-image-radius',
      'object-cover',
    ],
    categoryTag: [
      'absolute',
      'top-4',
      'left-4',
      'px-component-card-label-padding-x',
      'py-component-card-label-padding-y',
      'bg-component-card-label-fill',
      'border-component-card-label-border-width',
      'rounded-component-card-label-border-radius',
      'border-component-card-label-border',
      'text-component-card-label-text',
      'font-typography-body-font-family',
      'text-typography-body-xsmall-font-size',
      'font-semibold',
      'max-w-52',
    ],
    articleContentWrapper: ['flex', 'flex-col', 'gap-2'],
    articleTextContentWrapper: ['flex', 'flex-col', 'gap-spacing-spacing-4'],
    articleContentGroup: ['flex', 'flex-col', 'gap-2'],
    textDescriptionWrapper: [],
    articleTitleStyle: [
      'font-typography-body-font-family',
      'text-typography-body-medium-font-size',
      'font-bold',
      'text-component-card-item-article-color-title',
    ],
    descriptionStyle: [
      'line-clamp-2',
      'text-component-card-item-article-color-body',
      'overflow-ellipsis',
      'font-typography-body-font-family',
      'text-typography-body-small-font-size',
      'font-normal',
    ],
    articleDateStyle: [
      'text-component-card-item-article-color-date',
      'font-typography-body-font-family',
      'text-typography-body-small-font-size',
      'font-normal',
    ],
    readMoreButtonStyle: [
      'flex',
      'p-spacing-spacing-2',
      'gap-spacing-spacing-8',
      'justify-center',
      'items-center',
      'text-component-button-on-bg-link-text',
      'font-typography-body-font-family',
      'text-typography-body-medium-font-size',
      'leading-5',
      'border-b',
      'border-transparent',
      'hover:border-b',
      'hover:border-component-button-on-bg-link-text',
    ],
  },
  variants: {
    isHorizontalCardLayout: {
      true: {
        base: ['flex-col', 'md:flex-row'],
        imageContainer: [
          'w-full',
          'md:w-1/2',
          'py-component-card-item-article-landscape-image-padding-y',
          'pl-component-card-item-article-landscape-image-padding-x',
        ],
        articleContentWrapper: [
          'w-full',
          'md:w-1/2',
          'py-component-card-item-article-landscape-content-padding-y',
          'px-component-card-item-article-landscape-content-padding-x',
          'justify-center',
        ],
      },
      false: {
        imageContainer: [
          'pt-component-card-item-article-portrait-image-padding-top',
          'px-component-card-item-article-portrait-image-padding-x',
          'pb-component-card-item-article-portrait-image-padding-bottom',
        ],
        articleContentWrapper: [
          'px-component-card-item-article-portrait-content-padding-x',
          'pt-component-card-item-article-portrait-content-padding-top',
          'pb-component-card-item-article-portrait-content-padding-bottom',
          'justify-between',
          'h-full',
        ],
      },
    },
    isOneColHorizontalLayout: {
      true: {
        articleContentWrapper: [
          '!px-component-card-item-article-landscape-content-1-col-padding-x',
        ],
      },
    },
  },
});
