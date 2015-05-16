"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isMouse = isMouse;
exports.matchesSelector = matchesSelector;
var touchEnabled = !!("ontouchstart" in window);
exports.touchEnabled = touchEnabled;
var msPointerEnabled = !!window.MSPointerEvent;
exports.msPointerEnabled = msPointerEnabled;
var pointerEnabled = !!window.PointerEvent;

exports.pointerEnabled = pointerEnabled;

function isMouse(e) {
  if (msPointerEnabled && e.pointerType === e.MSPOINTER_TYPE_MOUSE) {
    //IE10
    return true;
  }
  if (pointerEnabled && e.pointerType === "mouse") {
    //IE11
    return true;
  }
  if (e.type.indexOf("mouse") !== -1) {
    return true;
  }
  return false;
}

var GESTURE_STARTED = "__started__";

exports.GESTURE_STARTED = GESTURE_STARTED;
var RETURN_FLAG = {
  map: function map(result) {
    switch (result) {
      case true:
        result = this.REMOVE_OTHERS;
        break;
      case false:
        result = this.REMOVE;
        break;
      case 1:
      case 2:
      case 4:
      case 8:
        break;
      default:
        result = 0;
    }

    return result;
  },
  STARTED: 1,
  REMOVE: 2,
  REMOVE_OTHER_TYPES: 4,
  REMOVE_OTHERS: 8
};

exports.RETURN_FLAG = RETURN_FLAG;

function matchesSelector(element, selector) {
  return (element.matchesSelector || element.webkitMatchesSelector || element.mozMatchesSelector || element.msMatchesSelector || element.oMatchesSelector).call(element, selector);
}