import { tv } from 'tailwind-variants';
import ImageWrapper, {
  normalizeImageUrl,
} from 'helpers/SitecoreWrappers/ImageWrapper/ImageWrapper';
import formatDate from 'lib/utils/date-formatter';
import LinkWrapper from 'helpers/SitecoreWrappers/LinkWrapper/LinkWrapper';
import RichTextWrapper from 'helpers/SitecoreWrappers/RichTextWrapper/RichTextWrapper';
import { getTestProps } from 'lib/testing/utils';

export type ArticleModel = {
  id: string;
  type?: string;
  name?: string;
  url?: string;
  description?: string;
  image?: string;
  article_category?: string;
  article_publisheddate?: string;
};

export type SearchArticleCardItemCardProps = {
  article: ArticleModel;
};

const SearchArticleCardWrapper = ({ article }: SearchArticleCardItemCardProps) => {
  const {
    base,
    articleContent,
    imageWrapper,
    imageStyle,
    categoryTag,
    articleTitle,
    articleDescription,
    articlePublishedDate,
  } = TAILWIND_VARIANTS();
  const normalizedImage = normalizeImageUrl(article?.image);
  return (
    <div
      className={base()}
      {...getTestProps(`component-search-article-card-wrapper-${article?.id}`)}
    >
      <div className={articleContent()} {...getTestProps(`article-content`)}>
        {article?.article_category && <p className={categoryTag()}>{article?.article_category}</p>}
        <LinkWrapper
          className={articleTitle()}
          field={{ value: { text: article?.name, href: article?.url } }}
          ctaVariant="custom"
          {...getTestProps(`link`)}
        />
        <RichTextWrapper
          className={articleDescription()}
          field={{ value: article?.description }}
          {...getTestProps(`description`)}
        />
        <div className={articlePublishedDate()} {...getTestProps(`publish-date`)}>
          {formatDate(article?.article_publisheddate)}
        </div>
      </div>
      <div className={imageWrapper()}>
        <ImageWrapper
          field={{ value: { src: normalizedImage, alt: article?.name } }}
          className={imageStyle()}
          priority
          {...getTestProps(`image`)}
        />
      </div>
    </div>
  );
};

export default SearchArticleCardWrapper;

const TAILWIND_VARIANTS = tv({
  slots: {
    base: [
      'flex',
      'flex-row',
      'py-spacing-spacing-8',
      'gap-spacing-spacing-16',
      'bg-color-general-bg-white',
      'items-center',
      'min-h-[142px]',
    ],
    articleContent: [
      'flex',
      'flex-col',
      'flex-grow',
      'flex-shrink-0',
      'basis-[70%]',
      'gap-spacing-spacing-8',
    ],
    imageWrapper: ['lg:flex', 'block'],
    imageStyle: [
      'object-cover',
      'lg:aspect-video',
      'aspect-square',
      'rounded-border-radius-variety-button',
    ],
    categoryTag: [
      'text-component-card-label-text',
      'font-typography-body-font-family',
      'text-typography-body-xsmall-font-size',
      'py-component-card-label-padding-y',
      'px-component-card-label-padding-x',
      'rounded-component-card-label-border-radius',
      'bg-component-card-label-fill',
      'border-component-card-label-border-width',
      'border-component-card-label-border',
      'w-max',
      'font-semibold',
    ],
    articleTitle: [
      'text-component-button-on-bg-link-text',
      'font-typography-header-font-family',
      'text-typography-header-xsmall-font-size',
      'font-bold',
    ],
    articleDescription: [
      'text-component-article-result-card-body',
      'font-typography-body-font-family',
      'text-typography-body-medium-font-size',
      'line-clamp-2',
      'font-normal',
    ],
    articlePublishedDate: [
      'text-color-general-text-darkest',
      'font-typography-body-font-family',
      'text-typography-body-small-font-size',
      'font-normal',
    ],
  },
});
