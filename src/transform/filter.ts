import { OperatorAsyncFunction } from '../fluent.js';
import upsync from '../readable/upsync.js';

class FilterIterator<TThing>
  implements AsyncIterableIterator<TThing>
{
  private readonly iter: AsyncIterator<TThing>;
  private done: boolean = false;
  constructor(
    upstream: AsyncIterable<TThing> | Iterable<TThing>,
    private readonly call: (thing: TThing) => PromiseLike<boolean> | boolean
  ) {
    this.iter = upsync(upstream)[Symbol.asyncIterator]();
  }

  async next(): Promise<IteratorResult<TThing, any>> {
    if (this.done) {
      return { value: undefined, done: true };
    }
    const { value, done } = await this.iter.next();
    if (done) {
      this.done = this.done || done === true;
      return { value, done };
    }
    const include = await this.call(value);
    if (!include) {
      return this.next();
    }
    return { value, done };
  }

  [Symbol.asyncIterator]() {
    return this;
  }
}

export default function filter<TThing>(
  call: (thing: TThing) => PromiseLike<boolean> | boolean,
): OperatorAsyncFunction<TThing, TThing> {
  return (upstream: AsyncIterable<TThing> | Iterable<TThing>) =>
    new FilterIterator(upstream, call);
}
