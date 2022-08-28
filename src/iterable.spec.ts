import { sink, range } from './iterable.js';

describe('sink', () => {
  it('should consume an iterable', async () => {
    const result = await sink(range(10));
    expect(result).toEqual([... range(10)]);
  });
});