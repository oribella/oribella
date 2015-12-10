"use strict";

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

define(["exports", "./pointer"], function (exports, _pointer) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MSPointerFlow = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var MSPointerFlow = exports.MSPointerFlow = (function (_PointerFlow) {
    _inherits(MSPointerFlow, _PointerFlow);

    function MSPointerFlow(element, Point) {
      _classCallCheck(this, MSPointerFlow);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(MSPointerFlow).call(this, element, Point, [{
        start: ["MSPointerDown"]
      }, {
        update: ["MSPointerMove"]
      }, {
        end: ["MSPointerUp"]
      }, {
        cancel: ["MSPointerCancel", "dragstart"]
      }]));
    }

    return MSPointerFlow;
  })(_pointer.PointerFlow);
});