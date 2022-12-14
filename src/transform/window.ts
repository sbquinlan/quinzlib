import type { IterableLike, TransformIterable } from '../types.js';
import upsync from '../readable/upsync.js';

class WindowIterable<TThing> implements AsyncIterable<TThing> {
  private readonly concurrency: number;
  constructor(private upstream: IterableLike<TThing>, concurrency: number) {
    this.concurrency = Math.floor(Math.max(0, concurrency));
  }

  protected async settleBuffer(
    active: Promise<IteratorResult<TThing>>[]
  ): Promise<
    [IteratorResult<TThing> | undefined, Promise<IteratorResult<TThing>>[]]
  > {
    const result = await active.shift();
    return [result, active];
  }

  async *[Symbol.asyncIterator]() {
    const iter = upsync(this.upstream)[Symbol.asyncIterator]();
    let result,
      done = false,
      active: Promise<IteratorResult<TThing>>[] = [];

    do {
      while (active.length < this.concurrency) {
        active.push(iter.next());
      }
      [result, active] = await this.settleBuffer(active);
      done = done || result?.done === true;
      if (!result?.done) {
        yield result!.value;
      }
    } while (!done);
  }
}

/**
 * Ordered version of pool().
 *
 * This will maintain the order of the upstream iterator rather
 * than reordering based on what promises finish first. The difference
 * being that pool() uses a Promise.any() like approach to waiting
 * for the concurrently running promises.
 */
export default function window<TThing>(
  concurrency: number = 1 // window size
): TransformIterable<TThing, TThing> {
  return (upstream: IterableLike<TThing>) =>
    new WindowIterable(upstream, concurrency);
}
