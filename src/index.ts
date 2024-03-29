import { ClassConstructor, RemoveOptions } from './types';
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
  let propertyCount = 0;

  const instance = new Target();
  for (const key of keys) {
    // Create a new instance of the target class
    const field = grouped[0][0][key];
    if (field !== undefined) {
      const transformer = metadata.fields[keyMap[key]].transform;
      instance[keyMap[key]] = transformer ? transformer(field) : field;
      if (field !== null) propertyCount++;
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

  return Object.keys(instance).length && propertyCount !== 0 ? instance : null;
}

function removeProperties<T>(object: T, options: RemoveOptions<T>) {
  for (const key in options) {
    if (options[key] === true) {
      delete object[key];
    } else if (typeof options[key] === 'object') {
      removeProperties(object[key], options[key]);
    }
  }
}

export function convert<T, O>(
  Target: ClassConstructor<T>,
  array: O[],
  remove?: RemoveOptions<T>
): T[] {
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
    let propertyCount = 0;
    for (const key of keys) {
      // Create a new instance of the target class
      const field = group[0][key];
      if (field !== undefined) {
        const transformer = metadata.fields[keyMap[key]].transform;
        instance[keyMap[key]] = transformer ? transformer(field) : field;
        if (field !== null) propertyCount++;
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

    if (Object.keys(instance).length && propertyCount !== 0) {
      if (remove) {
        removeProperties(instance, remove);
      }
      result.push(instance);
    }
  }

  return result;
}

export function convertOne<T, O>(
  Target: ClassConstructor<T>,
  array: O[],
  remove?: RemoveOptions<T>
): T | null {
  return convert(Target, array, remove)[0] ?? null;
}

export * from './decorators';
export * from './types';
export * from './transformers';
