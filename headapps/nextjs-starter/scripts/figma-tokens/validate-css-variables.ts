/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * Import dependencies
 */
import fs from 'fs';
import path from 'path';
import { ExtendedFigmaToken, FigmaTokenMap, getVariableType } from './variable-types';
import { sanitizeKeyName } from './utils';
import { VariableScope } from '@figma/rest-api-spec';

/*
 * Defining a Path that contain JSON files generated in step 1
 */
const figmaTokensPath = './tokens';
const directoryPath = path.resolve(__dirname, figmaTokensPath);

// function resolveTokenType(tokens: FigmaTokenMap): void {
//   let depth = 0;
//   for (const key in tokens) {
//     const token = tokens[key];
//     const type = getVariableType(token, key, false);
//     token.resolvedType = type;
//   }
//   do {
//     const variableTokens = Object.values(tokens).filter(
//       (token) => token.resolvedType === 'VARIABLE'
//     );
//     for (const token of variableTokens) {
//       if (typeof token.$value !== 'string') {
//         throw new Error(`Variable token value is not a string: ${token.$value}`);
//       }
//       const variableName = token.$value.replace('{', '').replace('}', '');
//       const variableToken = tokens[variableName];
//       if (!variableToken) {
//         console.warn(tokens);
//         throw new Error(`Variable token not found: ${variableName}`);
//       }
//       token.resolvedType = getVariableType(variableToken, variableName);
//     }
//     const hasVariable = variableTokens.length > 0;
//     if (!hasVariable) {
//       return;
//     }
//     depth++;
//   } while (depth < 10);

//   throw new Error('Max depth reached');
// }

/*
 * Updating the jsonFiles that already contains DefaultVariables
 * Replace the values that refer to another variables with values from Global Default
 * Replace variable placeholders with value reference
 * replacePlaceholders(jsonFiles[key], globalDefault);
 * Replace the values that refer to another variables inside of the same theme
 * Replace variable placeholders with value reference
 * Verify one more time if there are remaining {values} that point to another variables after Desktop, Tablet, and Mobile overrides.
 * Add desktop, tablet, mobile prefix in front of Device variables
 */
async function validateThemeConfig() {
  try {
    const fileNames = await fs.promises.readdir(directoryPath);
    const jsonFiles: { [key: string]: any } = {};

    // Regular processing of all files
    fileNames.forEach((fileName) => {
      if (path.extname(fileName) === '.json') {
        const filePath = path.join(directoryPath, fileName);
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const data = require(filePath);
        let sanitizedFileName = path.basename(fileName, '.json');
        sanitizedFileName = sanitizeKeyName(sanitizedFileName, true);
        jsonFiles[sanitizedFileName] = data;
      }
    });

    await validateJsonFileConfigs(jsonFiles);
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', 'Error generating output file:', error);
  }
}

/*
 *  Calling the createThemeConfig function to generate the 'theme-config.ts' file that contains all variables from nested JSON objects in 'figma-tokens/' folder
 */
validateThemeConfig();

function flattenObjectToFigmaTokens(obj: any): FigmaTokenMap {
  const flattened: FigmaTokenMap = {};

  // Sort the keys to ensure a consistent order
  const keys = Object.keys(obj);
  keys.sort((a, b) => a.localeCompare(b));
  keys.forEach((key) => {
    const value = obj[key];
    const sanitizedKey = sanitizeKeyName(key);

    if (typeof value === 'object' && value !== null) {
      // An object can be both a token, as well as have nested tokens
      // Get the top level token
      const topLevelToken: ExtendedFigmaToken = {
        $type: value.$type,
        $value: value.$value,
        resolvedType: value.resolvedType,
        $extensions: value.$extensions,
        $description: value.$description,
      };

      // Get the nested tokens
      const nestedTokens: Record<string, any> = {};
      // All the fields without a $ prefix are nested tokens
      for (const prop of Object.keys(value).filter(
        (key) => !Object.keys(topLevelToken).includes(key)
      )) {
        nestedTokens[prop] = value[prop];
      }

      // Add the top level token to the flattened object
      if (value.$type) {
        flattened[sanitizedKey] = topLevelToken;
      }

      // Add the nested tokens to the flattened object
      const flattenedChild = flattenObjectToFigmaTokens(nestedTokens);
      Object.keys(flattenedChild).forEach((childKey) => {
        flattened[`${sanitizedKey}-${childKey}`] = flattenedChild[childKey];
      });
    }
  });

  return flattened;
}

interface ValidationError {
  key: string;
  value: string | number | boolean;
  scopes: VariableScope[];
  type: string;
  error: string;
}
/*
 * Recursive function to transform nested objects
 * If the item is an object, recursively process it
 * If it contains $value and $type, process the item
 * Check if $extentions.com.figma.codeSyntax.WEB is defined
 * Sanitize key name, and only add the parent prefix if codeSyntaxWeb exists
 */
function validateDataObjects(obj: FigmaTokenMap) {
  // resolveTokenType(obj);

  const errors: ValidationError[] = [];
  for (const key in obj) {
    const item = obj[key];
    try {
      getVariableType(item, key, false);
    } catch (error) {
      errors.push({
        key,
        value: item.$value,
        scopes: item.$extensions?.['com.figma']?.scopes || [],
        type: item.$type,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
  return errors;
}

function validateJsonFileConfigs(jsonFiles: { [key: string]: any }) {
  const globalKeys = Object.keys(jsonFiles).filter((key) => key.startsWith('Global'));
  const deviceKeys = Object.keys(jsonFiles).filter((key) => key.startsWith('Device'));
  const brandKeys = Object.keys(jsonFiles).filter((key) => key.startsWith('Brand'));
  const themeKeys = Object.keys(jsonFiles).filter(
    (key) => key.startsWith('Theme') && !key.includes('Test')
  );

  if (globalKeys.length > 1) {
    throw new Error('Only one Global key is allowed');
  }

  const getErrors = (key: string): ValidationError[] => {
    const value = jsonFiles[key];
    const flattened = flattenObjectToFigmaTokens(value);
    const errors = validateDataObjects(flattened);
    return errors;
  };

  const globalConfigErrors = getErrors(globalKeys[0]);
  if (globalConfigErrors.length > 0) {
    console.error('Global config errors:');
    for (const config of globalConfigErrors) {
      console.error(config.key);
    }
  }
  const deviceConfigsErrors = getErrors(deviceKeys[0]);

  if (deviceConfigsErrors.length > 0) {
    console.error('Device config errors:');
    for (const config of deviceConfigsErrors) {
      console.error(config.key);
    }
  }
  const brandConfigsErrors = getErrors(brandKeys[0]);

  if (brandConfigsErrors.length > 0) {
    console.error('Brand config errors:');
    for (const config of brandConfigsErrors) {
      console.error(config.key);
    }
  }
  const themeConfigsErrors = getErrors(themeKeys[0]);

  if (themeConfigsErrors.length > 0) {
    console.error('Theme config errors:');
    for (const config of themeConfigsErrors) {
      console.error(config.key);
    }
  }
}
