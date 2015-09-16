define(["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.matchesSelector = matchesSelector;
  var GESTURE_STARTED = "__started__";

  exports.GESTURE_STARTED = GESTURE_STARTED;
  var STRATEGY_FLAG = {
    REMOVE_IF_POINTERS_GT: 1
  };

  exports.STRATEGY_FLAG = STRATEGY_FLAG;
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

  exports.RETURN_FLAG = RETURN_FLAG;

  function matchesSelector(element, selector) {
    return (element.matchesSelector || element.webkitMatchesSelector || element.mozMatchesSelector || element.msMatchesSelector || element.oMatchesSelector).call(element, selector);
  }
});