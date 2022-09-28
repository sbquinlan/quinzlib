import { sift, fluent, map, range, sink, pool, sleep, window } from '..';

describe('sift', () => {
  it('it sifts iterators', async () => {
    await expect(
      fluent(
        range(10),
        sift((n) => Boolean(n % 2)),
        sink()
      )
    ).resolves.toEqual([1, 3, 5, 7, 9]);
  });

  it('it sifts empty iterators', async () => {
    await expect(
      fluent(
        range(0),
        sift((n) => Boolean(n % 2)),
        sink()
      )
    ).resolves.toEqual([]);
  });

  it('it works if it sifts everything', async () => {
    await expect(
      fluent(
        range(1),
        sift((_) => false),
        sink()
      )
    ).resolves.toEqual([]);
  });

  it('should be pool-able', async () => {
    await expect(
      fluent(
        range(10),
        map((n) => (n % 2 ? sleep((10 - n) * 10).then(() => n) : n)),
        sift((n) => Boolean(n % 2)),
        pool(5),
        sink()
      )
    ).resolves.toEqual([9, 7, 5, 3, 1]);
  });

  // sift can either be ordered or concurrent-able
  it('should NOT be window-able', async () => {
    await expect(
      fluent(
        range(10),
        map((n) => (n % 2 ? sleep((10 - n) * 10).then(() => n) : n)),
        sift((n) => Boolean(n % 2)),
        window(5),
        sink()
      )
    ).resolves.not.toEqual([1, 3, 5, 7, 9]);
  });
});
