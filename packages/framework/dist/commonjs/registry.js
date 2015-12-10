"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DefaultSubscriber = exports.DefaultSubscriber = {
  down: function down() {},
  start: function start() {},
  update: function update() {},
  end: function end() {},
  cancel: function cancel() {}
};
var DefaultGesture = exports.DefaultGesture = {
  start: function start() {},
  update: function update() {},
  end: function end() {},
  cancel: function cancel() {},
  bind: function bind() {},
  unbind: function unbind() {}
};

var Registry = exports.Registry = (function () {
  function Registry() {
    _classCallCheck(this, Registry);

    this.gestures = {};
  }

  _createClass(Registry, [{
    key: "register",
    value: function register(type, Gesture) {
      this.ensure(Gesture.prototype, DefaultGesture);
      this.gestures[type] = Gesture;
    }
  }, {
    key: "getTypes",
    value: function getTypes() {
      return Object.keys(this.gestures);
    }
  }, {
    key: "create",
    value: function create(type, subscriber, element) {
      var defaultOptions;
      this.ensureSubscriberProto(subscriber);
      if (typeof this.gestures[type].defaultOptions === "function") {
        defaultOptions = this.gestures[type].defaultOptions();
      }
      if (typeof subscriber.options === "undefined") {
        subscriber.options = {};
      }
      this.ensureSubscriberOptions(defaultOptions, subscriber.options);
      var gesture = new this.gestures[type](subscriber, element);
      //gesture.__type__ = type;
      return gesture;
    }
  }, {
    key: "ensure",
    value: function ensure(proto, defaultProto) {
      Object.keys(defaultProto).forEach(function (key) {
        if (_typeof(proto[key]) !== _typeof(defaultProto[key])) {
          proto[key] = defaultProto[key];
        }
      });
    }
  }, {
    key: "ensureSubscriberProto",
    value: function ensureSubscriberProto(subscriber) {
      if ((typeof subscriber === "undefined" ? "undefined" : _typeof(subscriber)) !== "object") {
        throw new Error("Invalid parameter. Should be an object");
      }
      this.ensure(subscriber, DefaultSubscriber);
    }
  }, {
    key: "ensureSubscriberOptions",
    value: function ensureSubscriberOptions(defaultOptions, options) {
      if (typeof defaultOptions === "undefined") {
        defaultOptions = {};
      }
      if (typeof defaultOptions.touches !== "number") {
        defaultOptions.touches = 1;
      }
      if (typeof defaultOptions.which !== "number") {
        defaultOptions.which = 1;
      }
      if (typeof defaultOptions.prio !== "number") {
        defaultOptions.prio = 100;
      }

      Object.keys(defaultOptions).forEach(function (key) {
        var type = _typeof(options[key]);
        if (type === "undefined" || type !== _typeof(defaultOptions[key])) {
          options[key] = defaultOptions[key];
        }
      });
    }
  }]);

  return Registry;
})();