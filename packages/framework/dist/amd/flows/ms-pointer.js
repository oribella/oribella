"use strict";

define(["exports", "./pointer"], function (exports, _pointer) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MSPointerFlow = undefined;

  class MSPointerFlow extends _pointer.PointerFlow {
    constructor(element, Point) {
      super(element, Point, [{
        start: ["MSPointerDown"]
      }, {
        update: ["MSPointerMove"]
      }, {
        end: ["MSPointerUp"]
      }, {
        cancel: ["MSPointerCancel", "dragstart"]
      }]);
    }

  }

  exports.MSPointerFlow = MSPointerFlow;
});