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

export type RemoveOptionsProperty<Property> = Property extends Promise<infer I>
  ? RemoveOptionsProperty<NonNullable<I>> | boolean
  : Property extends Array<infer I>
  ? RemoveOptionsProperty<NonNullable<I>> | boolean
  : Property extends string
  ? never
  : Property extends number
  ? never
  : Property extends boolean
  ? never
  : Property extends Function
  ? never
  : Property extends Buffer
  ? never
  : Property extends Date
  ? never
  : Property extends object
  ? RemoveOptions<Property> | boolean
  : boolean;

export type RemoveOptions<Entity> = {
  [P in keyof Entity]?: P extends 'toString'
    ? unknown
    : RemoveOptionsProperty<NonNullable<Entity[P]>>;
};
