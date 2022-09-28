import type { TransformIterable } from '../types.js';
import upsync from '../readable/upsync.js';
import done_result from '../readable/done_result.js';

class SiftIterator<TThing> implements AsyncIterableIterator<TThing> {
  private readonly iter: AsyncIterator<TThing>;
  private done: boolean = false;
  constructor(
    upstream: AsyncIterable<TThing> | Iterable<TThing>,
    private readonly predicate: (
      thing: TThing
    ) => PromiseLike<boolean> | boolean
  ) {
    this.iter = upsync(upstream)[Symbol.asyncIterator]();
  }

  async next(): Promise<IteratorResult<TThing, any>> {
    if (this.done) {
      return done_result;
    }
    const { value, done } = await this.iter.next();
    if (done) {
      this.done = this.done || done === true;
      return { value, done };
    }
    const include = await this.predicate(value);
    if (!include) {
      return this.next();
    }
    return { value, done };
  }

  [Symbol.asyncIterator]() {
    return this;
  }
}

/**
 * UNORDERED filter/sift. Can be run concurrently, but can't guarantee order.
 * If you need ordered then use filter.
 *
 * Why can't there be a filter/sift that's ordered and able to run concurrently?
 *
 * Well, filter/sift has to either return a thing or done. It calls the upstream
 * to get a thing and then it gets filtered out. What does it do? It can't returned
 * filtered thing and it's not done. It has to request another thing and repeat the
 * filtration. If multiple iterations are running at the same time, then filtering a thing out
 * means that the iterators invert order.
 */
export default function sift<TThing>(
  call: (thing: TThing) => PromiseLike<boolean> | boolean
): TransformIterable<TThing, TThing> {
  return (upstream: AsyncIterable<TThing> | Iterable<TThing>) =>
    new SiftIterator(upstream, call);
}
