import { fluent, pool, range, sink, stripe, sleep, window } from '..';
import done_result from './done_result';

class SleepyRange implements AsyncIterableIterator<number> {
  private i: number = 0;
  constructor(private ms: number, private n: number) {}

  async next(): Promise<IteratorResult<number, any>> {
    if (this.i >= this.n) return Promise.resolve(done_result);
    const idx = this.i++;
    const value = await sleep(this.ms).then(() => idx);
    return { value, done: false };
  }

  [Symbol.asyncIterator]() {
    return this;
  }
}

describe('stripe', () => {
  it('should stripe multiple iterables', async () => {
    await expect(sink()(stripe([0, 2, 4], [1, 3, 5]))).resolves.toEqual([
      ...range(6),
    ]);
  });

  it('should stripe multiple iterables of different length', async () => {
    await expect(
      sink()(stripe([0, 2, 4], [1, 3, 5, 6, 7, 8, 9]))
    ).resolves.toEqual([...range(10)]);
  });

  it('should iterate through one iterable', async () => {
    await expect(sink()(stripe(range(6)))).resolves.toEqual([...range(6)]);
  });

  it('should iterate through no iterables', async () => {
    await expect(sink()(stripe())).resolves.toEqual([]);
  });

  it('should be pool-able', async () => {
    await expect(
      fluent(
        stripe(new SleepyRange(100, 3), new SleepyRange(10, 4)),
        pool(5),
        sink()
      )
    ).resolves.toEqual([...range(4), ...range(3)]);
  });

  it('should be window-able', async () => {
    await expect(
      fluent(
        stripe(new SleepyRange(100, 3), new SleepyRange(10, 4)),
        window(5),
        sink()
      )
    ).resolves.toEqual([0, 0, 1, 1, 2, 2, 3]);
  });
});
