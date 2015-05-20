System.register(["./flow", "../point"], function (_export) {
  var Flow, Point, _classCallCheck, _createClass, _get, _inherits, MSPointerFlow;

  return {
    setters: [function (_flow) {
      Flow = _flow.Flow;
    }, function (_point) {
      Point = _point.Point;
    }],
    execute: function () {
      "use strict";

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

      _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

      MSPointerFlow = (function (_Flow) {
        function MSPointerFlow(element) {
          _classCallCheck(this, MSPointerFlow);

          _get(Object.getPrototypeOf(MSPointerFlow.prototype), "constructor", this).call(this, element, [{
            start: ["MSPointerDown"]
          }, {
            update: ["MSPointerMove"]
          }, {
            end: ["MSPointerUp"]
          }, {
            cancel: ["MSPointerCancel", "dragstart"]
          }]);
        }

        _inherits(MSPointerFlow, _Flow);

        _createClass(MSPointerFlow, [{
          key: "normalizePoints",
          value: function normalizePoints(event) {
            var ix = this.data.pointerIds.indexOf(event.pointerId);
            if (ix < 0) {
              ix = this.data.pointerIds.push(event.pointerId) - 1;
            }
            this.data.pagePoints[ix] = new Point(event.pageX, event.pageY);
          }
        }, {
          key: "stop",
          value: function stop() {
            _get(Object.getPrototypeOf(MSPointerFlow.prototype), "stop", this).call(this);
            this.data.pointerIds.length = 0;
          }
        }]);

        return MSPointerFlow;
      })(Flow);

      _export("MSPointerFlow", MSPointerFlow);
    }
  };
});