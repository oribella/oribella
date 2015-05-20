System.register(["../point"], function (_export) {
  var Point, _classCallCheck, _createClass, Flow;

  function removeListener(element, event, fn) {
    element.removeEventListener(event, fn, false);
  }

  function addListener(element, event, fn) {
    element.addEventListener(event, fn, false);
    return removeListener.bind(null, element, event, fn);
  }

  return {
    setters: [function (_point) {
      Point = _point.Point;
    }],
    execute: function () {
      "use strict";

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      Flow = (function () {
        function Flow(element, events, stopEmulatedMouseEvents) {
          _classCallCheck(this, Flow);

          this.element = element;
          this.events = events;
          this.stopEmulatedMouseEvents = stopEmulatedMouseEvents;
          this.addListeners = [];
          this.removeListeners = [];
          this.data = {
            pagePoints: []
          };
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
          value: function normalizePoints(event) {
            this.data.pagePoints.length = 0;
            this.data.pagePoints.push(new Point(event.pageX, event.pageY));
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
          value: function start(e) {
            this.normalizePoints(e);
            if (this.startCallback(this, e, this.data)) {
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
          value: function update(e) {
            this.normalizePoints(e);
            this.updateCallback(this, e, this.data);
          }
        }, {
          key: "end",
          value: function end(e) {
            this.normalizePoints(e);
            this.endCallback(this, e, this.data);
            this.stop();
          }
        }, {
          key: "cancel",
          value: function cancel(e) {
            this.normalizePoints(e);
            this.cancelCallback(this, e, this.data);
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
            if (this.stopEmulatedMouseEvents) {
              this.captureAndStopMouseEvents(this.stopCallback.bind(null, this));
            } else {
              this.stopCallback(this);
            }
            this.data.pagePoints.length = 0;
          }
        }]);

        return Flow;
      })();

      _export("Flow", Flow);
    }
  };
});
/*eslint no-cond-assign: 0*/