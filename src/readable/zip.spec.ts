import { fluent, pool, range, map, sleep, zip, sink, window } from '..';

describe('zip', () => {
  it('should handle multiple iterables', async () => {
    await expect(sink()(zip(range(3), range(3)))).resolves.toEqual([
      [0, 0],
      [1, 1],
      [2, 2],
    ]);
  });

  it('should handle iterables of different length', async () => {
    await expect(sink()(zip(range(3), range(5)))).resolves.toEqual([
      [0, 0],
      [1, 1],
      [2, 2],
      [undefined, 3],
      [undefined, 4],
    ]);
  });

  it('should handle one iterable', async () => {
    await expect(sink()(zip(range(3))))
      .resolves.toEqual([...range(3)].map((elm) => [elm]));
  });

  it('should handle no iterables', async () => {
    await expect(
      sink()(zip())
    ).resolves.toEqual([]);
  });

  it('should handle empty iterables', async () => {
    await expect(sink()(zip([], [], [], []))).resolves.toEqual([]);
  });

  it('should be pool-able', async () => {
    const left = fluent(
      range(4),
      map(n => sleep((10 - n) * 10).then(_ => n)),
    )
    await expect(
      fluent(
        zip(left, range(4)),
        pool(5),
        sink()
      )
    ).resolves.toEqual([
      [3, 3],
      [2, 2],
      [1, 1],
      [0, 0],
    ]);
  });

  it('should be window-able', async () => {
    const left = fluent(
      range(3),
      map(n => sleep((10 - n) * 10).then(_ => n)),
    )
    await expect(
      fluent(
        zip(left, range(4)),
        window(5),
        sink(),
      )
    ).resolves.toEqual([[0, 0], [1, 1], [2, 2], [undefined, 3]]);
  });
});
