/*eslint no-cond-assign: 0*/

function removeListener(element, event, fn) {
  element.removeEventListener(event, fn, false);
}

function addListener(element, event, fn) {
  element.addEventListener(event, fn, false);
  return removeListener.bind(null, element, event, fn);
}

export class Flow {
  constructor(element, Point, events, stopEmulatedMouseEvents) {
    this.element = element;
    this.Point = Point;
    this.events = events;
    this.stopEmulatedMouseEvents = stopEmulatedMouseEvents;
    this.addListeners = [];
    this.removeListeners = [];
    this.data = {
      pointerIds: [],
      pagePoints: []
    };
    this.init();
  }
  init() {
    var event,
      key,
      types,
      type,
      fn;

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
  normalizePoints(event, data, Point) {
    data.pagePoints.length = 0;
    data.pagePoints.push(new Point(event.pageX, event.pageY));
  }
  removePoints(e, data) {
    data.pagePoints.length = 0;
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
  start(e) {
    this.normalizePoints(e, this.data, this.Point);
    if (this.startCallback(this, e, this.data.pagePoints)) {
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
  update(e) {
    this.normalizePoints(e, this.data, this.Point);
    this.updateCallback(this, e, this.data.pagePoints);
  }
  end(e) {
    this.normalizePoints(e, this.data, this.Point);
    this.endCallback(this, e, this.data.pagePoints);
    this.removePoints(e, this.data);
    if(!this.data.pagePoints.length) {
      this.stop();
    }
  }
  cancel(e) {
    this.normalizePoints(e, this.data, this.Point);
    this.cancelCallback(this, e, this.data.pagePoints);
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
}
