import Deferred from "./deferred.js";

/**
 * PairedPromise contains two promises (referred to as left and right). Awaiting one promise
 * resolves the other promise. This is useful for doing some concurrent communication.
 *
 * TODO: A future improvement would be to have this not require two promises on creation.
 * So when you create a new node on the right side you could just have a resolved promise.
 * Everytime I try to do that, it gets messy quick.
 */
 export default class PairedPromise<TLeft, TRight> {
  private readonly _left: Deferred<TLeft> = new Deferred<TLeft>();
  private readonly _right: Deferred<TRight> = new Deferred<TRight>();
  constructor() {}

  left(rval: TRight): Promise<TLeft> {
    this._right.resolve(rval);
    return this._left;
  }

  right(lval: TLeft): Promise<TRight> {
    this._left.resolve(lval);
    return this._right;
  }
}