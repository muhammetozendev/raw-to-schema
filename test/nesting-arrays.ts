import { convert } from '../src';
import { NestedProperty, Property } from '../src/decorators';
import { expect } from 'expect';

describe('Nested arrays', () => {
  it('Nesting arrays should work', () => {
    class Tags {
      @Property()
      tag: string;
    }

    class Book {
      @Property({ key: 'book_id' })
      id: number;

      @Property()
      title: string;

      @NestedProperty({ type: 'array', target: Tags })
      tags: Tags[];
    }

    class Author {
      @Property()
      id: number;

      @Property()
      name: string;

      @NestedProperty({ type: 'array', target: Book })
      books: Book[];
    }

    const arr = [
      {
        id: 1,
        name: 'Jane Smith',
        book_id: 14,
        title: 'My First Book',
        tag: 'tag1',
      },
      {
        id: 2,
        name: 'John Doe',
        book_id: 2,
        title: 'The Great Adventure',
        tag: 'tag4',
      },
      {
        id: 1,
        name: 'Jane Smith',
        book_id: 16,
        title: 'Data Science Simplified',
        tag: 'tag3',
      },
      {
        id: 1,
        name: 'Jane Smith',
        book_id: 8,
        title: 'Mystery of the Python',
        tag: 'tag3',
      },
      {
        id: 3,
        name: 'Alice Johnson',
        book_id: 2,
        title: 'The Great Adventure',
        tag: 'tag4',
      },
    ];

    const result = convert(Author, arr);
    expect(result).toEqual([
      {
        id: 1,
        name: 'Jane Smith',
        books: [
          {
            id: 14,
            title: 'My First Book',
            tags: [{ tag: 'tag1' }],
          },
          {
            id: 16,
            title: 'Data Science Simplified',
            tags: [{ tag: 'tag3' }],
          },
          {
            id: 8,
            title: 'Mystery of the Python',
            tags: [{ tag: 'tag3' }],
          },
        ],
      },
      {
        id: 2,
        name: 'John Doe',
        books: [
          {
            id: 2,
            title: 'The Great Adventure',
            tags: [{ tag: 'tag4' }],
          },
        ],
      },
      {
        id: 3,
        name: 'Alice Johnson',
        books: [
          {
            id: 2,
            title: 'The Great Adventure',
            tags: [{ tag: 'tag4' }],
          },
        ],
      },
    ]);
  });
});
