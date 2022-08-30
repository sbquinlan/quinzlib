
export type IterableLike<T> = AsyncIterable<T> | Iterable<T>;
export type ElementTypeOf<T extends IterableLike<any>> = T extends IterableLike<
  infer Tinner
>
  ? Tinner
  : never;

type UnaryFunction<T, R> = (source: T) => R;
export type ReadableIterable<T> = IterableLike<T>;
export type TransformIterable<T, R> = UnaryFunction<
  IterableLike<T>,
  AsyncIterable<R>
>;
export type WritableIterable<T, R> = UnaryFunction<
  IterableLike<T>,
  PromiseLike<R>
>;