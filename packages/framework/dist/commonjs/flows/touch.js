/*eslint no-cond-assign: 0*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _flow = require("./flow");

var _point = require("../point");

var TouchFlow = (function (_Flow) {
  function TouchFlow(element) {
    _classCallCheck(this, TouchFlow);

    _get(Object.getPrototypeOf(TouchFlow.prototype), "constructor", this).call(this, element, _point.Point, [{
      start: ["touchstart"]
    }, {
      update: ["touchmove"]
    }, {
      end: ["touchend", "mouseup"]
    }, {
      cancel: ["touchcancel", "dragstart"]
    }], true);
  }

  _inherits(TouchFlow, _Flow);

  _createClass(TouchFlow, [{
    key: "normalizePoints",
    value: function normalizePoints(event, data, Point) {
      var touches, touch;

      switch (event.type) {
        default:
          {
            touches = Array.prototype.slice.call(event.touches);
            while (touch = touches.shift()) {
              var ix = data.pointerIds.indexOf(touch.identifier);
              if (ix < 0) {
                ix = data.pointerIds.push(touch.identifier) - 1;
              }
              data.pagePoints[ix] = new Point(touch.pageX, touch.pageY);
            }
            break;
          }
        case "mouseup":
          {
            _get(Object.getPrototypeOf(TouchFlow.prototype), "normalizePoints", this).call(this, event, data, Point);
          }
      }
    }
  }, {
    key: "removePoints",
    value: function removePoints(event, data) {
      var touches = Array.prototype.slice.call(event.changedTouches);
      var touch;
      while (touch = touches.shift()) {
        var ix = data.pointerIds.indexOf(touch.identifier);
        data.pointerIds.splice(ix, 1);
        data.pagePoints.splice(ix, 1);
      }
    }
  }]);

  return TouchFlow;
})(_flow.Flow);

exports.TouchFlow = TouchFlow;