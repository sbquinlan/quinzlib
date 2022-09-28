import { filter, fluent, map, range, sink, pool, sleep, window } from '..';

describe('filter', () => {
  it('it filters iterators', async () => {
    await expect(
      fluent(
        range(10),
        filter((n) => Boolean(n % 2)),
        sink()
      )
    ).resolves.toEqual([1, 3, 5, 7, 9]);
  });

  it('it filters empty iterators', async () => {
    await expect(
      fluent(
        range(0),
        filter((n) => Boolean(n % 2)),
        sink()
      )
    ).resolves.toEqual([]);
  });

  it('it works if it filters everything', async () => {
    await expect(
      fluent(
        range(1),
        filter((_) => false),
        sink()
      )
    ).resolves.toEqual([]);
  });

  it('should NOT be pool-able', async () => {
    await expect(
      fluent(
        range(10),
        map((n) => (n % 2 ? sleep((10 - n) * 10).then(() => n) : n)),
        filter((n) => Boolean(n % 2)),
        pool(5),
        sink()
      )
    ).resolves.not.toEqual([9, 7, 5, 3, 1]);
  });

  it('should be window-able', async () => {
    await expect(
      fluent(
        range(10),
        map((n) => (n % 2 ? sleep((10 - n) * 10).then(() => n) : n)),
        filter((n) => Boolean(n % 2)),
        window(5),
        sink()
      )
    ).resolves.toEqual([1, 3, 5, 7, 9]);
  });
});
