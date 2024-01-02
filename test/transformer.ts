import { convert } from '../src';
import { NestedProperty, Property } from '../src/decorators';
import { BooleanTransformer, NumberTransformer } from '../src/transformers';
import { expect } from 'expect';

describe('Transformers', () => {
  it('Transformers must be able to perform type casting', () => {
    const arr = [
      {
        id: 1,
        name: 'Jane Smith',
        book_id: 1,
        title: 'My First Book',
        count: '10',
        onSale: 1,
      },
      {
        id: 1,
        name: 'Jane Smith',
        book_id: 1,
        title: 'My Second Book',
        count: '10',
        onSale: true,
      },
      {
        id: 1,
        name: 'Jane Smith',
        book_id: 1,
        title: 'My Third Book',
        count: '10',
        onSale: 0,
      },
      {
        id: 1,
        name: 'Jane Smith',
        book_id: 1,
        title: 'My Fourth Book',
        count: '10',
        onSale: false,
      },
      {
        id: 1,
        name: 'Jane Smith',
        book_id: 3,
        title: 'The Great Adventure',
        count: '20',
        onSale: '0',
      },
      {
        id: 1,
        name: 'Jane Smith',
        book_id: 16,
        title: 'Data Science Simplified',
        count: '30',
        onSale: '1',
      },
    ];

    class Book {
      @Property({ key: 'book_id' })
      id: number;

      @Property()
      title: string;

      @Property({ key: 'count', transform: NumberTransformer })
      count: number;

      @Property({ transform: BooleanTransformer })
      onSale: boolean;
    }

    class Author {
      @Property()
      id: number;

      @Property()
      name: string;

      @NestedProperty({ type: 'array', target: Book })
      books: Book[];
    }

    const result = convert(Author, arr);
    expect(result).toEqual([
      {
        id: 1,
        name: 'Jane Smith',
        books: [
          {
            id: 1,
            title: 'My First Book',
            count: 10,
            onSale: true,
          },
          {
            id: 1,
            title: 'My Second Book',
            count: 10,
            onSale: true,
          },
          {
            id: 1,
            title: 'My Third Book',
            count: 10,
            onSale: false,
          },
          {
            id: 1,
            title: 'My Fourth Book',
            count: 10,
            onSale: false,
          },
          {
            id: 3,
            title: 'The Great Adventure',
            count: 20,
            onSale: false,
          },
          {
            id: 16,
            title: 'Data Science Simplified',
            count: 30,
            onSale: true,
          },
        ],
      },
    ]);
  });
});
