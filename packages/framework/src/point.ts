export class Point {
  constructor(public x: number, public y: number) {}
  public distanceTo(p: Point) {
    const xdist = this.x - p.x;
    const ydist = this.y - p.y;
    const dist = Math.sqrt(xdist * xdist + ydist * ydist);
    return dist;
  }
  public deltaAngleTo(p: Point) {
    const x = p.x - this.x;
    const y = p.y - this.y;
    const theta = Math.atan2(y, x);
    const degrees = theta * 180 / Math.PI;
    return degrees;
  }
  public clone() {
    return new Point(this.x, this.y);
  }
}
