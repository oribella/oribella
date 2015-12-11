"use strict";

System.register([], function (_export) {
  return {
    setters: [],
    execute: function () {
      const GESTURE_STARTED = "__started__";

      _export("GESTURE_STARTED", GESTURE_STARTED);

      const STRATEGY_FLAG = {
        REMOVE_IF_POINTERS_GT: 1
      };

      _export("STRATEGY_FLAG", STRATEGY_FLAG);

      const RETURN_FLAG = {
        map(result) {
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

      _export("RETURN_FLAG", RETURN_FLAG);

      function matchesSelector(element, selector) {
        return (element.matchesSelector || element.webkitMatchesSelector || element.mozMatchesSelector || element.msMatchesSelector || element.oMatchesSelector).call(element, selector);
      }

      _export("matchesSelector", matchesSelector);
    }
  };
});