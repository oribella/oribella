"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Oribella = undefined;

var _engine = require("./engine");

var _registry = require("./registry");

var _mouse = require("./flows/mouse");

var _touch = require("./flows/touch");

var _msPointer = require("./flows/ms-pointer");

var _pointer = require("./flows/pointer");

var _point = require("./point");

class Oribella {
  constructor(element, config) {
    this.element = element;
    this.config = config;
    this.registry = new _registry.Registry();
    this.engine = new _engine.Engine(this.element, this.registry, this.isMouse.bind(this), this.isValidMouseButton.bind(this));
  }
  activate() {
    return this.engine.activate();
  }
  withDefaultFlowStrategy() {
    if (this.config.msPointerEnabled) {
      this.engine.addFlow(new _msPointer.MSPointerFlow(this.element, _point.Point));
    }
    if (this.config.pointerEnabled) {
      this.engine.addFlow(new _pointer.PointerFlow(this.element, _point.Point));
    }
    if (this.config.touchEnabled) {
      this.engine.addFlow(new _touch.TouchFlow(this.element, _point.Point));
    }

    this.engine.addFlow(new _mouse.MouseFlow(this.element, _point.Point));
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
exports.Oribella = Oribella;