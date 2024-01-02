import { ClassConstructor } from './types';
import { classMetadataStorage } from './storage';
import { group } from './utils';

function convertObject<T, O>(Target: ClassConstructor<T>, array: O[]): T {
  const metadata = classMetadataStorage.get(Target);
  const keys = [];
  const keyMap: Record<string, string> = {};
  Object.keys(metadata.fields).forEach((key) => {
    const keyToAdd = metadata.fields[key].key ?? key;
    keys.push(keyToAdd);
    keyMap[keyToAdd] = key;
  });

  const grouped = group(array, keys);

  const instance = new Target();
  for (const key of keys) {
    // Create a new instance of the target class
    const field = grouped[0][0][key];
    if (field !== undefined) {
      const transformer = metadata.fields[keyMap[key]].transform;
      instance[keyMap[key]] = transformer ? transformer(field) : field;
    }
  }

  // If the key is nested, we need to recursively call convert
  for (const nestedKey of Object.keys(metadata.nestedFields)) {
    const { type, target: NestedTarget } =
      metadata.nestedFields[nestedKey].nested;

    if (type === 'array') {
      instance[nestedKey] = convert(NestedTarget, grouped[0]);
    } else {
      instance[nestedKey] = convertObject(NestedTarget, grouped[0]);
    }
  }

  return Object.keys(instance).length ? instance : null;
}

export function convert<T, O>(Target: ClassConstructor<T>, array: O[]): T[] {
  const metadata = classMetadataStorage.get(Target);
  const keys = [];
  const keyMap: Record<string, string> = {};
  Object.keys(metadata.fields).forEach((key) => {
    const keyToAdd = metadata.fields[key].key ?? key;
    keys.push(keyToAdd);
    keyMap[keyToAdd] = key;
  });

  const groups = group(array, keys);

  const result: T[] = [];

  for (const group of groups) {
    const instance = new Target();
    for (const key of keys) {
      // Create a new instance of the target class
      const field = group[0][key];
      if (field !== undefined) {
        const transformer = metadata.fields[keyMap[key]].transform;
        instance[keyMap[key]] = transformer ? transformer(field) : field;
      }
    }

    // If the key is nested, we need to recursively call convert
    for (const nestedKey of Object.keys(metadata.nestedFields)) {
      const { type, target: NestedTarget } =
        metadata.nestedFields[nestedKey].nested;

      if (type === 'array') {
        instance[nestedKey] = convert(NestedTarget, group);
      } else {
        instance[nestedKey] = convertObject(NestedTarget, group);
      }
    }

    if (Object.keys(instance).length) {
      result.push(instance);
    }
  }

  return result;
}

export * from './decorators';
export * from './types';
export * from './transformers';
