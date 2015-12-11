"use strict";

var _loop3 = function _loop3(_key6) {
  if (_key6 === "default") return "continue";
  Object.defineProperty(exports, _key6, {
    enumerable: true,
    get: function get() {
      return _oribella[_key6];
    }
  });
};

var _loop2 = function _loop2(_key5) {
  if (_key5 === "default") return "continue";
  Object.defineProperty(exports, _key5, {
    enumerable: true,
    get: function get() {
      return _utils[_key5];
    }
  });
};

var _loop = function _loop(_key4) {
  if (_key4 === "default") return "continue";
  Object.defineProperty(exports, _key4, {
    enumerable: true,
    get: function get() {
      return _point[_key4];
    }
  });
};

define(["exports", "./point", "./utils", "./oribella"], function (exports, _point, _utils, _oribella) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  for (var _key4 in _point) {
    var _ret = _loop(_key4);

    if (_ret === "continue") continue;
  }

  for (var _key5 in _utils) {
    var _ret2 = _loop2(_key5);

    if (_ret2 === "continue") continue;
  }

  for (var _key6 in _oribella) {
    var _ret3 = _loop3(_key6);

    if (_ret3 === "continue") continue;
  }
});