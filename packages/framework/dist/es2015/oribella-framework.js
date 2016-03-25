/*eslint no-cond-assign: 0*/
import { Handle } from "./handle";
import { GESTURE_STARTED, STRATEGY_FLAG, RETURN_FLAG, matchesSelector } from "./utils";

var POINTERS = "__pointers__";

export var ACTION_START = "start",
    ACTION_UPDATE = "update",
    ACTION_END = "end",
    ACTION_CANCEL = "cancel";

export class Engine {
  constructor(element, registry, isMouse, isValidMouseButton) {
    this.element = element;
    this.registry = registry;
    this.isMouse = isMouse;
    this.isValidMouseButton = isValidMouseButton;
    this.flows = [];
    this.activeFlow = null;
    this.handles = [];
    this.gestures = [];
    this.composedGestures = [];
  }
  registerGesture(type, Gesture) {
    this.registry.register(type, Gesture);
  }
  activate() {
    var stopListeners = [];
    this.flows.forEach(flow => {
      stopListeners.push(flow.activate());
    });
    return () => {
      stopListeners.forEach(stop => stop());
    };
  }
  addHandle(element, type, subscriber) {
    var handle = new Handle(element, type, subscriber);

    this.handles.push(handle);

    return () => {
      var ix = this.handles.indexOf(handle);
      if (ix !== -1) {
        this.handles.splice(ix, 1);
      }
    };
  }
  addFlow(flow) {
    this.flows.push(flow);
    flow.onStart(this.startFlow.bind(this)).onUpdate(this.updateFlow.bind(this)).onCancel(this.cancelFlow.bind(this)).onEnd(this.endFlow.bind(this)).onStop(this.stopFlow.bind(this));
    return flow;
  }
  canActivateFlow(flow) {
    return this.activeFlow === null || this.activeFlow === flow;
  }
  startFlow(flow, event, allPointers, currentPointers) {
    if (!this.canActivateFlow(flow)) {
      return false;
    }

    this.activeFlow = flow;

    this.gestures = this.gestures.concat(this.match(event.target)).sort((g1, g2) => {
      return g1.subscriber.options.prio - g2.subscriber.options.prio;
    });

    if (!this.gestures.length) {
      return false; //No match don't continue
    }

    this.processEvent(flow, event, allPointers, currentPointers, ACTION_START);

    return true;
  }
  updateFlow(flow, event, allPointers, currentPointers) {
    this.processEvent(flow, event, allPointers, currentPointers, ACTION_UPDATE);
  }
  cancelFlow(flow, event, allPointers, currentPointers) {
    this.processEvent(flow, event, allPointers, currentPointers, ACTION_CANCEL);
  }
  endFlow(flow, event, allPointers, currentPointers) {
    this.processEvent(flow, event, allPointers, currentPointers, ACTION_END);
  }
  stopFlow() {
    let gestures = this.gestures.slice(),
        gesture,
        result;

    while (gesture = gestures.shift()) {
      result = gesture.unbind();
      if (result === false) {
        this.composedGestures.push(gesture);
      }
    }

    this.gestures.length = 0;
    this.activeFlow = null;
  }
  removeGesture(gesture, ...arr) {
    if (gesture[GESTURE_STARTED]) {
      gesture[ACTION_CANCEL]();
    }
    gesture.unbind();
    let gestures;
    while (gestures = arr.shift()) {
      let ix = gestures.indexOf(gesture);
      if (ix !== -1) {
        gestures.splice(ix, 1);
      }
    }
  }
  processEvent(flow, event, allPointers, currentPointers, action) {
    if (this.activeFlow !== flow) {
      return;
    }
    this.processGestures(event, allPointers, currentPointers, action);
  }
  getPointersDelta(event, pointerCount, options) {
    if (this.isMouse(event) && !this.isValidMouseButton(event, options.which)) {
      return -1;
    }
    return pointerCount - options.touches;
  }
  processGestures(event, allPointers, currentPointers, action) {
    let gestures = this.gestures.slice(),
        gesture,
        result,
        allResult,
        allPointerCnt = Object.keys(allPointers).length,
        currentPointerIds = Object.keys(currentPointers),
        currentPointerCnt = currentPointerIds.length,
        pointerIx,
        pointerId,
        pointerIds,
        pointerCnt,
        pointers,
        hasPointer,
        removePointers,
        removeGesture,
        options;

    while (gesture = gestures.shift()) {
      hasPointer = false;
      removePointers = false;
      removeGesture = false;
      pointers = gesture[POINTERS];
      options = gesture.subscriber.options;

      allResult = this.getPointersDelta(event, allPointerCnt, options);
      if (allResult > 0 && options.strategy & STRATEGY_FLAG.REMOVE_IF_POINTERS_GT) {
        this.removeGesture(gesture, this.gestures, this.composedGestures, gestures);
        continue;
      }

      result = this.getPointersDelta(event, currentPointerCnt, options);
      switch (action) {
        case ACTION_START:
          if (result !== 0) {
            if (allResult === 0) {
              currentPointers = allPointers;
            } else {
              continue;
            }
          }
          if (pointers && Object.keys(pointers).length === currentPointerCnt) {
            continue;
          }
          //Lock pointers for gesture
          gesture[POINTERS] = pointers = currentPointers;
          hasPointer = true;
          break;
        case ACTION_UPDATE:
          //Update pointers for gesture
          pointerIx = 0;
          while (pointerIx < currentPointerCnt) {
            pointerId = currentPointerIds[pointerIx];
            if (pointers && pointers[pointerId]) {
              pointers[pointerId] = currentPointers[pointerId];
              hasPointer = true;
            }
            ++pointerIx;
          }
          break;
        case ACTION_END:
          if (!gesture[GESTURE_STARTED]) {
            continue;
          }
          pointerIx = 0;
          while (pointerIx < currentPointerCnt) {
            pointerId = currentPointerIds[pointerIx];
            if (pointers && pointers[pointerId]) {
              hasPointer = true;
              removePointers = true;
            }
            ++pointerIx;
          }
          if (pointers && !Object.keys(pointers).length) {
            hasPointer = true;
            removeGesture = true;
          }
          break;
        case ACTION_CANCEL:
          pointers = currentPointers;
          hasPointer = true;
          break;
      }
      if (!hasPointer) {
        continue;
      }
      //Map pointers to separate object reference
      const mappedPointers = [];
      pointerIx = 0;
      pointerIds = Object.keys(pointers);
      pointerCnt = pointerIds.length;
      while (pointerIx < pointerCnt) {
        mappedPointers.push(pointers[pointerIds[pointerIx]]);
        ++pointerIx;
      }
      this.processGesture(event, mappedPointers, action, gesture, gestures);

      if (removePointers) {
        pointerIx = 0;
        while (pointerIx < currentPointerCnt) {
          pointerId = currentPointerIds[pointerIx];
          if (pointers[pointerId]) {
            delete pointers[pointerId];
          }
          ++pointerIx;
        }
      }

      if (removeGesture) {
        gesture[POINTERS] = null;
        gesture[GESTURE_STARTED] = false;
        this.removeGesture(gesture, this.gestures, this.composedGestures, gestures);
      }
    }
  }
  processGesture(event, pointers, action, gesture, gestures) {
    //Call
    let result = gesture[action](event, pointers);
    if (result & RETURN_FLAG.STARTED) {
      gesture[GESTURE_STARTED] = true;
    }

    //Remove gesture
    if (result & RETURN_FLAG.REMOVE) {
      this.removeGesture(gesture, this.gestures, this.composedGestures, gestures);
    }

    //Remove all other gestures
    if (result & RETURN_FLAG.REMOVE_OTHERS) {
      let otherGestures = gestures.slice();
      let otherGesture;
      while (otherGesture = otherGestures.shift()) {
        if (gesture === otherGesture) {
          continue;
        }
        if (otherGesture[GESTURE_STARTED]) {
          otherGesture[ACTION_CANCEL]();
        }
        this.removeGesture(otherGesture, this.gestures, this.composedGestures, gestures);
      }
    }
  }
  createGesture(handle, element) {
    var gesture = this.registry.create(handle.type, handle.subscriber, element);
    gesture.bind(this.addHandle.bind(this), handle.element, this.removeGesture.bind(this, gesture, this.gestures, this.composedGestures), () => {
      gesture[GESTURE_STARTED] = true;
    });
    return gesture;
  }
  match(startElement) {
    let i,
        handle,
        element,
        selector,
        gesture,
        gestures = [],
        matched = false;

    for (element = startElement; element !== this.element; element = element.parentNode) {
      for (i = 0; i < this.handles.length; ++i) {
        //Always evaluate length since gestures could bind gestures
        handle = this.handles[i];
        selector = handle.subscriber.selector;

        if (!handle.element.contains(element) || selector && handle.element === element) {
          continue;
        }

        if (!selector && element === handle.element) {
          matched = true;
        } else if (selector) {
          if (matchesSelector(element, selector)) {
            matched = true;
          }
        }
        if (matched) {
          while (gesture = this.composedGestures.shift()) {
            if (gesture.subscriber === handle.subscriber) {
              break;
            }
          }
          if (!gesture) {
            gesture = this.createGesture(handle, element);
          }
          gestures.push(gesture);
        }
      }
    }

    return gestures;
  }
}
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
}
import { Flow } from "./flow";

export class MouseFlow extends Flow {
  constructor(element, Point) {
    super(element, Point, [{
      start: ["mousedown"]
    }, {
      update: ["mousemove"]
    }, {
      end: ["mouseup"]
    }, {
      cancel: ["dragstart", "contextmenu"]
    }], false);
  }
  normalizePoints(event, Point) {
    switch (event.type) {
      case "mousedown":
      case "mousemove":
        this.allPointers = this.currentPointers = {
          1: {
            page: new Point(event.pageX, event.pageY),
            client: new Point(event.clientX, event.clientY)
          }
        };
        break;
      default:
        this.allPointers = {};
        break;
    }
  }
}
import { PointerFlow } from "./pointer";

export class MSPointerFlow extends PointerFlow {
  constructor(element, Point) {
    super(element, Point, [{
      start: ["MSPointerDown"]
    }, {
      update: ["MSPointerMove"]
    }, {
      end: ["MSPointerUp"]
    }, {
      cancel: ["MSPointerCancel", "dragstart"]
    }]);
  }
}
import { Flow } from "./flow";

export class PointerFlow extends Flow {
  constructor(element, Point) {
    super(element, Point, [{
      start: ["pointerdown"]
    }, {
      update: ["pointermove"]
    }, {
      end: ["pointerup"]
    }, {
      cancel: ["pointercancel", "dragstart"]
    }]);
  }
  normalizePoints(event, Point) {
    this.currentPointers = {};
    this.currentPointers[event.pointerId] = {
      page: new Point(event.pageX, event.pageY),
      client: new Point(event.clientX, event.clientY)
    };

    switch (event.type) {
      case "pointerdown":
      case "pointermove":
        this.allPointers[event.pointerId] = {
          page: new Point(event.pageX, event.pageY),
          client: new Point(event.clientX, event.clientY)
        };
        break;
      default:
        delete this.allPointers[event.pointerId];
        break;
    }
  }
}
import { Flow } from "./flow";

export class TouchFlow extends Flow {
  constructor(element, Point) {
    super(element, Point, [{
      start: ["touchstart"]
    }, {
      update: ["touchmove"]
    }, {
      end: ["touchend", "mouseup", "click"]
    }, {
      cancel: ["touchcancel", "dragstart"]
    }], true);
  }
  normalizePoints(event, Point) {
    this.allPointers = {};
    this.currentPointers = {};

    Array.prototype.slice.call(event.touches).forEach(pointer => {
      this.allPointers[pointer.identifier] = {
        page: new Point(pointer.pageX, pointer.pageY),
        client: new Point(pointer.clientX, pointer.clientY)
      };
    });

    Array.prototype.slice.call(event.changedTouches).forEach(pointer => {
      this.currentPointers[pointer.identifier] = {
        page: new Point(pointer.pageX, pointer.pageY),
        client: new Point(pointer.clientX, pointer.clientY)
      };
    });
  }
}
export class Handle {
  constructor(element, type, subscriber, active) {
    this.element = element;
    this.type = type;
    this.subscriber = subscriber;
    this.active = active;
  }
}
export { Point } from "./point";
export { GESTURE_STARTED, STRATEGY_FLAG, RETURN_FLAG, matchesSelector } from "./utils";
export { Oribella } from "./oribella";
import { Engine } from "./engine";
import { Registry } from "./registry";
import { MouseFlow } from "./flows/mouse";
import { TouchFlow } from "./flows/touch";
import { MSPointerFlow } from "./flows/ms-pointer";
import { PointerFlow } from "./flows/pointer";
import { Point } from "./point";

export class Oribella {
  constructor(element, config) {
    this.element = element;
    this.config = config;
    this.registry = new Registry();
    this.engine = new Engine(this.element, this.registry, this.isMouse.bind(this), this.isValidMouseButton.bind(this));
  }
  activate() {
    return this.engine.activate();
  }
  withDefaultFlowStrategy() {
    if (this.config.msPointerEnabled) {
      this.engine.addFlow(new MSPointerFlow(this.element, Point));
      return this;
    }
    if (this.config.pointerEnabled) {
      this.engine.addFlow(new PointerFlow(this.element, Point));
      return this;
    }

    if (this.config.touchEnabled) {
      this.engine.addFlow(new TouchFlow(this.element, Point));
    }

    this.engine.addFlow(new MouseFlow(this.element, Point));
    return this;
  }
  registerGesture(type, Gesture) {
    this.engine.registerGesture(type, Gesture);
    return this;
  }
  on(element, type, subscriber) {
    return this.engine.addHandle(element, type, subscriber);
  }
  isMouse(e) {
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
  isValidMouseButton(event, allowedBtn) {
    var btn = event.button,
        which = event.which,
        actualBtn;

    actualBtn = !which && btn !== undefined ? btn & 1 ? 1 : btn & 2 ? 3 : btn & 4 ? 2 : 0 : which;
    return Array.isArray(allowedBtn) ? allowedBtn.some(function (val) {
      return actualBtn === val;
    }) : actualBtn === allowedBtn;
  }
}
export class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  distanceTo(p) {
    var xdist = this.x - p.x,
        ydist = this.y - p.y,
        dist = Math.sqrt(xdist * xdist + ydist * ydist);

    return dist;
  }
  deltaAngleTo(p) {
    var x = p.x - this.x,
        y = p.y - this.y,
        theta = Math.atan2(y, x),
        degrees = theta * 180 / Math.PI;
    return degrees;
  }
  clone() {
    return new Point(this.x, this.y);
  }
}
export class Ensure {
  constructor(fns) {
    this.fns = fns;
  }
  ensure(o) {
    this.fns.forEach(key => {
      if (typeof o[key] !== "function") {
        o[key] = function () {};
      }
    });
  }
}

const DefaultGestureOptions = {
  touches: 1,
  which: 1,
  prio: 100
};

function getOwnPropertyDescriptors(src) {
  const descriptors = {};
  Object.getOwnPropertyNames(src).forEach(key => {
    descriptors[key] = Object.getOwnPropertyDescriptor(src, key);
  });
  return descriptors;
}

export class Registry {
  constructor() {
    this.gestures = {};
    this.defaultGesture = new Ensure(["start", "update", "end", "cancel", "bind", "unbind"]);
    this.defaultSubscriber = new Ensure(["down", "start", "update", "end", "cancel"]);
  }
  register(type, Gesture) {
    this.defaultGesture.ensure(Gesture.prototype);
    this.gestures[type] = Gesture;
  }
  getTypes() {
    return Object.keys(this.gestures);
  }
  create(type, subscriber, element) {
    let defaultOptions = null;
    let defaultOptionsPropertyDescriptors = {};
    this.defaultSubscriber.ensure(subscriber);
    if (typeof this.gestures[type].defaultOptions === "function") {
      defaultOptions = this.gestures[type].defaultOptions();
      defaultOptionsPropertyDescriptors = getOwnPropertyDescriptors(defaultOptions);
    }
    defaultOptions = Object.create(DefaultGestureOptions, defaultOptionsPropertyDescriptors);
    const optionsPropertyDescriptors = getOwnPropertyDescriptors(subscriber.options);
    subscriber.options = Object.create(defaultOptions, optionsPropertyDescriptors);
    let gesture = new this.gestures[type](subscriber, element);
    return gesture;
  }
}
export const GESTURE_STARTED = "__started__";

export const STRATEGY_FLAG = {
  REMOVE_IF_POINTERS_GT: 1
};

export const RETURN_FLAG = {
  map(result) {
    switch (result) {
      case true:
        result = this.REMOVE_OTHERS;
        break;
      case false:
        result = this.REMOVE;
        break;
      case 1:
      case 2:
      case 4:
        break;
      default:
        result = 0;
    }

    return result;
  },
  STARTED: 1,
  REMOVE: 2,
  REMOVE_OTHERS: 4
};

export function matchesSelector(element, selector) {
  return (element.matchesSelector || element.webkitMatchesSelector || element.mozMatchesSelector || element.msMatchesSelector || element.oMatchesSelector).call(element, selector);
}

//# sourceMappingURL=oribella-framework.js.map