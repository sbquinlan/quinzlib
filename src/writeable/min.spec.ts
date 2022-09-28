import { range, min } from '..';

describe('sink', () => {
  it('should find the max on range', async () => {
    const result = await min()(range(10));
    expect(result).toEqual(0);
  });

  it('should find the max on another array', async () => {
    const result = await min()([10, 0, -2]);
    expect(result).toEqual(-2);
  });

  it('should find the max on empty array', async () => {
    const result = await min()([]);
    expect(result).toEqual(undefined);
  });

  it('should find the max on single element', async () => {
    const result = await min()([10]);
    expect(result).toEqual(10);
  });
});
