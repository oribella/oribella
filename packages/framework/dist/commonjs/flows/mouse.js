"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MouseFlow = undefined;

var _flow = require("./flow");

class MouseFlow extends _flow.Flow {
  constructor(element, Point) {
    super(element, Point, [{
      start: ["mousedown"]
    }, {
      update: ["mousemove"]
    }, {
      end: ["mouseup"]
    }, {
      cancel: ["dragstart", "contextmenu"]
    }], false);
  }
  normalizePoints(event, Point) {
    switch (event.type) {
      case "mousedown":
      case "mousemove":
        this.allPointers = this.currentPointers = {
          1: new Point(event.pageX, event.pageY)
        };
        break;
      default:
        this.allPointers = {};
        break;
    }
  }
}
exports.MouseFlow = MouseFlow;