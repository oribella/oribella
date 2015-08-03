/*eslint no-cond-assign: 0, no-underscore-dangle: 0*/
import {Handle} from "./handle";
import {MouseFlow} from "./flows/mouse";
import {GESTURE_STARTED, RETURN_FLAG, matchesSelector} from "./utils";

export var ACTION_START = "start",
  ACTION_UPDATE = "update",
  ACTION_END = "end",
  ACTION_CANCEL = "cancel";

export class Engine {
  constructor(element, registry, validator) {
    this.element = element;
    this.registry = registry;
    this.validator = validator;
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
    flow.onStart(this.startFlow.bind(this))
      .onUpdate(this.updateFlow.bind(this))
      .onCancel(this.cancelFlow.bind(this))
      .onEnd(this.endFlow.bind(this))
      .onStop(this.stopFlow.bind(this));
    return flow;
  }
  canActivateFlow(flow) {
    if ((this.activeFlow instanceof MouseFlow) && (flow instanceof MouseFlow)) {
      return true; //Solves the scrollbar mousedown issue for IE
    }
    return (this.activeFlow === null || this.activeFlow === flow);
  }
  startFlow(flow, e, data) {
    if (!this.canActivateFlow(flow)) {
      return false;
    }

    this.activeFlow = flow;

    this.gestures = this.gestures
                      .concat(this.match(e.target))
                      .sort( (g1, g2) => {
                        return g1.subscriber.options.prio -
                          g2.subscriber.options.prio;
                      });

    if (!this.gestures.length) {
      return false; //No match don't continue
    }

    this.processEvent(flow, e, data, ACTION_START);

    return true;
  }
  updateFlow(flow, e, data) {
    this.processEvent(flow, e, data, ACTION_UPDATE);
  }
  cancelFlow(flow, e, data) {
    this.processEvent(flow, e, data, ACTION_CANCEL);
  }
  endFlow(flow, e, data) {
    this.processEvent(flow, e, data, ACTION_END);
  }
  stopFlow() {
    var gestures = this.gestures.slice(),
      gesture,
      result,
      handles = this.handles.slice(),
      handler;

    while (gesture = gestures.shift()) {
      result = gesture.unbind();
      if (result === false) {
        this.composedGestures.push(gesture);
      }
    }

    while (handler = handles.shift()) {
      handler.active = false;
    }
    this.gestures.length = 0;
    this.activeFlow = null;
  }
  removeIn(...args) {
    var g = args.shift(),
      arr;

    g.unbind();

    while (arr = args.shift()) {
      var ix = arr.indexOf(g);
      if (ix !== -1) {
        arr.splice(ix, 1);
      }
    }
  }
  removeGesture(gesture) {
    this.removeIn(gesture, this.gestures, this.composedGestures);
  }
  processEvent(flow, e, data, action) {
    if (this.activeFlow !== flow) {
      return false;
    }
    var gestures = this.gestures.slice(),
      gesture,
      result,
      valid,
      otherGestures,
      otherGesture;

    while (gesture = gestures.shift()) {
      //Validate
      valid = true;
      switch (action) {
      case ACTION_START:
        valid = this.validator[ACTION_START](e, data, gesture.subscriber.options);
        break;
      case ACTION_UPDATE:
        valid = this.validator[ACTION_UPDATE](e, data, gesture.subscriber.options);
        break;
      case ACTION_END:
        valid = this.validator[ACTION_END](e, data, gesture.subscriber.options);
        valid = valid && gesture[GESTURE_STARTED];
        break;
      }
      if (valid === false) { //Remove
        if (gesture[GESTURE_STARTED]) {
          gesture[ACTION_CANCEL]();
        }
        this.removeIn(gesture, gestures, this.gestures);
      }
      if (!valid) {
        continue;
      }
      //Call
      result = gesture[action](e, data);
      if (result & RETURN_FLAG.STARTED) {
        gesture[GESTURE_STARTED] = true;
      }

      //Remove gesture
      if (result & RETURN_FLAG.REMOVE) {
        if (gesture[GESTURE_STARTED]) {
          gesture[ACTION_CANCEL]();
        }
        this.removeIn(gesture, gestures, this.gestures);
      }

      //Remove all other gestures
      if (result & RETURN_FLAG.REMOVE_OTHERS) {
        otherGestures = this.gestures.slice();
        while (otherGesture = otherGestures.shift()) {
          if (gesture === otherGesture) {
            continue;
          }
          if (otherGesture[GESTURE_STARTED]) {
            otherGesture[ACTION_CANCEL]();
          }
          this.removeIn(otherGesture, gestures, this.gestures);
        }
      }
    }
    return true;
  }
  createGesture(handler, element) {
    var gesture = this.registry.create(handler.type, handler.subscriber, element);
    gesture.bind(this.addHandle.bind(this), handler.element, this.removeGesture.bind(this, gesture));
    return gesture;
  }
  match(startElement) {
    var i,
      handle,
      element,
      selector,
      gesture,
      gestures = [];

    for (element = startElement; element !== this.element; element = element.parentNode) {
      for (i = 0; i < this.handles.length; ++i) { //Always evaluate length since gestures could bind gestures
        handle = this.handles[i];
        if (handle.active) {
          continue;
        }
        if (!handle.element.contains(element)) {
          continue;
        }
        selector = handle.subscriber.selector;
        if (!selector && element === handle.element) {
          handle.active = true;
        } else if (selector) {
          if (matchesSelector(element, selector)) {
            handle.active = true;
          }
        }
        if (handle.active) {
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
  };
}
