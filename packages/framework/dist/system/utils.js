System.register([], function (_export) {
  var touchEnabled, msPointerEnabled, pointerEnabled, GESTURE_STARTED, RETURN_FLAG;

  _export("isMouse", isMouse);

  _export("matchesSelector", matchesSelector);

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

  function matchesSelector(element, selector) {
    return (element.matchesSelector || element.webkitMatchesSelector || element.mozMatchesSelector || element.msMatchesSelector || element.oMatchesSelector).call(element, selector);
  }

  return {
    setters: [],
    execute: function () {
      "use strict";

      touchEnabled = !!("ontouchstart" in window);

      _export("touchEnabled", touchEnabled);

      msPointerEnabled = !!window.MSPointerEvent;

      _export("msPointerEnabled", msPointerEnabled);

      pointerEnabled = !!window.PointerEvent;

      _export("pointerEnabled", pointerEnabled);

      GESTURE_STARTED = "__started__";

      _export("GESTURE_STARTED", GESTURE_STARTED);

      RETURN_FLAG = {
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

      _export("RETURN_FLAG", RETURN_FLAG);
    }
  };
});