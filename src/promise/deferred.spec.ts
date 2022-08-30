import { Deferred } from '..';

describe('defer', () => {
  it('should resolve', async () => {
    const result = new Deferred();
    result.resolve(10);
    expect(await result).toEqual(10);

    expect(result.settled).toEqual(true);
    expect(result.rejected).toEqual(false);
    expect(result.resolved).toEqual(true);
  });

  it('should reject', async () => {
    const result = new Deferred();
    result.reject('bad');

    try {
      await result;
    } catch (e: any) {
      expect(e).toEqual('bad');
    }
    expect(result.settled).toEqual(true);
    expect(result.rejected).toEqual(true);
    expect(result.resolved).toEqual(false);
  });

  it('should chain', async () => {
    const start = new Deferred<number>();
    const end = start.then((prev) => prev + 10);
    start.resolve(10);
    expect(await start).toEqual(10);
    expect(await end).toEqual(20);
  });
});