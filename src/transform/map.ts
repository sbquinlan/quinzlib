import type { IterableLike, TransformIterable } from '../types.js';
import done_result from '../readable/done_result.js';
import upsync from '../readable/upsync.js';

class MappingIterator<TThing, TResult>
  implements AsyncIterableIterator<Awaited<TResult>>
{
  private readonly iter: AsyncIterator<TThing>;
  private done: boolean = false;
  constructor(
    upstream: IterableLike<TThing>,
    private readonly call: (thing: TThing) => TResult
  ) {
    this.iter = upsync(upstream)[Symbol.asyncIterator]();
  }

  async next(): Promise<IteratorResult<Awaited<TResult>, any>> {
    if (this.done) return done_result;
    const { value, done } = await this.iter.next();
    this.done = this.done || done === true;
    return { value: done ? value : await this.call(value), done };
  }

  [Symbol.asyncIterator]() {
    return this;
  }
}

/**
 * map() is extremely similar to Array.map() with the
 * added benefit that it can be used over iterators.
 */
export default function map<TThing, TResult>(
  call: (thing: TThing) => TResult
): TransformIterable<TThing, Awaited<TResult>> {
  return (upstream: IterableLike<TThing>) =>
    new MappingIterator(upstream, call);
}
