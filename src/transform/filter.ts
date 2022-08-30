import { OperatorAsyncFunction } from '../fluent.js';

class FilterIterator<TThing> implements AsyncIterable<TThing> {
  constructor(
    private upstream: AsyncIterable<TThing> | Iterable<TThing>,
    private readonly call: (thing: TThing) => PromiseLike<boolean> | boolean
  ) {}

  async *[Symbol.asyncIterator]() {
    for await (const thing of this.upstream) {
      if (await this.call(thing)) yield thing;
    }
  }
}

/**
 * ORDERED filter. Can't be run concurrently, and everything above it can't
 * be run concurrently as a result. If you don't care about order and want to 
 * run concurrently, then use 
 * 
 * Why can't there be a filter that's ordered and able to run concurrently?
 * 
 * Well, filter/sift has to either return a thing or done. It calls the upstream
 * to get a thing and then it gets filtered out. What does it do? It can't returned 
 * filtered thing and it's not done. It has to request another thing and repeat the
 * filtration. If multiple iterations are running at the same time, then filtering a thing out
 * means that the iterators invert order.
 */
export default function filter<TThing>(
  call: (thing: TThing) => PromiseLike<boolean> | boolean,
): OperatorAsyncFunction<TThing, TThing> {
  return (upstream: AsyncIterable<TThing> | Iterable<TThing>) =>
    new FilterIterator(upstream, call);
}
