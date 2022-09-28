import PairedPromise from './paired.js';

describe('Paired Promise', () => {
  it('should resolve right', async () => {
    const pair = new PairedPromise<number, void>();
    pair.right(10);
    expect((<any>pair)._left.resolved).toEqual(true);
    expect((<any>pair)._right.resolved).toEqual(false);
    expect(await pair.left()).toEqual(10);
    expect((<any>pair)._left.resolved).toEqual(true);
    expect((<any>pair)._right.resolved).toEqual(true);
  });

  it('should resolve left', async () => {
    const pair = new PairedPromise<void, number>();
    pair.left(10);
    expect((<any>pair)._right.resolved).toEqual(true);
    expect((<any>pair)._left.resolved).toEqual(false);
    expect(await pair.right()).toEqual(10);
    expect((<any>pair)._right.resolved).toEqual(true);
    expect((<any>pair)._left.resolved).toEqual(true);
  });
});
