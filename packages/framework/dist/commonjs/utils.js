"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.matchesSelector = matchesSelector;
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