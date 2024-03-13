import expect from 'expect';
import { NestedProperty, Property, convert } from '../src';

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

function getTimeInMs() {
  const hrTime = process.hrtime();
  return hrTime[0] * 1000000 + hrTime[1] / (1000 * 1000);
}

describe('Performance Test', () => {
  it('should work less than 1.5 ms with 300 objects', () => {
    const arr = Array.from({ length: 300 }, (_, i) => ({
      id: i,
      name: `Name ${i}`,
      bank_id: i,
      iban: `iban ${i}`,
    }));

    const start = getTimeInMs();
    const result = convert(Person, arr);
    const end = getTimeInMs();
    expect(end - start).toBeLessThan(1.5);
  });

  it('should work less than 1.5 ms with 300 objects and removing fields', () => {
    const arr = Array.from({ length: 300 }, (_, i) => ({
      id: i,
      name: `Person ${i}`,
      bank_id: i,
      iban: `iban ${i}`,
    }));

    const start = getTimeInMs();
    const result = convert(Person, arr, { bankInfo: true });
    const end = getTimeInMs();
    expect(end - start).toBeLessThan(1.5);
  });
});
