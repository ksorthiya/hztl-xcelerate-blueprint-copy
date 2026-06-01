import {
  GetLocalVariablesResponse,
  LocalVariable,
  LocalVariableCollection,
  VariableValue,
} from '@figma/rest-api-spec';
import { rgbToHex } from './color';
import { Token, TokensFile } from './token_types';
import { sanitizeKeyName } from './utils';
import { getCollectionConfig } from './_token-config';

function tokenTypeFromVariable(variable: LocalVariable) {
  switch (variable.resolvedType) {
    case 'BOOLEAN':
      return 'boolean';
    case 'COLOR':
      return 'color';
    case 'FLOAT':
      return 'number';
    case 'STRING':
      return 'string';
  }
}

function tokenValueFromVariable(
  variable: LocalVariable,
  modeId: string,
  localVariables: { [id: string]: LocalVariable },
  variableValue?: VariableValue
) {
  const value =
    variableValue ??
    (modeId ? variable.valuesByMode[modeId] : Object.values(variable.valuesByMode)[0]);
  if (typeof value === 'object') {
    if ('type' in value && value.type === 'VARIABLE_ALIAS') {
      const aliasedVariable = localVariables[value.id];

      if (aliasedVariable) {
        return `{${aliasedVariable.name.replace(/\//g, '.')}}`;
      }
      return;
    } else if ('r' in value) {
      return rgbToHex(value);
    }

    throw new Error(`Format of variable value is invalid: ${value}`);
  } else {
    return value;
  }
}

export function tokenFilesFromLocalVariables(localVariablesResponse: GetLocalVariablesResponse) {
  const tokenFiles: { [fileName: string]: TokensFile } = {};
  const localVariableCollections = localVariablesResponse.meta.variableCollections;
  const localVariables = localVariablesResponse.meta.variables;

  const localVariableCollectionsValues = Object.values(localVariableCollections);
  const childCollections = localVariableCollectionsValues.reduce(
    (acc, collection) => {
      if (collection.parentVariableCollectionId) {
        const parentCollection = (acc[collection.parentVariableCollectionId] =
          acc[collection.parentVariableCollectionId] ?? []);
        parentCollection.push(collection);
        return acc;
      }
      return acc;
    },
    {} as Record<string, LocalVariableCollection[]>
  );

  Object.values(localVariables).forEach((variable) => {
    // Skip remote variables because we only want to generate tokens for local variables
    if (variable.remote) {
      return;
    }

    // Not skipping so it doesn't break, but check with designer to resolve.
    if (variable.deletedButReferenced) {
      console.log(`${variable.name} because it is deleted but referenced`);
      // return;
    }

    const collection = localVariableCollections[variable.variableCollectionId];
    const collectionConfig = getCollectionConfig(collection);
    if (collectionConfig.type === 'ignore') {
      return;
    }

    if (collectionConfig.type === 'standard' || collectionConfig.type === 'single-mode') {
      const modes =
        collectionConfig.type === 'single-mode' ? [collection.modes[0]] : collection.modes;
      modes.forEach((mode) => {
        const modeConfig = collectionConfig.modes?.find((m) => m.name === mode.name);
        if (modeConfig?.skip) {
          return;
        }
        const modeName = modeConfig?.alias ?? mode.name;
        const fileName = `${collection.name}.${modeName}.json`;

        if (!tokenFiles[fileName]) {
          tokenFiles[fileName] = {};
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let obj: any = tokenFiles[fileName];

        variable.name.split('/').forEach((groupName) => {
          obj[groupName] = obj[groupName] || {};
          obj = obj[groupName];
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const token: Token | any = {
          $type: tokenTypeFromVariable(variable),
          $value: tokenValueFromVariable(
            variable,
            mode.parentModeId || mode.modeId,
            localVariables
          ),
          $description: variable.description,
          $extensions: {
            'com.figma': {
              hiddenFromPublishing: variable.hiddenFromPublishing,
              scopes: variable.scopes,
              codeSyntax: variable.codeSyntax,
            },
          },
        };

        Object.assign(obj, token);
      });
    } else if (collectionConfig.type === 'extended') {
      const subCollections = [collection, ...(childCollections[collection.id] ?? [])];
      subCollections.forEach((subCollection) => {
        const collectionName = collectionConfig.alias ?? collectionConfig.name;
        // subCollection.name === 'Brands (White Label)' ? 'Brands' : collection.name;
        // subCollection.modes.forEach((mode) => {
        // const fileName = `${collectionName}.diff.json`;
        // We only need 1 file per collection, not per mode since they'll all have the same tokens
        // const fileName = `${collection.name}.diff.json`;

        // if (!tokenFiles[fileName]) {
        //   tokenFiles[fileName] = {};
        //   console.log(`Creating new file: ${fileName}`);
        //   // console.log(collection.modes);
        // }

        // tokenFiles[fileName][variable.id] = sanitizeKeyName(variable.name);
        // });

        const modeConfig = collectionConfig.modes?.find((m) => m.name === subCollection.name);
        if (modeConfig?.skip) {
          return;
        }
        const isParentCollection = collection.name === subCollection.name;
        if (isParentCollection && collectionConfig.skipParentCollection) {
          return;
        }
        const modeNameAlias = modeConfig?.alias ?? subCollection.name;

        const modeName = isParentCollection
          ? (collectionConfig.parentCollectionAlias ?? collectionName)
          : modeNameAlias;
        const fileName = `${collectionName}.${modeName}.json`;

        if (!tokenFiles[fileName]) {
          tokenFiles[fileName] = {};
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let obj: any = tokenFiles[fileName];

        variable.name.split('/').forEach((groupName) => {
          obj[groupName] = obj[groupName] || {};
          obj = obj[groupName];
        });

        const mode = subCollection.modes[0];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const token: Token | any = {
          $type: tokenTypeFromVariable(variable),
          $variable: variable,
          $value: tokenValueFromVariable(
            variable,
            mode.parentModeId || mode.modeId,
            localVariables,
            subCollection.variableOverrides?.[variable.id]?.[subCollection.defaultModeId]
          ),
          $modeId: mode.modeId,
          $modeName: mode.name,
          $modeParentId: mode.parentModeId,
          $description: variable.description,
          $extensions: {
            'com.figma': {
              hiddenFromPublishing: variable.hiddenFromPublishing,
              scopes: variable.scopes,
              codeSyntax: variable.codeSyntax,
            },
          },
        };

        Object.assign(obj, token);
      });
    }
  });

  return tokenFiles;
}

/**
 * Gets a map of token names so we can diff to see what tokens have been added, removed, or renamed.
 * @param localVariablesResponse The response from the Figma API's getLocalVariables endpoint.
 * @returns A map of token names by file name.
 */
export function getTokenNameMapForDiff(localVariablesResponse: GetLocalVariablesResponse) {
  const tokenFiles: { [fileName: string]: Record<string, string> } = {};
  const localVariableCollections = localVariablesResponse.meta.variableCollections;
  const localVariables = localVariablesResponse.meta.variables;

  // const localVariableCollectionsValues = Object.values(localVariableCollections);
  // const childCollections = localVariableCollectionsValues.reduce(
  //   (acc, collection) => {
  //     if (collection.parentVariableCollectionId) {
  //       const parentCollection = (acc[collection.parentVariableCollectionId] =
  //         acc[collection.parentVariableCollectionId] ?? []);
  //       parentCollection.push(collection);
  //       return acc;
  //     }
  //     return acc;
  //   },
  //   {} as Record<string, LocalVariableCollection[]>
  // );

  Object.values(localVariables)
    .sort((a, b) => a.id.localeCompare(b.id))
    .forEach((variable) => {
      // Skip remote variables because we only want to generate tokens for local variables
      if (variable.remote) {
        return;
      }

      // Not skipping so it doesn't break, but check with designer to resolve.
      if (variable.deletedButReferenced) {
        console.log(`${variable.name} is deleted but referenced`);
        // return;
      }

      const collection = localVariableCollections[variable.variableCollectionId];

      // // We only need 1 file per collection, not per mode since they'll all have the same tokens
      // const fileName = `${collection.name}.diff.json`;

      // if (!tokenFiles[fileName]) {
      //   tokenFiles[fileName] = {};
      // }

      // tokenFiles[fileName][variable.id] = sanitizeKeyName(variable.name);

      // const subCollections = [collection, ...(childCollections[collection.id] ?? [])];
      // if (subCollections) {
      //   subCollections.forEach((subCollection) => {
      const collectionName = getCollectionName(collection);
      // subCollection.modes.forEach((mode) => {
      const fileName = `${collectionName}.diff.json`;
      // We only need 1 file per collection, not per mode since they'll all have the same tokens
      // const fileName = `${collection.name}.diff.json`;

      if (!tokenFiles[fileName]) {
        tokenFiles[fileName] = {};
        console.log(`Creating new file: ${fileName}`);
        // console.log(collection.modes);
      }

      tokenFiles[fileName][variable.id] = sanitizeKeyName(variable.name);
      // });
    });
  // }
  // });

  return tokenFiles;
}

function getCollectionName(collection: LocalVariableCollection) {
  return collection.name === 'Brand' ? 'Brands' : collection.name.replace(' ', '');
}

/**
 * Gets a map of token names so we can diff to see what tokens have been added, removed, or renamed.
 * @param localVariablesResponse The response from the Figma API's getLocalVariables endpoint.
 * @returns A map of token names by file name.
 */
export function getDeletedButReferencedTokens(localVariablesResponse: GetLocalVariablesResponse) {
  const tokenFiles: { [fileName: string]: Record<string, string[]> } = {};
  const localVariableCollections = localVariablesResponse.meta.variableCollections;
  const localVariables = localVariablesResponse.meta.variables;

  Object.values(localVariables)
    .sort((a, b) => a.id.localeCompare(b.id))
    .forEach((variable) => {
      // Skip remote variables because we only want to generate tokens for local variables
      if (variable.remote) {
        return;
      }

      const collection = localVariableCollections[variable.variableCollectionId];
      const collectionName = getCollectionName(collection);
      // We only need 1 file per collection, not per mode since they'll all have the same tokens
      const fileName = `${collectionName}.invalid.json`;

      if (!tokenFiles[fileName]) {
        tokenFiles[fileName] = {};
      }

      // Ensure that we have at least an empty array, even if we don't know where it's referenced from
      // We can only find out when it's referenced from other variables, but not directly from components.
      if (variable.deletedButReferenced) {
        tokenFiles[fileName][variable.name] = [];
      }

      collection.modes.forEach((mode) => {
        const referencedFrom = tokenValueFromInvalidVariable(variable, mode.modeId, localVariables);
        if (referencedFrom) {
          // Ensure the array exists, due to the order of execution it may not have been created above..
          if (!tokenFiles[fileName][variable.name]) {
            tokenFiles[fileName][variable.name] = [];
          }
          // Add the referenced from variable name to the array
          tokenFiles[fileName][variable.name].push(referencedFrom.name);
        }
      });
    });

  Object.keys(tokenFiles).forEach((fileName) => {
    if (Object.keys(tokenFiles[fileName]).length === 0) {
      delete tokenFiles[fileName];
    }
  });

  return tokenFiles;
}

function tokenValueFromInvalidVariable(
  variable: LocalVariable,
  modeId: string,
  localVariables: { [id: string]: LocalVariable }
) {
  const value = variable.valuesByMode[modeId];
  if (typeof value === 'object') {
    if ('type' in value && value.type === 'VARIABLE_ALIAS') {
      const aliasedVariable = localVariables[value.id];

      if (aliasedVariable?.deletedButReferenced) {
        return aliasedVariable;
      }
    }
  }

  return null;
}
