System.register(["./engine", "./validator", "./registry", "./flows/mouse", "./flows/touch", "./flows/ms-pointer", "./flows/pointer", "./point", "./utils"], function (_export) {
  "use strict";

  var Engine, Validator, Registry, MouseFlow, TouchFlow, MSPointerFlow, PointerFlow, Point, Oribella;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  return {
    setters: [function (_engine) {
      Engine = _engine.Engine;
    }, function (_validator) {
      Validator = _validator.Validator;
    }, function (_registry) {
      Registry = _registry.Registry;
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
    }, function (_utils) {
      for (var _key in _utils) {
        _export(_key, _utils[_key]);
      }
    }],
    execute: function () {
      Oribella = (function () {
        function Oribella(element, config) {
          _classCallCheck(this, Oribella);

          this.element = element;
          this.config = config;
          this.registry = new Registry();
          this.engine = new Engine(this.element, this.registry, new Validator(this.isMouse.bind(this)));
        }

        _createClass(Oribella, [{
          key: "activate",
          value: function activate() {
            return this.engine.activate();
          }
        }, {
          key: "withDefaultFlowStrategy",
          value: function withDefaultFlowStrategy() {
            if (this.config.msPointerEnabled) {
              this.engine.addFlow(new MSPointerFlow(this.element, Point));
            }
            if (this.config.pointerEnabled) {
              this.engine.addFlow(new PointerFlow(this.element, Point));
            }
            if (this.config.touchEnabled) {
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
        }, {
          key: "isMouse",
          value: function isMouse(e) {
            if (this.config.msPointerEnabled && e.pointerType === e.MSPOINTER_TYPE_MOUSE) {
              //IE10
              return true;
            }
            if (this.config.pointerEnabled && e.pointerType === "mouse") {
              //IE11
              return true;
            }
            if (e.type.indexOf("mouse") !== -1) {
              return true;
            }
            return false;
          }
        }]);

        return Oribella;
      })();

      _export("Oribella", Oribella);
    }
  };
});