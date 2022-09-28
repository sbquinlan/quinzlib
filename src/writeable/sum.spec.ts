import { range, sum } from '..';

describe('sink', () => {
  it('should find the max on range', async () => {
    const result = await sum()(range(10));
    expect(result).toEqual(45);
  });

  it('should find the max on another array', async () => {
    const result = await sum()([10, 0, -2]);
    expect(result).toEqual(8);
  });

  it('should find the max on empty array', async () => {
    const result = await sum()([]);
    expect(result).toEqual(0);
  });

  it('should find the max on single element', async () => {
    const result = await sum()([10]);
    expect(result).toEqual(10);
  });
});
