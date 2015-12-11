"use strict";

System.register(["./point", "./utils", "./oribella"], function (_export) {
  return {
    setters: [function (_point) {
      var _exportObj = {};

      for (var _key in _point) {
        if (_key !== "default") _exportObj[_key] = _point[_key];
      }

      _export(_exportObj);
    }, function (_utils) {
      var _exportObj2 = {};

      for (var _key2 in _utils) {
        if (_key2 !== "default") _exportObj2[_key2] = _utils[_key2];
      }

      _export(_exportObj2);
    }, function (_oribella) {
      var _exportObj3 = {};

      for (var _key3 in _oribella) {
        if (_key3 !== "default") _exportObj3[_key3] = _oribella[_key3];
      }

      _export(_exportObj3);
    }],
    execute: function () {}
  };
});