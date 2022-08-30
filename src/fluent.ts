import type { ReadableIterable, TransformIterable, WritableIterable } from "./types.js";

export function fluent<T>(
  source: ReadableIterable<T>,
): AsyncIterable<T>;
export function fluent<T, A>(
  source: ReadableIterable<T>,
  op1: TransformIterable<T, A>,
): AsyncIterable<A>;
export function fluent<T, A, B>(
  source: ReadableIterable<T>,
  op1: TransformIterable<T, A>,
  op2: TransformIterable<A, B>
): AsyncIterable<B>;
export function fluent<T, A, B, C>(
  source: ReadableIterable<T>,
  op1: TransformIterable<T, A>,
  op2: TransformIterable<A, B>,
  op3: TransformIterable<B, C>
): AsyncIterable<C>;
export function fluent<T, A, B, C, D>(
  source: ReadableIterable<T>,
  op1: TransformIterable<T, A>,
  op2: TransformIterable<A, B>,
  op3: TransformIterable<B, C>,
  op4: TransformIterable<C, D>
): AsyncIterable<D>;
export function fluent<T, A, B, C, D, E>(
  source: ReadableIterable<T>,
  op1: TransformIterable<T, A>,
  op2: TransformIterable<A, B>,
  op3: TransformIterable<B, C>,
  op4: TransformIterable<C, D>,
  op5: TransformIterable<D, E>
): AsyncIterable<E>;

export function fluent<T, R>(
  source: ReadableIterable<T>,
  sink: WritableIterable<T, R>,
): PromiseLike<R>;
export function fluent<T, A, R>(
  source: ReadableIterable<T>,
  op1: TransformIterable<T, A>,
  sink: WritableIterable<A, R>,
): PromiseLike<R>;
export function fluent<T, A, B, R>(
  source: ReadableIterable<T>,
  op1: TransformIterable<T, A>,
  op2: TransformIterable<A, B>,
  sink: WritableIterable<B, R>,
): PromiseLike<R>;
export function fluent<T, A, B, C, R>(
  source: ReadableIterable<T>,
  op1: TransformIterable<T, A>,
  op2: TransformIterable<A, B>,
  op3: TransformIterable<B, C>,
  sink: WritableIterable<C, R>,
): PromiseLike<R>;
export function fluent<T, A, B, C, D, R>(
  source: ReadableIterable<T>,
  op1: TransformIterable<T, A>,
  op2: TransformIterable<A, B>,
  op3: TransformIterable<B, C>,
  op4: TransformIterable<C, D>,
  sink: WritableIterable<D, R>,
): PromiseLike<R>;
export function fluent<T, A, B, C, D, E, R>(
  source: ReadableIterable<T>,
  op1: TransformIterable<T, A>,
  op2: TransformIterable<A, B>,
  op3: TransformIterable<B, C>,
  op4: TransformIterable<C, D>,
  op5: TransformIterable<D, E>,
  sink: WritableIterable<E, R>,
): PromiseLike<R>;

export function fluent<T, A, R>(
  sink: WritableIterable<A, R>,
): PromiseLike<R>;
export function fluent<T, A, R>(
  op1: TransformIterable<T, A>,
  sink: WritableIterable<A, R>,
): PromiseLike<R>;
export function fluent<T, A, B, R>(
  op1: TransformIterable<T, A>,
  op2: TransformIterable<A, B>,
  sink: WritableIterable<B, R>,
): PromiseLike<R>;
export function fluent<T, A, B, C, R>(
  op1: TransformIterable<T, A>,
  op2: TransformIterable<A, B>,
  op3: TransformIterable<B, C>,
  sink: WritableIterable<C, R>,
): PromiseLike<R>;
export function fluent<T, A, B, C, D, R>(
  op1: TransformIterable<T, A>,
  op2: TransformIterable<A, B>,
  op3: TransformIterable<B, C>,
  op4: TransformIterable<C, D>,
  sink: WritableIterable<D, R>,
): PromiseLike<R>;
export function fluent<T, A, B, C, D, E, R>(
  op1: TransformIterable<T, A>,
  op2: TransformIterable<A, B>,
  op3: TransformIterable<B, C>,
  op4: TransformIterable<C, D>,
  op5: TransformIterable<D, E>,
  sink: WritableIterable<E, R>,
): PromiseLike<R>;

export function fluent(
  ...operations: any[]
) {
  let start;
  if (
    Symbol.asyncIterator in operations[0] ||
    Symbol.iterator in operations[0]
  ) {
    start = operations.shift();
  }
  return operations.reduce((acc, oper) => oper(acc), start);
}
