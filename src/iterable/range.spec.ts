import { range } from '..';

describe('range', () => {
  it('should return empty iterable for zero', () => {
    expect([...range(0)]).toEqual([]);
  });

  it('should return max to zero', () => {
    expect([...range(-1)]).toEqual([]);
  });

  it('should return a range', () => {
    expect([...range(1)]).toEqual([0]);
    expect([...range(10)]).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
});
