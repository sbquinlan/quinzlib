import type { WritableIterable } from '../types.js';
import upsync from '../readable/upsync.js';

/**
 * reduce() pulls as fast as possible to perform whatever operation the passed
 * in lambda specifies and returns the result when the upstream is exhausted.
 *
 * Though it could technically be a transform (resulting in another iterable)
 * it is a bit more complicated to write a transform that can yield results
 * midstream. I'm currently not sure that makes sense because it would be
 * really general.
 */
export default function reduce<TThing, TResult>(
  lambda: (acc: TResult, t: TThing) => TResult,
  initial?: TResult
): WritableIterable<TThing, TResult> {
  return async (upstream: AsyncIterable<TThing> | Iterable<TThing>) => {
    const iter = upsync(upstream)[Symbol.asyncIterator]();
    let result = initial ?? (await iter.next()).value;
    for (let n; !(n = await iter.next()).done; ) {
      result = lambda(result, n.value);
    }
    return result;
  };
}
