import type { WritableIterable } from '../types.js'
import upsync from '../readable/upsync.js';

/**
 * sink() pulls things from an interator as fast as possible to make
 * and array. Think Array.from, but supporting AsyncIterables.
 */
export default function sink<TThing>(): WritableIterable<TThing, TThing[]> {
  return async (upstream: AsyncIterable<TThing> | Iterable<TThing>) => {
    const iter = upsync(upstream)[Symbol.asyncIterator]();
    const arr = [];
    for (let next; !(next = await iter.next()).done; ) {
      arr.push(next.value);
    }
    return arr;
  }
}