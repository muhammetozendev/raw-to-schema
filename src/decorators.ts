import { classMetadataStorage } from './storage';
import { NestedPropertyMetadata, PropertyDecoratorMetadata } from './types';

export function Property(metadata?: PropertyDecoratorMetadata) {
  return function (target: any, key: string) {
    const ClassConstructor = target.constructor;
    const classMetadata = classMetadataStorage.get(ClassConstructor) || {
      fields: {},
      nestedFields: {},
    };
    classMetadata.fields[key] = metadata ? metadata : { key: key };
    classMetadataStorage.set(ClassConstructor, classMetadata);
  };
}

export function NestedProperty(metadata: NestedPropertyMetadata) {
  return function (target: any, key: string) {
    const ClassConstructor = target.constructor;
    const classMetadata = classMetadataStorage.get(ClassConstructor) || {
      fields: {},
      nestedFields: {},
    };
    classMetadata.nestedFields[key] = {
      nested: { type: metadata.type, target: metadata.target },
    };
    classMetadataStorage.set(ClassConstructor, classMetadata);
  };
}
