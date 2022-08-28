import { fluent, map, sleep, sluice, sink, range } from '..';

describe('sluice', () => {
  it('should work with empty iterator', async () => {
    const result = await sink(
      fluent(
        range(0),
        sluice(3, 100),
      )
    )
    expect(result).toEqual([]);
  });

  it('should work with 1', async () => {
    const start = Date.now();
    const result = await sink(
      fluent(
        range(10),
        sluice(1, 100),
      )
    )
    expect(result).toEqual([... range(10)]);
    expect(Date.now() - start).toBeGreaterThanOrEqual(1000);
  });

  it('should work with 3', async () => {
    const start = Date.now();
    const result = await sink(
      fluent(
        range(10),
        sluice(3, 100),
      )
    )
    expect(result).toEqual([... range(10)]);
    expect(Date.now() - start).toBeGreaterThanOrEqual(800);
  });

  it('should backpressure', async () => {
    const start = Date.now();
    const result = sink(
      fluent(
        range(10),
        map((num: number) => sleep(10).then(() => num)),
        sluice(5, 10),
        sluice(1, 100),
      )
    );
    await expect(result).resolves.toEqual([... range(10)])
    expect(Date.now() - start).toBeGreaterThanOrEqual(1000);
  })

  it('should forwardpressure', async () => {
    const start = Date.now();
    const result = sink(
      fluent(
        range(10),
        map((num: number) => sleep(10).then(() => num)),
        sluice(1, 100),
        sluice(5, 10),
      )
    );
    await expect(result).resolves.toEqual([... range(10)])
    expect(Date.now() - start).toBeGreaterThanOrEqual(1000);
  })

  it('should stop on throw', async () => {
    const pending = sink(
      fluent(
        range(10),
        map(
          async (num: number) => {
            await sleep(10)
            if (num % 6 === 0) {
              throw 'bad';
            }
            return num;
          }
        ),
        sluice(5, 10),
      )
    );
    await expect(pending).rejects.toEqual('bad')
  });
});