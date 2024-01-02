# Raw to Schema

## Description

The motivation behind developing this package is to be able convert signle level plain JSON objects into a set of nested objects to obtain the desired object structure. It's especially useful when converting the raw result of join queries into a nested format just like ORMs do in an effortless way.

## How to use it

### Converting to Target Schema with Nested Arrays

Here's the source object we will convert into a given schema:

```ts
const arr = [
  {
    author_id: 1,
    author_name: 'John Doe',
    book_id: 1,
    book_name: 'My first book',
  },
  {
    author_id: 1,
    author_name: 'John Doe',
    book_id: 2,
    book_name: 'My second book',
  },
  {
    author_id: 1,
    author_name: 'John Doe',
    book_id: 3,
    book_name: 'My third book',
  },
];
```

Following is the schema that describes the structure of the objects to be created:

```ts
class Book {
  @Property({ key: 'book_id' })
  id: number;

  @Property({ key: 'book_name' })
  name: string;
}

class Author {
  @Property({ key: 'author_id' })
  id: number;

  @Property({ key: 'author_name' })
  name: string;

  @NestedProperty({ type: 'array', target: Book })
  books: Book[];
}
```

From the above schema we can see that there's an author with `id` and `name` properties and that author has an array of books. Book schema also has the fields `id` and `name`. When conversion is successful, the type of the final object will be as follows:

```ts
type FinalOutput = {
  id: number;
  name: string;
  books: {
    id: number;
    name: string;
  }[];
}[];
```

It should also be noted that the fields in both `Author` and `Book` do not directly map to the fields in the given array. In order to make that mapping, we pass an object to the `Property` decorator that maps the given field to a field in the raw object. As we can see above, `author_id` from the raw results will be mapped to `id`, `author_name` to `name` etc. However, if the field name is matching the field name of the object in the raw object array, you do not need to do this explicit mapping.

After we define the schema, it's as simple as calling `convert` method by passing the schema and the array:

```ts
const output = convert(Author, arr);
```

Here's the output:

```json
[
  {
    "id": 1,
    "name": "John Doe",
    "books": [
      {
        "id": 1,
        "name": "My first book"
      },
      {
        "id": 2,
        "name": "My second book"
      },
      {
        "id": 3,
        "name": "My third book"
      }
    ]
  }
]
```

### Converting to Target Schema with Nested Objects

The process is very similar for converting nested objects. The only difference is the nested property will be a plain javascript object istead of an array. That's more suitable when dealing with raw results of one to one relationships. Here's an example:

```ts
class BankInfo {
  @Property({ key: 'bank_id' })
  id: number;

  @Property()
  iban: string;
}

class Person {
  @Property()
  id: number;

  @Property()
  name: string;

  @NestedProperty({ type: 'object', target: BankInfo })
  bankInfo: BankInfo;
}

const arr = [
  {
    id: 1,
    name: 'Jane Smith',
    bank_id: 10,
    iban: 'iban',
  },
  {
    id: 2,
    name: 'John Doe',
  },
];

const result = convert(Person, arr);
```

Output:

```json
[
  {
    "id": 1,
    "name": "Jane Smith",
    "bankInfo": {
      "id": 10,
      "iban": "iban"
    }
  },
  {
    "id": 2,
    "name": "John Doe",
    "bankInfo": null
  }
]
```

There, we assume each user can have at most one bank account. Therefore, `bankInfo` property is not an array and we put type as `object` instead of `array` in `NestedProperty` decorator.

### Using Transformers During Conversion

When defining schema properties using `Property` decorator, we can pass a transformer to the configuration object as follows

```ts
class SomeClass {
  @Property({ transform: (value: any) => Number(value) })
  someField: number;
}
```

The transformer function that is specified gets run on the actual value of the object. The callback accepts only a single parameter which is the actual value and the desired transformed value has to be returned from the callback. Despite the ability to create transformers flexibily, we provide a set of predefined transformers to save developers a bit of time as follows:

```ts
export function BooleanTransformer(
  value: string | number | boolean
): boolean | null {
  if (value === 'true' || value === 1 || value === '1' || value === true) {
    return true;
  } else if (
    value === 'false' ||
    value === 0 ||
    value === '0' ||
    value === false
  ) {
    return false;
  } else {
    return null;
  }
}

export function NumberTransformer(value: any): number | null {
  const result = Number(value);
  return isNaN(result) ? null : result;
}

export function StringTransformer(value: any): string | null {
  return String(value);
}
```

`BooleanTransformer` is aimed at converting boolean values that come from the database driver (0,1,true,false etc) and convert them to actual boolean value in javascript. The other two transformers are obviously converting to `Number` and `String`
