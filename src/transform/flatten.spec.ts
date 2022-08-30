import { flatten, fluent, map, pool, range, sink, sleep, window } from '..';

describe('flatten', () => {
  it('should flatten arrays', async () => {
    await expect(sink(
      fluent(
        range(3),
        map(n => [n, n]),
        flatten(),
      )
    )).resolves.toEqual([0, 0, 1, 1, 2, 2]);
  });

  it('should handle empty arrays', async () => {
    await expect(sink(
      fluent(
        range(3),
        map(_ => []),
        flatten(),
      )
    )).resolves.toEqual([]);
  });

  it('should be pool-able', async () => {
    await expect(sink(
      fluent(
        fluent(
          range(4),
          map(n => sleep((10 - n) * 10).then(_ => [n])),
        ),
        flatten(),
        pool(5),
      )
    )).resolves.toEqual([]);
  });

  it('should be window-able', async () => {
    await expect(sink(
      fluent(
        fluent(
          range(4),
          map(n => sleep((10 - n) * 10).then(_ => [n])),
        ),
        flatten(),
        window(5),
      )
    )).resolves.toEqual([]);
  });
})