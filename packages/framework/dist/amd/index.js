"use strict";

var _loop = function _loop(_key2) {
  if (_key2 === "default") return "continue";
  Object.defineProperty(exports, _key2, {
    enumerable: true,
    get: function get() {
      return _oribella[_key2];
    }
  });
};

define(["exports", "./oribella"], function (exports, _oribella) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  for (var _key2 in _oribella) {
    var _ret = _loop(_key2);

    if (_ret === "continue") continue;
  }
});