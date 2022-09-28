import type { WritableIterable } from '../types.js';
import reduce from './reduce.js';

export default function sum(): WritableIterable<number, number> {
  return reduce((a, b) => a + b, 0);
}
