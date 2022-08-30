import upsync from '../readable/upsync.js';

/**
 * sink() pulls things from an interator as fast as possible to make
 * and array. Think Array.from, but supporting AsyncIterables.
 */
export default async function sink<TThing>(
  upstream: AsyncIterable<TThing> | Iterable<TThing>
): Promise<Array<TThing>> {
  const iter = upsync(upstream)[Symbol.asyncIterator]();
  const arr = [];
  for (let next; !(next = await iter.next()).done; ) {
    arr.push(next.value);
  }
  return arr;
}
