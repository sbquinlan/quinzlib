import type { WritableIterable } from '../types.js';
import reduce from './reduce.js';

export default function min(): WritableIterable<number, number> {
  return reduce(Math.min);
}
