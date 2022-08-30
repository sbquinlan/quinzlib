type PromiseResolve<T> = (value: T | PromiseLike<T>) => void;
type PromiseReject = (reason?: any) => void;
/**
 * Deferred is a Promise that exposes it's resolve() and reject()
 * as class properties as well as it's settled state. The primary
 * use case of this is to reverse the API. Meaning, if you wanted
 * to give some abstraction a promise rather than giving some
 * abstraction the settle callbacks.
 *
 * Being an event listener vs being the event emitter.
 */
export default class Deferred<T> extends Promise<T> {
  public readonly resolve: PromiseResolve<T>;
  public readonly reject: PromiseReject;
  public readonly resolved: boolean = false;
  public readonly rejected: boolean = false;

  constructor() {
    let temp_res: PromiseResolve<T>, temp_rej: PromiseReject;
    super((res, rej) => {
      temp_res = res;
      temp_rej = rej;
    });
    this.resolve = (val: T | PromiseLike<T>) => {
      if (this.settled) return;
      // @ts-ignore setting readonly in the constructor sorta.
      this.resolved = true;
      temp_res(val);
    };
    this.reject = (val: any) => {
      if (this.settled) return;
      // @ts-ignore setting readonly in the constructor sorta.
      this.rejected = true;
      temp_rej(val);
    };
  }

  public get settled() {
    return this.resolved || this.rejected;
  }

  static get [Symbol.species]() {
    return Promise;
  }
}
