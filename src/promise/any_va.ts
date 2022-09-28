// Convienence type for matching args to outputs
type OptionalMappedPromises<T extends readonly Promise<unknown>[]> = {
  -readonly [P in keyof T]: Awaited<T[P]> | undefined;
};

/**
 * any_va takes an array/tuple of Promises and returns the first result
 * from those promises. The catch is that the return type is an empty
 * array except for the one result that finished first, in the same
 * position as the promise that resolved. This, plus the typing,
 * is slightly helpful in cases where you want any promise that finishes
 * but you also need to know what finished.
 */
export default async function any_va<T extends readonly Promise<unknown>[]>(
  proms: [...T]
): Promise<OptionalMappedPromises<T>> {
  if (proms.length === 0) {
    return [] as unknown as OptionalMappedPromises<T>;
  }

  return new Promise((res, rej) => {
    for (let i = 0; i < proms.length; i++) {
      proms[i].then((subresult) => {
        const all_results = new Array(
          proms.length
        ) as OptionalMappedPromises<T>;
        all_results[i] = subresult;
        res(all_results);
      }, rej);
    }
  });
}
