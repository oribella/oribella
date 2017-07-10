import { expect } from 'chai';
import { Point } from '../../src/point';

describe('Point', () => {

  it('should get distance between two points', () => {
    const p1 = new Point(4, 0);
    const p2 = new Point(0, 3);
    expect(p1.distanceTo(p2)).to.equal(5);
  });

  it('should get delta angle between two points', () => {
    const p1 = new Point(0, 5);
    const p2 = new Point(0, 4);
    expect(p1.deltaAngleTo(p2)).to.equal(-90);
  });

  it('should clone a point', () => {
    const p1 = new Point(3, 3);
    const p2 = p1.clone();
    expect(p2).to.deep.equal(p1);
  });

});
