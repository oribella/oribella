"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TouchFlow = undefined;

var _flow = require("./flow");

class TouchFlow extends _flow.Flow {
  constructor(element, Point) {
    super(element, Point, [{
      start: ["touchstart"]
    }, {
      update: ["touchmove"]
    }, {
      end: ["touchend", "mouseup", "click"]
    }, {
      cancel: ["touchcancel", "dragstart"]
    }], true);
  }
  normalizePoints(event, Point) {
    this.allPointers = {};
    this.currentPointers = {};

    Array.prototype.slice.call(event.touches).forEach(pointer => {
      this.allPointers[pointer.identifier] = new Point(pointer.pageX, pointer.pageY);
    });

    Array.prototype.slice.call(event.changedTouches).forEach(pointer => {
      this.currentPointers[pointer.identifier] = new Point(pointer.pageX, pointer.pageY);
    });
  }
}
exports.TouchFlow = TouchFlow;