import { fluent, map, window, sleep, sluice, sink, range } from '..';

describe('window', () => {
  it('should work on empty iterator', async () => {
    const result = await fluent(range(0), window(1), sink());
    expect(result).toEqual([]);
  });

  it('should work with window size 3 on empty iterator', async () => {
    const result = await  fluent(range(0), window(3), sink());
    expect(result).toEqual([]);
  });

  it('should work with window size 3', async () => {
    const result = await fluent(range(10), window(3), sink());
    expect(result).toEqual([...range(10)]);
  });

  it('should be ordered', async () => {
    const result = fluent(
      range(10),
      map(async (num: number) => {
        await sleep(num % 3 ? 1 : 100);
        return num;
      }),
      window(3),
      sink(),
    );
    await expect(result).resolves.toEqual([...range(10)]);
  });

  it('should be forward pressured', async () => {
    const start = Date.now();
    const result = fluent(range(10), sluice(1, 100), window(3), sink());
    await expect(result).resolves.toEqual([...range(10)]);
    expect(Date.now() - start).toBeGreaterThanOrEqual(1000);
  });

  it('should be back pressured', async () => {
    const start = Date.now();
    const probes = await fluent(
      range(10),
      map(async () => Date.now()),
      window(3),
      sluice(1, 100),
      map(async (start) => [start, Date.now()]),
      sink(),
    );
    expect(probes[9][0]).toBeGreaterThanOrEqual(start + 700);
    expect(Date.now() - start).toBeGreaterThanOrEqual(1000);
  });
});
