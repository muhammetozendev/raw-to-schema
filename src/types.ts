export type NestingType = 'array' | 'object';

export interface ClassConstructor<T = any> {
  new (...args: any[]): T;
}

export interface PropertyMetadata {
  key?: string;
  transform?: (value: any) => any;
  nested?: { type: NestingType; target: ClassConstructor };
}

export interface ClassMetadata {
  fields: { [key: string]: PropertyMetadata };
  nestedFields: { [key: string]: PropertyMetadata };
}

export interface PropertyDecoratorMetadata {
  key?: string;
  transform?: (value: any) => any;
}

export interface NestedPropertyMetadata {
  type: NestingType;
  target: ClassConstructor;
}
