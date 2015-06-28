export class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  distanceTo(p) {
    var xdist = this.x - p.x,
      ydist = this.y - p.y,
      dist = Math.sqrt(xdist * xdist + ydist * ydist);

    return dist;
  }
  deltaAngleTo(p) {
    var x = p.x - this.x,
      y = p.y - this.y,
      theta = Math.atan2(y, x),
      degrees = theta * 180 / Math.PI;
    return degrees;
  }
  clone() {
    return new Point(this.x, this.y);
  }
}
