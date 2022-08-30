/**
 * Very shitty version of python's range() that only supports
 * the most basic (and most useful) functionality of generating
 * a range from [0 - n) incrementing by 1.
 */
export default function* range(n: number): Iterable<number> {
  n = Math.max(0, n);
  for (let i = 0; i < n; i++) yield i;
}
