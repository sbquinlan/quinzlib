import upsync, { AsyncWrapper } from './upsync.js';
import range from './range.js';

describe('upsync', () => {
  it('should ignore async iterable', () => {
    async function* async_range(n: number) {
      for (let i = 0; i < n; i++) yield n;
    }

    const iter = async_range(10);
    expect(upsync(iter)).toEqual(iter);
  });

  it('should convert normal iterables', async () => {
    const iter = range(10);
    const converted = upsync(iter);
    expect(converted).toBeInstanceOf(AsyncWrapper);
    const arr: number[] = [];
    for await (const num of converted) arr.push(num);
    expect(arr).toEqual([...range(10)]);
  });
});
