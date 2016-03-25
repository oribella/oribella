"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Point = exports.Point = function () {
  function Point(x, y) {
    _classCallCheck(this, Point);

    this.x = x;
    this.y = y;
  }

  Point.prototype.distanceTo = function distanceTo(p) {
    var xdist = this.x - p.x,
        ydist = this.y - p.y,
        dist = Math.sqrt(xdist * xdist + ydist * ydist);

    return dist;
  };

  Point.prototype.deltaAngleTo = function deltaAngleTo(p) {
    var x = p.x - this.x,
        y = p.y - this.y,
        theta = Math.atan2(y, x),
        degrees = theta * 180 / Math.PI;
    return degrees;
  };

  Point.prototype.clone = function clone() {
    return new Point(this.x, this.y);
  };

  return Point;
}();
//# sourceMappingURL=point.js.map