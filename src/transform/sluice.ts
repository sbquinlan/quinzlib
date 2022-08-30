import { OperatorAsyncFunction } from '../fluent.js';
import sleep from '../promise/sleep.js';
import done_result from '../readable/done_result.js';
import upsync from '../readable/upsync.js';

class LeakyBucketIterable<TThing> implements AsyncIterableIterator<TThing> {
  private readonly iter: AsyncIterator<TThing>;
  private readonly limit: number;
  private readonly rate: number;

  private level: number = 0;
  private last: number = Date.now();
  private done: boolean = false;
  constructor(
    upstream: AsyncIterable<TThing> | Iterable<TThing>,
    limit: number,
    rate: number
  ) {
    this.iter = upsync(upstream)[Symbol.asyncIterator]();
    this.limit = Math.floor(Math.max(1, limit));
    this.rate = Math.floor(Math.max(0, rate));
  }

  async next(): Promise<IteratorResult<TThing, any>> {
    // calc leaked amount
    const now = Date.now();
    const leaked = (now - this.last) / this.rate;
    this.last = now;

    // update level
    this.level = Math.max(this.level - leaked + 1, 0);

    // do we need to wait for more to leak?
    const delay = Math.max((this.level - this.limit) * this.rate, 0);
    if (delay > 0) {
      await sleep(delay);
      if (this.done) {
        return done_result;
      }
    }
    const result = await this.iter.next();
    this.done = this.done || result.done === true;
    return result;
  }

  [Symbol.asyncIterator]() {
    return this;
  }
}

/**
 * sluice() is a "leaky bucket" implementation for rate limiting.
 *
 * Every iteration adds 1 to the bucket. If the bucket is at it's
 * limit then it sleeps until the leak rate would make space for
 * 1 more unit in the bucket.
 *
 * Imagine a bucket that leaks at set rate (1 "unit" per <rate> ms) with a
 * <limit> capacity. For example, you could have a bucket that leaks 1 "unit"
 * every 1000 ms (or 1 sec) and has a capacity of 3. This bucket could
 * burst 3 iterations until it hits the limit of 3, then wait 1 second
 * until the next iteration.
 */
export default function sluice<TThing>(
  limit: number,
  rate: number
): OperatorAsyncFunction<TThing, TThing> {
  return (upstream: AsyncIterable<TThing> | Iterable<TThing>) =>
    new LeakyBucketIterable(upstream, limit, rate);
}
