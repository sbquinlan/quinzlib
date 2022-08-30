import { fluent, map, pool, sleep, sluice, sink, range } from '..';

describe('pool', () => {
  it('should work on empty iterator', async () => {
    const result = await fluent(range(0), pool(1), sink());
    expect(result).toEqual([]);
  });

  it('should work with pool size 3 on empty iterator', async () => {
    const result = await fluent(range(0), pool(3), sink());
    expect(result).toEqual([]);
  });

  it('should work with pool size 3', async () => {
    const result = await fluent(range(10), pool(3), sink());
    expect(result).toEqual([...range(10)]);
  });

  it('should be unordered', async () => {
    const result = await fluent(
      range(10),
      map(async (num: number) => {
        const now = Date.now();
        await sleep(num % 3 ? 1 : 100);
        return [num, now, Date.now()];
      }),
      pool(5),
      sink(),
    );
    expect(result.map((p) => p[0])).toEqual([1, 2, 4, 5, 7, 8, 0, 3, 6, 9]);
  });

  it('should be forward pressured', async () => {
    const start = Date.now();
    const probes = await fluent(
      range(10),
      map(async () => [Date.now()]),
      sluice(1, 100),
      pool(3),
      map(async (arr) => {
        arr.push(Date.now());
        return arr;
      }),
      sink(),
    );
    expect(probes[9][0]).toBeGreaterThanOrEqual(start + 700);
    expect(Date.now() - start).toBeGreaterThanOrEqual(1000);
  });

  it('should be back pressured', async () => {
    const start = Date.now();
    const probes = await fluent(
      range(10),
      map(async () => Date.now()),
      pool(3),
      sluice(1, 100),
      map(async (s) => [s, Date.now()]),
      sink(),
    );
    expect(probes[9][0]).toBeGreaterThanOrEqual(start + 700);
    expect(Date.now() - start).toBeGreaterThanOrEqual(1000);
  });
});
