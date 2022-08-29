import { OperatorAsyncFunction } from '../fluent.js';
import upsync from '../iterable/upsync.js';
import { any_partition } from '../promise.js';

class PoolIterable<TThing> implements AsyncIterable<TThing> {
  private readonly concurrency: number;
  constructor(
    private upstream: AsyncIterable<TThing> | Iterable<TThing>,
    concurrency: number
  ) {
    this.concurrency = Math.floor(Math.max(0, concurrency));
  }

  async *[Symbol.asyncIterator]() {
    const iter = upsync(this.upstream)[Symbol.asyncIterator]();
    let result,
      done = false,
      active: Promise<IteratorResult<TThing>>[] = [];

    do {
      while (!done && active.length < this.concurrency) {
        active.push(iter.next());
      }
      [result, active] = await any_partition(active);
      done = done || result?.done === true;
      if (!result?.done) {
        yield result!.value;
      }
    } while (!done || active.length);
  }
}

/**
 * Creates a concurrent collection of awaited promises.
 *
 * This is most useful when the upstream async iterator
 * creates promises on calls to next(). If upstream is a
 * collection of already running promises, then this only
 * reorders the upstream based on a sliding window of which
 * promises resolve first.
 */
export default function pool<TThing>(
  concurrency: number = 1 // pool size
): OperatorAsyncFunction<TThing, TThing> {
  return (upstream: AsyncIterable<TThing> | Iterable<TThing>) =>
    new PoolIterable(upstream, concurrency);
}
