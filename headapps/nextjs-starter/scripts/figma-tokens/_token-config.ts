import { LocalVariableCollection } from '@figma/rest-api-spec';

// This file is used to configure the collections and modes for the Figma tokens.
// We can configure the type of collection (e.g whether it's an extended collection, whether we only want the first mode, etc)
// Aliases are mostly used when we want the name in Figma to be different from the name in the codebase.
// This can happen when something is renamed mid-project and we don't want to break existing code.
// We can also configure modes to skip or give aliases to them.

export const COLLECTION_CONFIGS: Record<CollectionName, CollectionConfig> = {
  Brand: {
    name: 'Brand',
    type: 'extended',
    alias: 'Brands',
    parentCollectionAlias: 'White Label',
    skipParentCollection: true,
    modes: [
      {
        name: 'Brand X',
        alias: 'BrandX',
      },
      {
        name: 'Hello World',
        alias: 'HelloWorld',
      },
      {
        name: 'Bright Press',
        skip: true,
      },
      {
        name: 'Midnight',
        skip: true,
      },
      {
        name: 'Peak',
        skip: true,
      },
      {
        name: 'Sprout Spoon',
        skip: true,
      },
      {
        name: 'Nimbus Goods',
        alias: 'Nimbus Goods',
      },
      {
        name: 'White Label',
        skip: true,
      },
    ],
  },
  Device: {
    name: 'Device',
    type: 'standard',
  },
  Themes: {
    name: 'Themes',
    type: 'standard',
    modes: [
      {
        name: 'Default',
        alias: 'White',
      },
      {
        name: 'Light-Alt-1',
        alias: 'Light',
      },
      {
        name: 'Dark-Alt-2',
        alias: 'Dark',
      },
      {
        name: 'Brand-Primary-Alt-3',
        alias: 'Brand-Primary',
      },
      {
        name: 'Brand-Secondary-Alt-4',
        alias: 'Brand-Secondary',
      },
    ],
  },
  Spacing: {
    name: 'Spacing',
    type: 'single-mode',
  },
  Style: {
    name: 'Style',
    type: 'single-mode',
  },
  Global: {
    name: 'Global',
    type: 'single-mode',
  },
} as const;

export function getCollectionConfig(collection: LocalVariableCollection): CollectionConfig {
  const collectionName = collection.name as CollectionName;
  return COLLECTION_CONFIGS[collectionName] ?? { type: 'ignore' };
}

export type CollectionName = 'Brand' | 'Device' | 'Themes' | 'Spacing' | 'Style' | 'Global';

export type ModeConfig = {
  name: string;
  skip?: boolean;
  alias?: string;
};

export type CollectionConfig = {
  /**
   * The name of the collection as it appears in Figma.
   */
  name: CollectionName;
  type: 'extended' | 'standard' | 'single-mode' | 'ignore';
  /**
   * The alias for the collection as it appears in the codebase.
   */
  alias?: string;
  parentCollectionAlias?: string;
  skipParentCollection?: boolean;
  modes?: ModeConfig[];
};
