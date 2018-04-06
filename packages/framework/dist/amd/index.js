"use strict";

define(["exports", "./point", "./utils", "./oribella"], function (exports, _point, _utils, _oribella) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, "Point", {
    enumerable: true,
    get: function get() {
      return _point.Point;
    }
  });
  Object.defineProperty(exports, "GESTURE_STARTED", {
    enumerable: true,
    get: function get() {
      return _utils.GESTURE_STARTED;
    }
  });
  Object.defineProperty(exports, "STRATEGY_FLAG", {
    enumerable: true,
    get: function get() {
      return _utils.STRATEGY_FLAG;
    }
  });
  Object.defineProperty(exports, "RETURN_FLAG", {
    enumerable: true,
    get: function get() {
      return _utils.RETURN_FLAG;
    }
  });
  Object.defineProperty(exports, "matchesSelector", {
    enumerable: true,
    get: function get() {
      return _utils.matchesSelector;
    }
  });
  Object.defineProperty(exports, "Oribella", {
    enumerable: true,
    get: function get() {
      return _oribella.Oribella;
    }
  });
});