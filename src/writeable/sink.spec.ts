import { range, sink } from '..';

describe('sink', () => {
  it('should consume an iterable', async () => {
    const result = await sink(range(10));
    expect(result).toEqual([...range(10)]);
  });
});
