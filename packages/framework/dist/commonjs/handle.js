"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Handle = function Handle(element, type, subscriber, active) {
  _classCallCheck(this, Handle);

  this.element = element;
  this.type = type;
  this.subscriber = subscriber;
  this.active = active;
};

exports.Handle = Handle;