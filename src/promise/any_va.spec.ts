import { sleep, any_va } from '..';

describe('any_va', () => {
  it('should return first promise', async () => {
    const [first, _] = await any_va([
      Promise.resolve(10),
      sleep(100).then(() => 'abc'),
    ]);

    expect(first).toEqual(10);
  });

  it('should throw on error', async () => {
    try {
      const [_, __] = await any_va([
        Promise.reject('bad'),
        sleep(100).then(() => 'good'),
      ]);
    } catch (e: any) {
      expect(e).toEqual('bad');
    }
  });
});
