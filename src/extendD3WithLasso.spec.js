import * as d3 from 'd3';
import './extendD3WithLasso';

describe('extendD3WithLasso', () => {
  it('should extend d3 with lasso', () => {
    expect(d3.lasso).toBeDefined();
  });
});
