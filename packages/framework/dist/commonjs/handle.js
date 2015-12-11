"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
class Handle {
  constructor(element, type, subscriber, active) {
    this.element = element;
    this.type = type;
    this.subscriber = subscriber;
    this.active = active;
  }
}
exports.Handle = Handle;