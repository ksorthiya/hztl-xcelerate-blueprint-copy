import { normalizeImageUrl } from 'helpers/SitecoreWrappers/ImageWrapper/ImageWrapper';
import { isValidNextImageDomain } from 'lib/next-config/plugins/images';
import { getImageProps } from 'next/image';

/**
 * Get the props for a next image
 * @param src - The source of the image
 * @param alt - The alt text of the image
 * @param width - The width of the image
 * @param height - The height of the image
 * @returns The props for a next image
 */
export const getNextImageProps = ({
  src,
  alt,
  width,
  height,
  unoptimized,
}: {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  unoptimized?: boolean;
}) => {
  if (!src) {
    return {
      src: undefined,
      srcSet: undefined,
      alt: undefined,
      width: undefined,
      height: undefined,
    };
  }

  // Normalize image URLs and check domain validity
  const normalizedSrc = normalizeImageUrl(src);

  const isValidDomain = isValidNextImageDomain(normalizedSrc);

  const { props } = getImageProps({
    unoptimized: unoptimized ?? !isValidDomain,
    src: normalizedSrc ?? '',
    alt: alt ?? '',
    width: width ?? 0,
    height: height ?? 0,
  });
  return {
    src: props.src,
    srcSet: props.srcSet,
    alt: alt ? props.alt : undefined,
    width: width ? props.width : undefined,
    height: height ? props.height : undefined,
  };
};

/**
 * Get the optimized Next Image src for a given source
 * @param src - The source of the image
 * @returns The optimized Next Image src for a given source
 */
export const getNextImageSrc = (src?: string) => {
  return getNextImageProps({ src })?.src;
};
