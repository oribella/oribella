import { expect } from 'chai';
import { Point, GESTURE_STRATEGY_FLAG, RETURN_FLAG, matchesSelector } from '../../src/index';

describe('Index', () => {

  it('should export Point, GESTURE_STRATEGY_FLAG, RETURN_FLAG, matchesSelector', () => {
    expect(Point).to.be.a('function');
    expect(GESTURE_STRATEGY_FLAG).to.be.an('object');
    expect(RETURN_FLAG).to.be.an('object');
    expect(matchesSelector).to.be.a('function');
  });

});
