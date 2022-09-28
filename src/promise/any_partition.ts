/**
 * any_partition() is like Promise.any() but the tuple it returns
 * contains both the result (first element) and the promises that
 * didn't resolve yet as an array (second element).
 *
 * Basically like ```const [resolved, ... rest] = Promise.any([...])```
 */
export default async function any_partition<TThing>(
  proms: Promise<TThing>[]
): Promise<[TThing | undefined, Promise<TThing>[]]> {
  if (proms.length === 0) {
    return [undefined, []] as any;
  }

  return new Promise((res, rej) => {
    for (let i = 0; i < proms.length; i++) {
      proms[i].then((subresult) => {
        const remaining = proms.slice();
        remaining.splice(i, 1);
        res([subresult as any, remaining]);
      }, rej);
    }
  });
}
