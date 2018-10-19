import * as d3 from './scripts/d3.min';
import './extendD3WithLasso';

describe('extendD3WithLasso', () => {
  it('should extend d3 with lasso', () => {
    expect(d3.lasso).toBeDefined();
  });
});
