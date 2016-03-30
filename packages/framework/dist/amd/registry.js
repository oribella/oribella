define(["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Ensure = exports.Ensure = function () {
    function Ensure(fns) {
      _classCallCheck(this, Ensure);

      this.fns = fns;
    }

    Ensure.prototype.ensure = function ensure(o) {
      this.fns.forEach(function (key) {
        if (typeof o[key] !== "function") {
          o[key] = function () {};
        }
      });
    };

    return Ensure;
  }();

  var DefaultGestureOptions = {
    touches: 1,
    which: 1,
    prio: 100
  };

  function getOwnPropertyDescriptors() {
    var src = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var descriptors = {};
    Object.keys(src).forEach(function (key) {
      descriptors[key] = Object.getOwnPropertyDescriptor(src, key);
    });
    return descriptors;
  }

  var Registry = exports.Registry = function () {
    function Registry() {
      _classCallCheck(this, Registry);

      this.gestures = {};
      this.defaultGesture = new Ensure(["start", "update", "end", "cancel", "bind", "unbind"]);
      this.defaultSubscriber = new Ensure(["down", "start", "update", "end", "cancel"]);
    }

    Registry.prototype.register = function register(type, Gesture) {
      this.defaultGesture.ensure(Gesture.prototype);
      this.gestures[type] = Gesture;
    };

    Registry.prototype.getTypes = function getTypes() {
      return Object.keys(this.gestures);
    };

    Registry.prototype.create = function create(type, subscriber, element) {
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
    };

    return Registry;
  }();
});
//# sourceMappingURL=registry.js.map