import type { IterableLike, TransformIterable } from '../types.js';
import done_result from '../readable/done_result.js';
import upsync from '../readable/upsync.js';

class FlattenIterator<TThing>
  implements AsyncIterableIterator<TThing>
{
  private readonly iter: AsyncIterator<Iterable<TThing>>;
  private buffer: TThing[] = [];
  private done: boolean = false;

  constructor(
    upstream: IterableLike<Iterable<TThing>>,
  ) {
    this.iter = upsync(upstream)[Symbol.asyncIterator]();
  }

  async next(): Promise<IteratorResult<TThing, any>> {
    if (this.done) {
      return done_result;
    }
    if (this.buffer.length) {
      return { value: this.buffer.shift()!, done: false };
    }
    const { value, done } = await this.iter.next();
    if (done) {
      this.done = this.done || done === true;
      return done_result;
    }
    this.buffer = this.buffer.concat(...value);
    return this.next();
  }

  [Symbol.asyncIterator]() {
    return this;
  }
}

export default function flatten<TThing>(
): TransformIterable<Iterable<TThing>, TThing> {
  return (upstream: IterableLike<Iterable<TThing>>) => new FlattenIterator(upstream);
}