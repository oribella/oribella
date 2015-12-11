"use strict";

define(["exports", "./point", "./utils", "./oribella"], function (exports, _point, _utils, _oribella) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  for (let _key in _point) {
    if (_key === "default") continue;
    Object.defineProperty(exports, _key, {
      enumerable: true,
      get: function () {
        return _point[_key];
      }
    });
  }

  for (let _key2 in _utils) {
    if (_key2 === "default") continue;
    Object.defineProperty(exports, _key2, {
      enumerable: true,
      get: function () {
        return _utils[_key2];
      }
    });
  }

  for (let _key3 in _oribella) {
    if (_key3 === "default") continue;
    Object.defineProperty(exports, _key3, {
      enumerable: true,
      get: function () {
        return _oribella[_key3];
      }
    });
  }
});