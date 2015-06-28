System.register(["./engine", "./gesture-registry", "./utils", "./flows/mouse", "./flows/touch", "./flows/ms-pointer", "./flows/pointer", "./point"], function (_export) {
  "use strict";

  var Engine, GestureRegistry, touchEnabled, msPointerEnabled, pointerEnabled, MouseFlow, TouchFlow, MSPointerFlow, PointerFlow, Point, Oribella;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  return {
    setters: [function (_engine) {
      Engine = _engine.Engine;
    }, function (_gestureRegistry) {
      GestureRegistry = _gestureRegistry.GestureRegistry;
    }, function (_utils) {
      touchEnabled = _utils.touchEnabled;
      msPointerEnabled = _utils.msPointerEnabled;
      pointerEnabled = _utils.pointerEnabled;

      for (var _key in _utils) {
        _export(_key, _utils[_key]);
      }
    }, function (_flowsMouse) {
      MouseFlow = _flowsMouse.MouseFlow;
    }, function (_flowsTouch) {
      TouchFlow = _flowsTouch.TouchFlow;
    }, function (_flowsMsPointer) {
      MSPointerFlow = _flowsMsPointer.MSPointerFlow;
    }, function (_flowsPointer) {
      PointerFlow = _flowsPointer.PointerFlow;
    }, function (_point) {
      Point = _point.Point;
    }],
    execute: function () {
      Oribella = (function () {
        function Oribella(element, engine) {
          _classCallCheck(this, Oribella);

          this.element = element || window.document;
          this.registry = new GestureRegistry();
          this.engine = engine || new Engine(this.element, this.registry);
        }

        _createClass(Oribella, [{
          key: "activate",
          value: function activate() {
            return this.engine.activate();
          }
        }, {
          key: "withDefaultFlowStrategy",
          value: function withDefaultFlowStrategy() {
            if (msPointerEnabled) {
              this.engine.addFlow(new MSPointerFlow(this.element, Point));
            }
            if (pointerEnabled) {
              this.engine.addFlow(new PointerFlow(this.element, Point));
            }
            if (touchEnabled) {
              this.engine.addFlow(new TouchFlow(this.element, Point));
            }

            this.engine.addFlow(new MouseFlow(this.element, Point));
            return this;
          }
        }, {
          key: "registerGesture",
          value: function registerGesture(type, Gesture) {
            this.engine.registerGesture(type, Gesture);
            return this;
          }
        }, {
          key: "on",
          value: function on(element, type, subscriber) {
            return this.engine.addHandle(element, type, subscriber);
          }
        }]);

        return Oribella;
      })();

      _export("Oribella", Oribella);
    }
  };
});