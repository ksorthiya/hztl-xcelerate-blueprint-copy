// Global
import { useRouter } from 'next/router';
import { useCallback, useRef } from 'react';
import NextLink from 'next/link';
import { tv } from 'tailwind-variants';
import { useLanguages } from 'lib/hooks/sitecore/context';
import { SiteStructure } from '.generated/SiteStructure/Header.model';
import { Field } from '@sitecore-content-sdk/nextjs';
import { SvgIcon } from 'helpers/SvgIcon';
import PlainTextWrapper from 'helpers/SitecoreWrappers/PlainTextWrapper/PlainTextWrapper';

// Local
import useDictionary from 'lib/hooks/useDictionary';
import { useRealPathName } from 'lib/hooks/useRealPathName';
import { useHeader } from './HeaderContext';
import { capitalizeFirstLetter } from 'lib/utils/string-utils';
import { getTestProps } from 'lib/testing/utils';
import { US, AE, MX, CA, BR } from 'country-flag-icons/react/3x2';
const Flags = { US, AE, MX, CA, BR };

// Create region name formatter
const regionNameFormatter = new Intl.DisplayNames(['en'], { type: 'region' });

type FlagNames = keyof typeof Flags;

type LanguageSelectorProps = {
  regionList?: SiteStructure.Header.Region_Item[];
};

const LanguageSelector = ({ regionList }: LanguageSelectorProps) => {
  const router = useRouter();
  const locale = router.locale;
  const {
    isMobile,
    isMobileLanguageSelectorOpen,
    isDesktopLanguageSelectorOpen,
    setMobileLanguageSelectorOpen,
    setDesktopLanguageSelectorOpen,
    closeDesktopMenus,
    closeMobileMenu,
  } = useHeader();

  // Don't use from router because that includes rewrites
  const pathname = useRealPathName();

  const selectRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { getDictionaryValue } = useDictionary();

  const languages = useLanguages() ?? [];
  const currentLanguage = languages?.find((x) => x.isoCode === locale);

  // Helper function to parse language and country from nativeName
  const parseLanguageAndCountry = (nativeName: string, countryCode: string) => {
    // For English, add United States if not present
    if (countryCode === 'US' && !nativeName.includes('United States')) {
      return {
        language: nativeName,
        country: 'United States',
      };
    }

    // For other languages, parse the nativeName
    const match = nativeName.match(/(.*?)\s*\((.*?)\)/);
    if (match) {
      return {
        language: match[1].trim(),
        country: match[2].trim(),
      };
    }

    return {
      language: nativeName,
      country: regionNameFormatter.of(countryCode.toUpperCase()),
    };
  };

  // Gets the language and country information for a given language object, with the language name capitalized
  const getCurrentLanguageInfo = useCallback((language: typeof currentLanguage) => {
    const countryCode = language?.countryCode;
    const { language: langName, country } = parseLanguageAndCountry(
      language?.nativeName || '',
      countryCode || ''
    );
    return {
      language: capitalizeFirstLetter(langName),
      country,
    };
  }, []);

  const { language, country } = getCurrentLanguageInfo(currentLanguage);

  // Flag component based off country code
  const CurrentFlag = Flags[currentLanguage?.countryCode as FlagNames];

  const isOpen = isMobile ? isMobileLanguageSelectorOpen : isDesktopLanguageSelectorOpen;
  const setIsOpen = isMobile ? setMobileLanguageSelectorOpen : setDesktopLanguageSelectorOpen;
  const closeAllMenus = isMobile ? closeMobileMenu : closeDesktopMenus;

  // Helper function to check if a language is available in a region
  const isLanguageAvailableInRegion = (region: SiteStructure.Header.Region_Item) => {
    return region.fields?.languageList?.some((lang) => {
      const regionalIsoCode = (lang.fields?.['Regional Iso Code'] as Field<string>)?.value;
      return languages.some(
        (sitecoreLang) =>
          sitecoreLang.isoCode === regionalIsoCode ||
          sitecoreLang.isoCode.startsWith(regionalIsoCode + '-') ||
          regionalIsoCode.startsWith(sitecoreLang.isoCode + '-')
      );
    });
  };

  /*
   * Event Handlers
   */

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setIsOpen(!isOpen);
      } else if (event.key === 'Escape') {
        setIsOpen(false);
        closeAllMenus();
      }
    },
    [isOpen, setIsOpen, closeAllMenus]
  );

  const handleBlur = useCallback(
    (event: React.FocusEvent) => {
      // Only apply blur behavior on desktop
      if (!isMobile) {
        // Close if focus moves to any element outside the language selector
        if (
          event.relatedTarget !== null &&
          !selectRef.current?.contains(event.relatedTarget) &&
          !dropdownRef.current?.contains(event.relatedTarget)
        ) {
          setIsOpen(false);
          closeAllMenus();
        }
      }
    },
    [closeAllMenus, setIsOpen, isMobile]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsOpen(!isOpen);
    },
    [isOpen, setIsOpen]
  );

  /*
   * Rendering
   */

  const {
    base,
    buttonClasses,
    imageContainer,
    countryNameWrapper,
    dropDownMenuWrapper,
    dropDownMenuList,
    dropDownItemName,
    dropDownMenuColHeading,
    instructions,
    buttonIcon,
    countryText,
    languageText,
    gridContainer,
    gridWrapper,
    gridSection,
    flagIcon,
    chevronContainer,
    checkmarkIcon,
  } = TAILWIND_VARIANTS({
    isOverlayVisible: isOpen,
  });

  return (
    <>
      <div
        className={base()}
        ref={selectRef}
        {...getTestProps(`component-header-language-selector`)}
      >
        <button
          aria-expanded={isOpen}
          aria-haspopup="true"
          aria-label={`${getDictionaryValue('CountrySelectorAriaLabel') || 'Select A Country'} - ${country} ${language}`}
          className={buttonClasses()}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          type="button"
          role="menuitem"
          {...getTestProps(`select-button`)}
        >
          <div className={imageContainer()}>
            {CurrentFlag && <CurrentFlag width={28} height={20} className={flagIcon()} />}
            <div className={countryNameWrapper()}>
              <span className="sr-only">
                {getDictionaryValue('CountrySelectorAriaLabel') || 'Select A Country'}
              </span>
              <>
                <span
                  className={countryText({ isMainButton: true })}
                  {...getTestProps(`country-text`)}
                >
                  {country} {''}
                </span>
                <span
                  className={languageText({ isMainButton: true, isOverlayVisible: isOpen })}
                  {...getTestProps(`language-text`)}
                >
                  {language}
                </span>
              </>
            </div>
            <span className={chevronContainer()} {...getTestProps(`chevron`)}>
              <SvgIcon
                className={buttonIcon()}
                fill="currentColor"
                icon="chevron-up"
                size="xs"
                viewBox="0 0 24 24"
              />
            </span>
          </div>
        </button>
        <div className={instructions()} {...getTestProps(`country-selector-instructions`)}>
          {getDictionaryValue('CountrySelectorInstructions') || 'Choose your country and language'}
        </div>
      </div>
      {isOpen && (
        <div
          className={dropDownMenuWrapper()}
          role="group"
          aria-labelledby="language-selector-menu"
          ref={dropdownRef}
          {...getTestProps(`language-dropdown`)}
        >
          <div className={gridSection()}>
            <div className={gridWrapper()}>
              <div className={gridContainer()}>
                {regionList?.map((region) => {
                  // Skip regions with no available languages
                  if (!isLanguageAvailableInRegion(region)) return null;

                  return (
                    <div
                      key={region.id}
                      role="group"
                      aria-labelledby={`language-region-${region.id}`}
                    >
                      <PlainTextWrapper
                        field={region.fields?.regionName as Field<string>}
                        tag="h2"
                        className={dropDownMenuColHeading()}
                        id={`language-region-${region.id}`}
                        {...getTestProps(`language-region-${region.id}`)}
                      />
                      <ul className={dropDownMenuList()} role="presentation">
                        {region.fields?.languageList?.map((language) => {
                          const regionalIsoCode = (
                            language.fields?.['Regional Iso Code'] as Field<string>
                          )?.value;
                          const matchedLanguage = languages.find((lang) => {
                            const matches =
                              lang.isoCode === regionalIsoCode ||
                              lang.isoCode.startsWith(regionalIsoCode + '-') ||
                              regionalIsoCode.startsWith(lang.isoCode + '-');
                            return matches;
                          });

                          if (!matchedLanguage) return null;

                          const isSelected = currentLanguage?.isoCode === matchedLanguage.isoCode;
                          const { dropDownMenuItem, dropDownImageWrapper: selectedImageWrapper } =
                            TAILWIND_VARIANTS({
                              isSelected,
                            });

                          const countryCode = regionalIsoCode?.split('-')[1];
                          const CurrentFlag = Flags[countryCode as FlagNames];
                          if (!CurrentFlag) {
                            console.error(
                              `Include the country: ${countryCode} in the Flags Array.`
                            );
                          }

                          const { language: langName, country: countryName } =
                            getCurrentLanguageInfo(matchedLanguage);
                          const ariaLabelText = `${countryName} ${langName}`;

                          return (
                            <li
                              key={language.id}
                              role="presentation"
                              onBlur={handleBlur}
                              className={dropDownMenuItem()}
                              {...getTestProps(`header-language-dropdown-item`)}
                            >
                              <NextLink
                                href={pathname}
                                locale={matchedLanguage.isoCode}
                                className={selectedImageWrapper()}
                                aria-current={isSelected ? 'true' : undefined}
                                aria-label={
                                  isSelected
                                    ? `${ariaLabelText} ${getDictionaryValue('IsSelected') || 'is selected'}`
                                    : ariaLabelText
                                }
                                onClick={() => {
                                  closeAllMenus();
                                  setIsOpen(false);
                                }}
                                {...getTestProps(`dropdown-link-${language.id}`)}
                              >
                                {CurrentFlag && (
                                  <CurrentFlag
                                    width={28}
                                    height={20}
                                    className={flagIcon()}
                                    {...getTestProps(`flag-icon`)}
                                  />
                                )}
                                <span className={dropDownItemName()}>
                                  <span className={countryText({ isSelected })}>
                                    {countryName} {''}
                                  </span>
                                  <span className={languageText({ isSelected })}>{langName}</span>
                                  {isSelected && (
                                    <span className="sr-only">
                                      {getDictionaryValue('IsSelected') || 'is selected'}
                                    </span>
                                  )}
                                </span>
                                {isSelected ? (
                                  <span className="ml-auto text-component-header-mega-menu-language-item-icon-active">
                                    <SvgIcon icon="checkmark" size="s" viewBox="0 0 24 24" />
                                  </span>
                                ) : (
                                  <span className={checkmarkIcon()}>
                                    <SvgIcon icon="checkmark" size="s" viewBox="0 0 24 24" />
                                  </span>
                                )}
                              </NextLink>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LanguageSelector;

const TAILWIND_VARIANTS = tv({
  slots: {
    base: ['block', 'relative', 'text-left', 'md:mr-4'],
    buttonClasses: [
      'block',
      'w-full',
      'px-spacing-spacing-12',
      'py-spacing-spacing-8',
      'md:p-xxs',
      'rounded-md',
      'border-gray-300',
      'text-base',
      'sm:text-sm',
      'cursor-pointer',
      'focus-visible:outline-none',
      'focus-visible:ring-4',
      'focus-visible:ring-offset-1',
      'focus-visible:ring-offset-white/75',
      'focus-visible:ring-componentTheme---bg-interaction-focus',
      'hover:bg-component-header-language-selector-nav-language-selector-bg-hover',
      'group',
      'transition-colors',
      'duration-200',
    ],
    imageContainer: [
      'flex',
      'items-center',
      'w-full',
      'justify-between',
      'md:justify-start',
      'hover:text-color-text-text',
    ],
    countryNameWrapper: [
      'flex',
      'flex-col',
      'ml-spacing-spacing-12',
      'mr-5',
      'truncate',
      'lg:flex-col',
      'capitalize',
      'w-full',
      'md:w-auto',
      'text-left',
    ],
    countryText: [
      'font-typography-label-font-family',
      'text-typography-label-medium-font-size',
      'font-typography-label-medium-sb-font-weight',
      'leading-typography-label-medium-line-height',
      'tracking-typography-label-medium-letter-spacing',
      'text-component-header-mega-menu-language-item-text',
      'group-hover:text-component-header-mega-menu-language-item-text-hover',
    ],
    languageText: [
      'font-typography-label-font-family',
      'text-typography-label-small-font-size',
      'font-typography-label-small-font-weight',
      'leading-typography-label-small-line-height',
      'tracking-typography-label-small-letter-spacing',
      'text-component-header-mega-menu-language-item-text',
      'group-hover:text-component-header-mega-menu-language-item-text-hover',
    ],
    dropDownMenuWrapper: [
      'absolute',
      'left-0',
      'right-0',
      'bg-component-header-mega-menu-bg',
      'z-10',
      'top-full',
      'border-b',
      'border-color-component-header-nav-bottom-border',
      'overflow-hidden',
      'transition-all',
      'duration-300',
      'ease-in-out',
      'md:opacity-100',
      'md:block',
      'max-h-0',
      'opacity-0',
      'relative',
      'md:absolute',
    ],
    dropDownMenuList: ['flex', 'flex-col', 'list-none', 'py-2', 'gap-spacing-spacing-8'],
    dropDownMenuColHeading: [
      'font-typography-label-small-sb-font-weight',
      'text-typography-label-small-font-size',
      'leading-typography-label-small-line-height',
      'tracking-typography-label-small-letter-spacing',
      'font-typography-label-font-family',
      'text-component-header-mega-menu-category-label',
    ],
    dropDownMenuItem: ['cursor-pointer', 'list-none', 'relative', 'select-none'],
    dropDownImageWrapper: [
      'flex',
      'items-center',
      'justify-start',
      'w-full',
      'px-spacing-spacing-12',
      'py-spacing-spacing-8',
      'rounded-component-header-mega-menu-language-item-item-border-radius',
      'border',
      'border-component-header-mega-menu-language-item-border',
      'bg-component-header-mega-menu-language-item-bg',
      'group',
      'hover:bg-component-header-mega-menu-language-item-bg-hover',
      'hover:border-component-header-mega-menu-language-item-border-hover',
      'focus-visible:outline-none',
      'focus-visible:ring-4',
      'focus-visible:ring-offset-1',
      'focus-visible:ring-offset-white/75',
      'focus-visible:ring-componentTheme---bg-interaction-focus',
    ],
    dropDownItemName: ['block', 'font-semibold', 'ml-3', 'capitalize', 'flex', 'flex-col'],
    gridContainer: [
      'grid',
      'w-full',
      'grid-cols-1',
      'md:grid-cols-2',
      'lg:grid-cols-3',
      'xl:grid-cols-4',
      'md:gap-8',
      'md:p-8',
    ],
    gridWrapper: [
      'max-w-columns-variety-full-max-width',
      'flex',
      'xl:mx-auto',
      'md:px-general-spacing-margin-x',
    ],
    gridSection: [
      'px-spacing-spacing-8',
      'bg-component-header-mega-menu-bg',
      'border-b',
      'overflow-hidden',
      'border-t',
      'border-color-component-header-nav-bottom-border',
    ],
    flagIcon: ['mt-0.5', 'self-baseline'],
    chevronContainer: ['flex'],
    buttonIcon: [
      'duration-200',
      'h-4',
      'w-4',
      'transition',
      'text-component-header-language-selector-nav-language-selector-icon',
      'group-hover:text-component-header-language-selector-nav-language-selector-icon-hover',
    ],
    checkmarkIcon: [
      'ml-auto',
      'invisible',
      'group-hover:visible',
      'group-focus:visible',
      'text-component-header-mega-menu-language-item-icon',
      'group-hover:text-component-header-mega-menu-language-item-icon-hover',
    ],
    instructions: [
      'px-spacing-spacing-8',
      'py-spacing-spacing-16',
      'font-bold',
      'text-left',
      'md:hidden',
    ],
  },
  variants: {
    isSelected: {
      false: {
        dropDownMenuItem: [],
      },
      true: {
        dropDownMenuItem: [],
        dropDownImageWrapper: [
          'bg-component-header-mega-menu-language-item-bg-active',
          'border-component-header-mega-menu-language-item-border-active',
        ],
        checkmarkIcon: [],
        countryText: ['text-component-header-mega-menu-language-item-text-active'],
        languageText: ['text-component-header-mega-menu-language-item-text-active'],
      },
    },
    isMainButton: {
      true: {
        countryText: [
          '!text-component-header-language-selector-nav-language-selector-text',
          'group-hover:!text-component-header-language-selector-nav-language-selector-text-hover',
        ],
        languageText: [
          '!text-component-header-language-selector-nav-language-selector-text',
          'group-hover:!text-component-header-language-selector-nav-language-selector-text-hover',
        ],
      },
      false: {},
    },
    isOverlayVisible: {
      true: {
        overlay: ['block'],
        dropDownMenuWrapper: [
          'md:block',
          'max-h-screen',
          'opacity-100',
          'relative',
          'md:absolute',
          'overflow-y-auto',
        ],
        buttonIcon: [
          'rotate-0',
          'text-component-header-language-selector-nav-language-selector-icon-active',
        ],
      },
      false: {
        overlay: ['hidden'],
        dropDownMenuWrapper: ['md:hidden', 'max-h-0', 'opacity-0', 'relative', 'md:absolute'],
        buttonIcon: ['rotate-180'],
      },
    },
  },
  compoundVariants: [
    {
      isMainButton: true,
      isOverlayVisible: true,
      class: {
        countryText: ['!text-component-header-language-selector-nav-language-selector-text-active'],
        languageText: [
          '!text-component-header-language-selector-nav-language-selector-text-active',
        ],
      },
    },
  ],
});
