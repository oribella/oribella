System.register(["./point", "./utils", "./oribella"], function (_export) {
  "use strict";

  return {
    setters: [function (_point) {
      _export("Point", _point.Point);
    }, function (_utils) {
      _export("GESTURE_STARTED", _utils.GESTURE_STARTED);

      _export("STRATEGY_FLAG", _utils.STRATEGY_FLAG);

      _export("RETURN_FLAG", _utils.RETURN_FLAG);

      _export("matchesSelector", _utils.matchesSelector);
    }, function (_oribella) {
      _export("Oribella", _oribella.Oribella);
    }],
    execute: function () {}
  };
});