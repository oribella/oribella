/*eslint no-cond-assign: 0*/

function removeListener(element, event, fn) {
  element.removeEventListener(event, fn, false);
}

function addListener(element, event, fn) {
  element.addEventListener(event, fn, false);
  return removeListener.bind(null, element, event, fn);
}

export let Flow = class Flow {
  constructor(element, Point, events, stopEmulatedMouseEvents) {
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
  init() {
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
  normalizePoints() /*event, data, Point*/{
    throw new Error("normalizePoints: must be implemented in sub class");
  }
  onStart(startCallback) {
    this.startCallback = startCallback;
    return this;
  }
  onUpdate(updateCallback) {
    this.updateCallback = updateCallback;
    return this;
  }
  onCancel(cancelCallback) {
    this.cancelCallback = cancelCallback;
    return this;
  }
  onEnd(endCallback) {
    this.endCallback = endCallback;
    return this;
  }
  onStop(stopCallback) {
    this.stopCallback = stopCallback;
  }
  activate() {
    return this.startListener();
  }
  start(event) {
    this.normalizePoints(event, this.Point);
    if (this.startCallback(this, event, this.allPointers, this.currentPointers)) {
      this.continue();
    }
  }
  continue() {
    var i,
        cnt = this.addListeners.length;

    for (i = 0; i < cnt; ++i) {
      this.removeListeners.push(this.addListeners[i]());
    }
  }
  update(event) {
    this.normalizePoints(event, this.Point);
    this.updateCallback(this, event, this.allPointers, this.currentPointers);
  }
  end(event) {
    this.normalizePoints(event, this.Point);
    this.endCallback(this, event, this.allPointers, this.currentPointers);
    if (Object.keys(this.allPointers).length === 0) {
      this.stop();
    }
  }
  cancel(event) {
    this.cancelCallback(this, event, this.allPointers, this.currentPointers);
    this.stop();
  }
  stop() {
    var i,
        cnt = this.removeListeners.length;

    for (i = 0; i < cnt; ++i) {
      this.removeListeners[i]();
    }
    this.removeListeners.length = 0;
    this.stopCallback(this);
  }
};
//# sourceMappingURL=flow.js.map