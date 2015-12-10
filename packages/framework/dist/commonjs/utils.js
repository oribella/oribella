"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.matchesSelector = matchesSelector;
var GESTURE_STARTED = exports.GESTURE_STARTED = "__started__";

var STRATEGY_FLAG = exports.STRATEGY_FLAG = {
  REMOVE_IF_POINTERS_GT: 1
};

var RETURN_FLAG = exports.RETURN_FLAG = {
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
        break;
      default:
        result = 0;
    }

    return result;
  },

  STARTED: 1,
  REMOVE: 2,
  REMOVE_OTHERS: 4
};

function matchesSelector(element, selector) {
  return (element.matchesSelector || element.webkitMatchesSelector || element.mozMatchesSelector || element.msMatchesSelector || element.oMatchesSelector).call(element, selector);
}