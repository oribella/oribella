"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _defaults = function (obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Engine = require("./engine");

var _GestureRegistry = require("./gesture-registry");

var _touchEnabled$msPointerEnabled$pointerEnabled = require("./utils");

var _MouseFlow = require("./flows/mouse");

var _TouchFlow = require("./flows/touch");

var _MSPointerFlow = require("./flows/ms-pointer");

var _PointerFlow = require("./flows/pointer");

_defaults(exports, _interopRequireWildcard(_touchEnabled$msPointerEnabled$pointerEnabled));

var Oribella = (function () {
  function Oribella(element, engine) {
    _classCallCheck(this, Oribella);

    this.element = element || window.document;
    this.engine = engine || new _Engine.Engine(this.element, new _GestureRegistry.GestureRegistry());
  }

  _createClass(Oribella, [{
    key: "activate",
    value: function activate() {
      return this.engine.activate();
    }
  }, {
    key: "withDefaultFlowStrategy",
    value: function withDefaultFlowStrategy() {
      if (_touchEnabled$msPointerEnabled$pointerEnabled.msPointerEnabled) {
        this.engine.addFlow(new _MSPointerFlow.MSPointerFlow(this.element));
      }
      if (_touchEnabled$msPointerEnabled$pointerEnabled.pointerEnabled) {
        this.engine.addFlow(new _PointerFlow.PointerFlow(this.element));
      }
      if (_touchEnabled$msPointerEnabled$pointerEnabled.touchEnabled) {
        this.engine.addFlow(new _TouchFlow.TouchFlow(this.element));
      }

      this.engine.addFlow(new _MouseFlow.MouseFlow(this.element));
      return this;
    }
  }, {
    key: "registerGesture",
    value: function registerGesture(type, Gesture) {
      this.engine.registerGesture(type, Gesture);
      return this;
    }
  }, {
    key: "getGestures",
    value: function getGestures(element) {
      return this.engine.getGestures(element);
    }
  }]);

  return Oribella;
})();

exports.Oribella = Oribella;