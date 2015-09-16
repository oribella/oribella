"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopExportWildcard(obj, defaults) { var newObj = defaults({}, obj); delete newObj["default"]; return newObj; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _engine = require("./engine");

var _registry = require("./registry");

var _flowsMouse = require("./flows/mouse");

var _flowsTouch = require("./flows/touch");

var _flowsMsPointer = require("./flows/ms-pointer");

var _flowsPointer = require("./flows/pointer");

var _point = require("./point");

_defaults(exports, _interopExportWildcard(_point, _defaults));

var _utils = require("./utils");

_defaults(exports, _interopExportWildcard(_utils, _defaults));

var Oribella = (function () {
  function Oribella(element, config) {
    _classCallCheck(this, Oribella);

    this.element = element;
    this.config = config;
    this.registry = new _registry.Registry();
    this.engine = new _engine.Engine(this.element, this.registry, this.isMouse.bind(this), this.isValidMouseButton.bind(this));
  }

  _createClass(Oribella, [{
    key: "activate",
    value: function activate() {
      return this.engine.activate();
    }
  }, {
    key: "withDefaultFlowStrategy",
    value: function withDefaultFlowStrategy() {
      if (this.config.msPointerEnabled) {
        this.engine.addFlow(new _flowsMsPointer.MSPointerFlow(this.element, _point.Point));
      }
      if (this.config.pointerEnabled) {
        this.engine.addFlow(new _flowsPointer.PointerFlow(this.element, _point.Point));
      }
      if (this.config.touchEnabled) {
        this.engine.addFlow(new _flowsTouch.TouchFlow(this.element, _point.Point));
      }

      this.engine.addFlow(new _flowsMouse.MouseFlow(this.element, _point.Point));
      return this;
    }
  }, {
    key: "registerGesture",
    value: function registerGesture(type, Gesture) {
      this.engine.registerGesture(type, Gesture);
      return this;
    }
  }, {
    key: "on",
    value: function on(element, type, subscriber) {
      return this.engine.addHandle(element, type, subscriber);
    }
  }, {
    key: "isMouse",
    value: function isMouse(e) {
      if (this.config.msPointerEnabled && e.pointerType === e.MSPOINTER_TYPE_MOUSE) {
        //IE10
        return true;
      }
      if (this.config.pointerEnabled && e.pointerType === "mouse") {
        //IE11
        return true;
      }
      if (e.type.indexOf("mouse") !== -1) {
        return true;
      }
      return false;
    }
  }, {
    key: "isValidMouseButton",
    value: function isValidMouseButton(event, allowedBtn) {
      var btn = event.button,
          which = event.which,
          actualBtn;

      actualBtn = !which && btn !== undefined ? btn & 1 ? 1 : btn & 2 ? 3 : btn & 4 ? 2 : 0 : which;
      return Array.isArray(allowedBtn) ? allowedBtn.some(function (val) {
        return actualBtn === val;
      }) : actualBtn === allowedBtn;
    }
  }]);

  return Oribella;
})();

exports.Oribella = Oribella;