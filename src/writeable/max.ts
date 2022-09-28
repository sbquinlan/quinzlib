import type { WritableIterable } from '../types.js';
import reduce from './reduce.js';

export default function max(): WritableIterable<number, number> {
  return reduce(Math.max);
}
