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
          value: function normalizePoints(e, data, Point) {
            var touches, touch;

            switch (e.type) {
              default:
                {
                  touches = Array.prototype.slice.call(e.touches);
                  if (e.type === "touchstart" && touches.length === 1) {
                    data.pointerIds.length = 0;
                    data.pagePoints.length = 0;
                  }
                  while (touch = touches.shift()) {
                    var ix = data.pointerIds.indexOf(touch.identifier);
                    if (ix < 0) {
                      ix = data.pointerIds.push(touch.identifier) - 1;
                    }
                    data.pagePoints[ix] = new Point(touch.pageX, touch.pageY);
                  }
                  break;
                }
              case "click":
              case "mouseup":
                {
                  _get(Object.getPrototypeOf(TouchFlow.prototype), "normalizePoints", this).call(this, e, data, Point);
                }
            }
          }
        }, {
          key: "removePoints",
          value: function removePoints(e, data) {
            switch (e.type) {
              default:
                {
                  var touches = Array.prototype.slice.call(e.changedTouches);
                  var touch;
                  while (touch = touches.shift()) {
                    var ix = data.pointerIds.indexOf(touch.identifier);
                    data.pointerIds.splice(ix, 1);
                    data.pagePoints.splice(ix, 1);
                  }
                }
              case "click":
              case "mouseup":
                {
                  _get(Object.getPrototypeOf(TouchFlow.prototype), "removePoints", this).call(this, e, data);
                }
            }
          }
        }]);

        return TouchFlow;
      })(Flow);

      _export("TouchFlow", TouchFlow);
    }
  };
});