import range from './range.js';
import sink from '../sink.js';
import zip from './zip.js';

describe('zip', () => {
  it('should handle multiple iterables', async () => {
    await expect(sink(zip(range(3), range(3)))).resolves.toEqual([
      [0, 0],
      [1, 1],
      [2, 2],
    ]);
  });

  it('should handle iterables of different length', async () => {
    await expect(sink(zip(range(3), range(5)))).resolves.toEqual([
      [0, 0],
      [1, 1],
      [2, 2],
      [undefined, 3],
      [undefined, 4],
    ]);
  });

  it('should handle one iterable', async () => {
    await expect(
      sink(
        // @ts-ignore i know this is against the types
        zip(range(3))
      )
    ).resolves.toEqual([...range(3)].map((elm) => [elm]));
  });

  it('should handle no iterables', async () => {
    await expect(
      sink(
        // @ts-ignore i know this is against the types
        zip()
      )
    ).resolves.toEqual([]);
  });

  it('should handle empty iterables', async () => {
    await expect(sink(zip([], [], [], []))).resolves.toEqual([]);
  });
});
