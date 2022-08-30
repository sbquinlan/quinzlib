import upsync from './upsync.js';
import done_result from './done_result.js';
import { ElementTypeOf, IterableLike, ReadableIterable } from '../types.js';

type OptionalMappedElements<T extends readonly IterableLike<unknown>[]> = {
  -readonly [P in keyof T]: ElementTypeOf<T[P]> | undefined;
};
type MappedIterators<T extends readonly IterableLike<unknown>[]> = {
  -readonly [P in keyof T]: AsyncIterator<T[P]>;
};
class ZipIterable<T extends readonly IterableLike<unknown>[]>
  implements AsyncIterableIterator<OptionalMappedElements<T>>
{
  private iters: MappedIterators<T>;

  constructor(...iterables: [...T]) {
    this.iters = iterables.map((i) =>
      upsync(i)[Symbol.asyncIterator]()
    ) as MappedIterators<T>;
  }

  async next(): Promise<IteratorResult<OptionalMappedElements<T>, any>> {
    const results = await Promise.all(this.iters.map((i) => i.next()));
    if (results.every(({ done }) => done === true)) {
      return done_result;
    }
    return {
      done: false,
      value: results.map(({ value }) => value) as OptionalMappedElements<T>,
    };
  }

  [Symbol.asyncIterator]() {
    return this;
  }
}

export default function zip<T extends readonly IterableLike<unknown>[]>(
  ...iterables: [...T]
): ReadableIterable<OptionalMappedElements<T>> {
  return new ZipIterable(...iterables);
}
