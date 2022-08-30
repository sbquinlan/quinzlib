import { any_partition, sleep } from '..';

describe('any_partition', () => {
  it('should return undefined from empty array', async () => {
    const [result, leftovers] = await any_partition([]);
    expect(result).toEqual(undefined);
    expect(leftovers).toEqual([]);
  });

  it('should return empty array with one promise', async () => {
    const [result, leftovers] = await any_partition([Promise.resolve(10)]);
    expect(result).toEqual(10);
    expect(leftovers).toEqual([]);
  });

  it('should return first result with rest of promises', async () => {
    const [result, leftovers] = await any_partition([
      sleep(100),
      Promise.resolve(10),
    ]);
    expect(result).toEqual(10);
    expect(leftovers).toHaveLength(1);
  });

  it('should throw on error', async () => {
    try {
      const [_, __] = await any_partition([
        Promise.reject('bad'),
        sleep(100).then(() => 'good'),
      ]);
    } catch (e: any) {
      expect(e).toEqual('bad');
    }
  });
});