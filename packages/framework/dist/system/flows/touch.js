System.register(["./flow", "../point"], function (_export) {
  /*eslint no-cond-assign: 0*/
  "use strict";

  var Flow, Point, TouchFlow;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

  return {
    setters: [function (_flow) {
      Flow = _flow.Flow;
    }, function (_point) {
      Point = _point.Point;
    }],
    execute: function () {
      TouchFlow = (function (_Flow) {
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
              this.data.pagePoints.push(new Point(touch.pageX, touch.pageY));
            }
          }
        }]);

        return TouchFlow;
      })(Flow);

      _export("TouchFlow", TouchFlow);
    }
  };
});