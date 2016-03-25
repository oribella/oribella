"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*eslint no-cond-assign: 0*/

function removeListener(element, event, fn) {
  element.removeEventListener(event, fn, false);
}

function addListener(element, event, fn) {
  element.addEventListener(event, fn, false);
  return removeListener.bind(null, element, event, fn);
}

var Flow = exports.Flow = function () {
  function Flow(element, Point, events, stopEmulatedMouseEvents) {
    _classCallCheck(this, Flow);

    this.element = element;
    this.Point = Point;
    this.events = events;
    this.stopEmulatedMouseEvents = stopEmulatedMouseEvents;
    this.addListeners = [];
    this.removeListeners = [];
    this.allPointers = {};
    this.currentPointers = {};
    this.init();
  }

  Flow.prototype.init = function init() {
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
  };

  Flow.prototype.normalizePoints = function normalizePoints() /*event, data, Point*/{
    throw new Error("normalizePoints: must be implemented in sub class");
  };

  Flow.prototype.onStart = function onStart(startCallback) {
    this.startCallback = startCallback;
    return this;
  };

  Flow.prototype.onUpdate = function onUpdate(updateCallback) {
    this.updateCallback = updateCallback;
    return this;
  };

  Flow.prototype.onCancel = function onCancel(cancelCallback) {
    this.cancelCallback = cancelCallback;
    return this;
  };

  Flow.prototype.onEnd = function onEnd(endCallback) {
    this.endCallback = endCallback;
    return this;
  };

  Flow.prototype.onStop = function onStop(stopCallback) {
    this.stopCallback = stopCallback;
  };

  Flow.prototype.activate = function activate() {
    return this.startListener();
  };

  Flow.prototype.start = function start(event) {
    this.normalizePoints(event, this.Point);
    if (this.startCallback(this, event, this.allPointers, this.currentPointers)) {
      this.continue();
    }
  };

  Flow.prototype.continue = function _continue() {
    var i,
        cnt = this.addListeners.length;

    for (i = 0; i < cnt; ++i) {
      this.removeListeners.push(this.addListeners[i]());
    }
  };

  Flow.prototype.update = function update(event) {
    this.normalizePoints(event, this.Point);
    this.updateCallback(this, event, this.allPointers, this.currentPointers);
  };

  Flow.prototype.end = function end(event) {
    this.normalizePoints(event, this.Point);
    this.endCallback(this, event, this.allPointers, this.currentPointers);
    if (Object.keys(this.allPointers).length === 0) {
      this.stop();
    }
  };

  Flow.prototype.cancel = function cancel(event) {
    this.cancelCallback(this, event, this.allPointers, this.currentPointers);
    this.stop();
  };

  Flow.prototype.stop = function stop() {
    var i,
        cnt = this.removeListeners.length;

    for (i = 0; i < cnt; ++i) {
      this.removeListeners[i]();
    }
    this.removeListeners.length = 0;
    this.stopCallback(this);
  };

  return Flow;
}();
//# sourceMappingURL=flow.js.map