define(["exports"], function (exports) {
  /*eslint no-cond-assign: 0*/

  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function removeListener(element, event, fn) {
    element.removeEventListener(event, fn, false);
  }

  function addListener(element, event, fn) {
    element.addEventListener(event, fn, false);
    return removeListener.bind(null, element, event, fn);
  }

  var Flow = (function () {
    function Flow(element, Point, events, stopEmulatedMouseEvents) {
      _classCallCheck(this, Flow);

      this.element = element;
      this.Point = Point;
      this.events = events;
      this.stopEmulatedMouseEvents = stopEmulatedMouseEvents;
      this.addListeners = [];
      this.removeListeners = [];
      this.pointers = {};
      this.init();
    }

    _createClass(Flow, [{
      key: "init",
      value: function init() {
        var event, key, types, type, fn;

        while (event = this.events.shift()) {
          key = Object.keys(event).shift();
          types = event[key];
          fn = this[key].bind(this);

          if (key === "start") {
            this.startListener = addListener.bind(null, this.element, types.shift(), fn);
          } else {
            while (type = types.shift()) {
              this.addListeners.push(addListener.bind(null, this.element, type, fn));
            }
          }
        }
      }
    }, {
      key: "normalizePoints",
      value: function normalizePoints() /*event, data, Point*/{
        throw new Error("normalizePoints: must be implemented in sub class");
      }
    }, {
      key: "onStart",
      value: function onStart(startCallback) {
        this.startCallback = startCallback;
        return this;
      }
    }, {
      key: "onUpdate",
      value: function onUpdate(updateCallback) {
        this.updateCallback = updateCallback;
        return this;
      }
    }, {
      key: "onCancel",
      value: function onCancel(cancelCallback) {
        this.cancelCallback = cancelCallback;
        return this;
      }
    }, {
      key: "onEnd",
      value: function onEnd(endCallback) {
        this.endCallback = endCallback;
        return this;
      }
    }, {
      key: "onStop",
      value: function onStop(stopCallback) {
        this.stopCallback = stopCallback;
      }
    }, {
      key: "activate",
      value: function activate() {
        return this.startListener();
      }
    }, {
      key: "start",
      value: function start(event) {
        var _this = this;

        var pointers = this.normalizePoints(event, this.Point);
        Object.keys(pointers).forEach(function (key) {
          return _this.pointers[key] = pointers[key];
        });
        if (this.startCallback(this, event, this.pointers, pointers)) {
          this["continue"]();
        }
      }
    }, {
      key: "continue",
      value: function _continue() {
        var i,
            cnt = this.addListeners.length;

        for (i = 0; i < cnt; ++i) {
          this.removeListeners.push(this.addListeners[i]());
        }
      }
    }, {
      key: "update",
      value: function update(event) {
        var _this2 = this;

        var pointers = this.normalizePoints(event, this.Point);
        Object.keys(pointers).forEach(function (key) {
          return _this2.pointers[key] = pointers[key];
        });
        this.updateCallback(this, event, this.pointers, pointers);
      }
    }, {
      key: "end",
      value: function end(event) {
        var _this3 = this;

        var pointers = this.normalizePoints(event, this.Point);
        pointers = pointers || this.pointers; //could return null
        Object.keys(pointers).forEach(function (key) {
          return delete _this3.pointers[key];
        });
        this.endCallback(this, event, this.pointers, pointers);
        if (Object.keys(this.pointers).length === 0) {
          this.stop();
        }
      }
    }, {
      key: "cancel",
      value: function cancel(event) {
        this.cancelCallback(this, event, this.pointers, this.pointers);
        this.stop();
      }
    }, {
      key: "stop",
      value: function stop() {
        var i,
            cnt = this.removeListeners.length;

        for (i = 0; i < cnt; ++i) {
          this.removeListeners[i]();
        }
        this.removeListeners.length = 0;
        this.stopCallback(this);
      }
    }]);

    return Flow;
  })();

  exports.Flow = Flow;
});