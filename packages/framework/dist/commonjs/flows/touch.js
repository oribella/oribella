"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TouchFlow = undefined;

var _flow = require("./flow");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TouchFlow = exports.TouchFlow = function (_Flow) {
  _inherits(TouchFlow, _Flow);

  function TouchFlow(element, Point) {
    _classCallCheck(this, TouchFlow);

    return _possibleConstructorReturn(this, _Flow.call(this, element, Point, [{
      start: ["touchstart"]
    }, {
      update: ["touchmove"]
    }, {
      end: ["touchend", "mouseup", "click"]
    }, {
      cancel: ["touchcancel", "dragstart"]
    }], true));
  }

  TouchFlow.prototype.normalizePoints = function normalizePoints(event, Point) {
    var _this2 = this;

    this.allPointers = {};
    this.currentPointers = {};

    Array.prototype.slice.call(event.touches).forEach(function (pointer) {
      _this2.allPointers[pointer.identifier] = {
        page: new Point(pointer.pageX, pointer.pageY),
        client: new Point(pointer.clientX, pointer.clientY)
      };
    });

    Array.prototype.slice.call(event.changedTouches).forEach(function (pointer) {
      _this2.currentPointers[pointer.identifier] = {
        page: new Point(pointer.pageX, pointer.pageY),
        client: new Point(pointer.clientX, pointer.clientY)
      };
    });
  };

  return TouchFlow;
}(_flow.Flow);
//# sourceMappingURL=touch.js.map