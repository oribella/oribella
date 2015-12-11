"use strict";

System.register(["./engine", "./registry", "./flows/mouse", "./flows/touch", "./flows/ms-pointer", "./flows/pointer", "./point"], function (_export) {
  var Engine, Registry, MouseFlow, TouchFlow, MSPointerFlow, PointerFlow, Point;
  return {
    setters: [function (_engine) {
      Engine = _engine.Engine;
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
    }],
    execute: function () {
      class Oribella {
        constructor(element, config) {
          this.element = element;
          this.config = config;
          this.registry = new Registry();
          this.engine = new Engine(this.element, this.registry, this.isMouse.bind(this), this.isValidMouseButton.bind(this));
        }

        activate() {
          return this.engine.activate();
        }

        withDefaultFlowStrategy() {
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

        registerGesture(type, Gesture) {
          this.engine.registerGesture(type, Gesture);
          return this;
        }

        on(element, type, subscriber) {
          return this.engine.addHandle(element, type, subscriber);
        }

        isMouse(e) {
          if (this.config.msPointerEnabled && e.pointerType === e.MSPOINTER_TYPE_MOUSE) {
            return true;
          }

          if (this.config.pointerEnabled && e.pointerType === "mouse") {
            return true;
          }

          if (e.type.indexOf("mouse") !== -1) {
            return true;
          }

          return false;
        }

        isValidMouseButton(event, allowedBtn) {
          var btn = event.button,
              which = event.which,
              actualBtn;
          actualBtn = !which && btn !== undefined ? btn & 1 ? 1 : btn & 2 ? 3 : btn & 4 ? 2 : 0 : which;
          return Array.isArray(allowedBtn) ? allowedBtn.some(function (val) {
            return actualBtn === val;
          }) : actualBtn === allowedBtn;
        }

      }

      _export("Oribella", Oribella);
    }
  };
});