"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Ensure = (function () {
  function Ensure(fns) {
    _classCallCheck(this, Ensure);

    this.fns = fns;
  }

  _createClass(Ensure, [{
    key: "ensure",
    value: function ensure(o) {
      this.fns.forEach(function (key) {
        if (typeof o[key] !== "function") {
          o[key] = function () {};
        }
      });
    }
  }]);

  return Ensure;
})();

exports.Ensure = Ensure;

var DefaultGestureOptions = {
  touches: 1,
  which: 1,
  prio: 100
};

function getOwnPropertyDescriptors(src) {
  var descriptors = {};
  Object.getOwnPropertyNames(src).forEach(function (key) {
    descriptors[key] = Object.getOwnPropertyDescriptor(src, key);
  });
  return descriptors;
}

var Registry = (function () {
  function Registry() {
    _classCallCheck(this, Registry);

    this.gestures = {};
    this.defaultGesture = new Ensure(["start", "update", "end", "cancel", "bind", "unbind"]);
    this.defaultSubscriber = new Ensure(["down", "start", "update", "end", "cancel"]);
  }

  _createClass(Registry, [{
    key: "register",
    value: function register(type, Gesture) {
      this.defaultGesture.ensure(Gesture.prototype);
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
      var defaultOptions = null;
      var defaultOptionsPropertyDescriptors = {};
      this.defaultSubscriber.ensure(subscriber);
      if (typeof this.gestures[type].defaultOptions === "function") {
        defaultOptions = this.gestures[type].defaultOptions();
        defaultOptionsPropertyDescriptors = getOwnPropertyDescriptors(defaultOptions);
      }
      defaultOptions = Object.create(DefaultGestureOptions, defaultOptionsPropertyDescriptors);
      var optionsPropertyDescriptors = getOwnPropertyDescriptors(subscriber.options);
      subscriber.options = Object.create(defaultOptions, optionsPropertyDescriptors);
      var gesture = new this.gestures[type](subscriber, element);
      return gesture;
    }
  }]);

  return Registry;
})();

exports.Registry = Registry;