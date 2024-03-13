import expect from 'expect';
import { NestedProperty, Property, convert } from '../src';

describe('Removing fields', () => {
  it('should remove nested object fields', () => {
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
      },
      {
        id: 2,
        name: 'John Doe',
      },
    ];

    const result = convert(Person, arr, {
      bankInfo: true,
    });

    expect(result).toEqual([
      {
        id: 1,
        name: 'Jane Smith',
      },
      {
        id: 2,
        name: 'John Doe',
      },
    ]);
  });

  it('should remove nested array fields', () => {
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

      @NestedProperty({ type: 'array', target: BankInfo })
      bankInfo: BankInfo[];
    }

    const arr = [
      {
        id: 1,
        name: 'Jane Smith',
      },
      {
        id: 2,
        name: 'John Doe',
      },
    ];

    const result = convert(Person, arr, {
      bankInfo: true,
    });

    expect(result).toEqual([
      {
        id: 1,
        name: 'Jane Smith',
      },
      {
        id: 2,
        name: 'John Doe',
      },
    ]);
  });
});
