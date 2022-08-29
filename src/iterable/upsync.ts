function isAsyncIterable<TThing>(
  maybe_iterable: any
): maybe_iterable is AsyncIterable<TThing> {
  return Symbol.asyncIterator in maybe_iterable;
}

export class AsyncWrapper<TThing> implements AsyncIterableIterator<TThing> {
  private iter: Iterator<TThing>;
  constructor(source: Iterable<TThing>) {
    this.iter = source[Symbol.iterator]();
  }

  async next(): Promise<IteratorResult<TThing, any>> {
    return this.iter.next();
  }

  [Symbol.asyncIterator]() {
    return this;
  }
}

export default function upsync<TThing>(
  upstream: AsyncIterable<TThing> | Iterable<TThing>
): AsyncIterable<TThing> {
  return isAsyncIterable(upstream) ? upstream : new AsyncWrapper(upstream);
}
