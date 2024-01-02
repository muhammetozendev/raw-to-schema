import expect from 'expect';
import { NestedProperty, Property, convert } from '../src';

describe('Aliasing', () => {
  it('Aliasing keys in property decorator must work with arrays', () => {
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

    expect(convert(Author, arr)).toEqual([
      {
        id: 1,
        name: 'John Doe',
        books: [
          {
            id: 1,
            name: 'My first book',
          },
          {
            id: 2,
            name: 'My second book',
          },
          {
            id: 3,
            name: 'My third book',
          },
        ],
      },
    ]);
  });

  it('Aliasing keys in property decorator must work with objects', () => {
    class BankInfo {
      @Property({ key: 'bank_id' })
      id: number;

      @Property({ key: 'bank_iban' })
      iban: string;
    }

    class Person {
      @Property({ key: 'person_id' })
      id: number;

      @Property({ key: 'person_name' })
      name: string;

      @NestedProperty({ type: 'object', target: BankInfo })
      bankInfo: BankInfo;
    }

    const arr = [
      {
        person_id: 1,
        person_name: 'Jane Smith',
        bank_id: 10,
        bank_iban: 'iban',
      },
      {
        person_id: 2,
        person_name: 'John Doe',
      },
    ];

    expect(convert(Person, arr)).toEqual([
      {
        id: 1,
        name: 'Jane Smith',
        bankInfo: {
          id: 10,
          iban: 'iban',
        },
      },
      {
        id: 2,
        name: 'John Doe',
        bankInfo: null,
      },
    ]);
  });
});
