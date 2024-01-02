import { expect } from 'expect';
import { NestedProperty, Property, convert } from '../src';

describe('Nested objects', () => {
  it('Nesting objects should work', () => {
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
    expect(result).toEqual([
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
