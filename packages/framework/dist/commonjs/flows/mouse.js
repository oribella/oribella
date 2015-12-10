"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MouseFlow = undefined;

var _flow = require("./flow");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MouseFlow = exports.MouseFlow = (function (_Flow) {
  _inherits(MouseFlow, _Flow);

  function MouseFlow(element, Point) {
    _classCallCheck(this, MouseFlow);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(MouseFlow).call(this, element, Point, [{
      start: ["mousedown"]
    }, {
      update: ["mousemove"]
    }, {
      end: ["mouseup"]
    }, {
      cancel: ["dragstart", "contextmenu"]
    }], false));
  }

  _createClass(MouseFlow, [{
    key: "normalizePoints",
    value: function normalizePoints(event, Point) {
      switch (event.type) {
        case "mousedown":
        case "mousemove":
          this.allPointers = this.currentPointers = {
            1: new Point(event.pageX, event.pageY)
          };
          break;
        default:
          this.allPointers = {};
          break;
      }
    }
  }]);

  return MouseFlow;
})(_flow.Flow);