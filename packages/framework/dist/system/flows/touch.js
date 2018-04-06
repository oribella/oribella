System.register(["./flow"], function (_export) {
  /*eslint no-cond-assign: 0*/
  "use strict";

  var Flow, TouchFlow;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  return {
    setters: [function (_flow) {
      Flow = _flow.Flow;
    }],
    execute: function () {
      TouchFlow = (function (_Flow) {
        _inherits(TouchFlow, _Flow);

        function TouchFlow(element, Point) {
          _classCallCheck(this, TouchFlow);

          _get(Object.getPrototypeOf(TouchFlow.prototype), "constructor", this).call(this, element, Point, [{
            start: ["touchstart"]
          }, {
            update: ["touchmove"]
          }, {
            end: ["touchend", "mouseup", "click"]
          }, {
            cancel: ["touchcancel", "dragstart"]
          }], true);
        }

        _createClass(TouchFlow, [{
          key: "normalizePoints",
          value: function normalizePoints(event, Point) {
            var _this = this;

            this.allPointers = {};
            this.currentPointers = {};

            Array.prototype.slice.call(event.touches).forEach(function (pointer) {
              _this.allPointers[pointer.identifier] = new Point(pointer.pageX, pointer.pageY);
            });

            Array.prototype.slice.call(event.changedTouches).forEach(function (pointer) {
              _this.currentPointers[pointer.identifier] = new Point(pointer.pageX, pointer.pageY);
            });
          }
        }]);

        return TouchFlow;
      })(Flow);

      _export("TouchFlow", TouchFlow);
    }
  };
});