"use strict";

define(["exports"], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Handle = exports.Handle = function Handle(element, type, subscriber, active) {
    _classCallCheck(this, Handle);

    this.element = element;
    this.type = type;
    this.subscriber = subscriber;
    this.active = active;
  };
});