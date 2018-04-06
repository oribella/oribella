System.register([], function (_export) {
  var _classCallCheck, _createClass, Point;

  return {
    setters: [],
    execute: function () {
      "use strict";

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      Point = (function () {
        function Point(x, y) {
          _classCallCheck(this, Point);

          this.x = x;
          this.y = y;
        }

        _createClass(Point, [{
          key: "distanceTo",
          value: function distanceTo(p) {
            var xdist = this.x - p.x,
                ydist = this.y - p.y,
                dist = Math.sqrt(xdist * xdist + ydist * ydist);

            return dist;
          }
        }, {
          key: "getDeltaAngle",
          value: function getDeltaAngle(p) {
            var x = p.x - this.x,
                y = p.y - this.y,
                theta = Math.atan2(y, x),
                degrees = theta * 180 / Math.PI;
            return degrees;
          }
        }, {
          key: "clone",
          value: function clone() {
            return new Point(this.x, this.y);
          }
        }]);

        return Point;
      })();

      _export("Point", Point);
    }
  };
});