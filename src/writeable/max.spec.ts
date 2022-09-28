import { range, max } from '..';

describe('sink', () => {
  it('should find the max on range', async () => {
    const result = await max()(range(10));
    expect(result).toEqual(9);
  });

  it('should find the max on another array', async () => {
    const result = await max()([10, 0, -2]);
    expect(result).toEqual(10);
  });

  it('should find the max on empty array', async () => {
    const result = await max()([]);
    expect(result).toEqual(undefined);
  });

  it('should find the max on single element', async () => {
    const result = await max()([10]);
    expect(result).toEqual(10);
  });
});
