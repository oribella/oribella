"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
/*eslint no-cond-assign: 0*/

var _Flow2 = require("./flow");

var _Point = require("../point");

var TouchFlow = (function (_Flow) {
  function TouchFlow(element) {
    _classCallCheck(this, TouchFlow);

    _get(Object.getPrototypeOf(TouchFlow.prototype), "constructor", this).call(this, element, [{
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
    value: function normalizePoints(event) {
      this.data.pagePoints.length = 0;
      var touches = Array.prototype.slice.call(event.touches),
          touch;

      if (event.type === "touchend") {
        touches = touches.concat(Array.prototype.slice.call(event.changedTouches));
      }

      while (touch = touches.shift()) {
        this.data.pagePoints.push(new _Point.Point(touch.pageX, touch.pageY));
      }
    }
  }]);

  return TouchFlow;
})(_Flow2.Flow);

exports.TouchFlow = TouchFlow;