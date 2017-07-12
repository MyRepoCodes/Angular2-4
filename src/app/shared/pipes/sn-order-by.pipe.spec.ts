import { OrderByPipe } from './sn-order-by.pipe';

describe('SnOrderByPipe', () => {
  it('create an instance', () => {
    const pipe = new OrderByPipe();
    expect(pipe).toBeTruthy();
  });
});
