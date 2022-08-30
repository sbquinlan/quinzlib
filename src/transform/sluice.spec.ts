import { fluent, map, sleep, sluice, sink, range } from '..';

describe('sluice', () => {
  it('should work with empty iterator', async () => {
    const result = await fluent(range(0), sluice(3, 100), sink());
    expect(result).toEqual([]);
  });

  it('should work with 1', async () => {
    const start = Date.now();
    const result = await fluent(range(10), sluice(1, 100), sink());
    expect(result).toEqual([...range(10)]);
    expect(Date.now() - start).toBeGreaterThanOrEqual(1000);
  });

  it('should work with 3', async () => {
    const start = Date.now();
    const result = await fluent(range(10), sluice(3, 100), sink());
    expect(result).toEqual([...range(10)]);
    expect(Date.now() - start).toBeGreaterThanOrEqual(800);
  });

  it('should backpressure', async () => {
    const start = Date.now();
    const result = fluent(
      range(10),
      map((num: number) => sleep(10).then(() => num)),
      sluice(5, 10),
      sluice(1, 100),
      sink(),
    );
    await expect(result).resolves.toEqual([...range(10)]);
    expect(Date.now() - start).toBeGreaterThanOrEqual(1000);
  });

  it('should forwardpressure', async () => {
    const start = Date.now();
    const result = fluent(
      range(10),
      map((num: number) => sleep(10).then(() => num)),
      sluice(1, 100),
      sluice(5, 10),
      sink(),
    );
    await expect(result).resolves.toEqual([...range(10)]);
    expect(Date.now() - start).toBeGreaterThanOrEqual(1000);
  });

  it('should stop on throw', async () => {
    const pending = fluent(
      range(10),
      map(async (num: number) => {
        await sleep(10);
        if (num % 6 === 0) {
          throw 'bad';
        }
        return num;
      }),
      sluice(5, 10),
      sink(),
    );
    await expect(pending).rejects.toEqual('bad');
  });
});
