import upsync, { AsyncWrapper } from './upsync.js';
import done_result from './done_result.js';

type SomeIterable<T> = AsyncIterable<T> | Iterable<T>;
type ElementTypeOf<T extends SomeIterable<any>> = T extends SomeIterable<
  infer Tinner
>
  ? Tinner
  : never;
class StripeIterable<Titers extends SomeIterable<any>[]>
  implements AsyncIterableIterator<ElementTypeOf<Titers[number]>>
{
  private iters: AsyncIterator<ElementTypeOf<Titers[number]>>[];
  private tapped: boolean[];
  private stripper: number = 0;

  constructor(...iters: [...Titers]) {
    this.iters = iters.map((it) => upsync(it)[Symbol.asyncIterator]()) as any;
    this.tapped = new Array(this.iters.length).fill(false);
  }

  async next(): Promise<IteratorResult<ElementTypeOf<Titers[number]>>> {
    if (this.tapped.every((b) => b)) {
      return done_result;
    }
    while (this.tapped[this.stripper]) {
      this.stripper = (this.stripper + 1) % this.iters.length;
    }
    const idx = this.stripper;
    this.stripper = (this.stripper + 1) % this.iters.length;

    const result = await this.iters[idx].next();
    if (result.done) {
      this.tapped[idx] = true;
      return this.next();
    }
    return result;
  }

  [Symbol.asyncIterator]() {
    return this;
  }
}

export default function stripe<Titers extends SomeIterable<any>[]>(
  ...iters: [...Titers]
): AsyncIterable<ElementTypeOf<Titers[number]>> {
  if (iters.length <= 1) {
    return iters[0] ? upsync(iters[0]!) : new AsyncWrapper([]);
  }
  return new StripeIterable(...iters);
}
