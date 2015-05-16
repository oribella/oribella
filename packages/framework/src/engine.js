/*eslint no-cond-assign: 0, no-underscore-dangle: 0*/
import {Handler} from "./handler";
import {Validator} from "./validator";
import {MouseFlow} from "./flows/mouse";
import {GESTURE_STARTED, RETURN_FLAG, matchesSelector} from "./utils";

var ACTION_START = "start",
  ACTION_UPDATE = "update",
  ACTION_END = "end",
  ACTION_CANCEL = "cancel";

export class Engine {
  constructor(element, gestureRegistry, validator) {
    this.element = element;
    this.gestureRegistry = gestureRegistry;
    this.validator = validator || new Validator();
    this.flows = [];
    this.activeFlow = undefined;
    this.handlers = [];
    this.gestures = [];
    this.composedGestures = [];
  }
  registerGesture(type, Gesture) {
    this.gestureRegistry.register(type, Gesture);
  }
  getGestures(element) {
    var engine = this;

    if (!(element instanceof Element)) {
      throw new Error("Invalid parameter");
    }

    var exposeGesture = function(e, t, s) {
        return engine.addHandler(e, t, s);
    };

    var gestures = {},
      types = Object.keys(engine.gestureRegistry.gestures);

    types.forEach(type => {
      gestures[type] = exposeGesture.bind(null, element, type);
    });

    return gestures;
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
  addHandler(element, type, subscriber) {
    var handler = Handler.create(element, type, subscriber),
      handlers = this.handlers;

    handlers.push(handler);

    function removeHandler() {
      var ix = handlers.indexOf(handler);
      if (ix !== -1) {
        //TODO: Remove gestures and tear down
        handlers.splice(ix, 1);
      }
    }

    return removeHandler;
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
    return (this.activeFlow === undefined || this.activeFlow === flow);
  }
  startFlow(flow, e, data) {
    if (!this.canActivateFlow(flow)) {
      return false;
    }

    //Try match
    if (!this.activeFlow) { //Only match for first start
      this.gestures = this.match(e.target);
      if (!this.gestures.length) {
        return false; //No match don't continue
      }
      this.activeFlow = flow;
    }

    this.triggerGestures(flow, e, data, ACTION_START);
    return true;
  }
  updateFlow(flow, e, data) {
    this.triggerGestures(flow, e, data, ACTION_UPDATE);
  }
  cancelFlow(flow, e, data) {
    this.triggerGestures(flow, e, data, ACTION_CANCEL);
  }
  endFlow(flow, e, data) {
    this.triggerGestures(flow, e, data, ACTION_END);
  }
  stopFlow() {
    var gestures = this.gestures.slice(),
      gesture,
      result,
      handlers = this.handlers.slice(),
      handler;

    while (gesture = gestures.shift()) {
      result = gesture.unbind();
      if (result === false) {
        this.composedGestures.push(gesture);
      }
    }

    while (handler = handlers.shift()) {
      handler.active = false;
    }
    this.gestures.length = 0;
    this.activeFlow = undefined;
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
  triggerGestures(flow, e, data, action) {
    if (this.activeFlow !== flow) {
      return;
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
      if (result & RETURN_FLAG.REMOVE) {
        if (gesture[GESTURE_STARTED]) {
          gesture[ACTION_CANCEL]();
        }
        this.removeIn(gesture, gestures, this.gestures);
      }
      if (result & RETURN_FLAG.REMOVE_OTHER_TYPES) {
        otherGestures = this.gestures.slice();
        while (otherGesture = otherGestures.shift()) {
          if (otherGesture.__type !== gesture.__type) {
            if (otherGesture[GESTURE_STARTED]) {
              otherGesture[ACTION_CANCEL]();
            }
            this.removeIn(otherGesture, gestures, this.gestures);
          }
        }
      }
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
  }
  createGesture(handler, element) {
    var gesture = this.gestureRegistry.get(handler.type, handler.subscriber, element);
    gesture.bind(this.getGestures.bind(this), handler.element, this.removeGesture.bind(this, gesture));
    return gesture;
  }
  match(startElement) {
    var i,
      handler,
      element,
      selector,
      gesture,
      gestures = [];

    for (element = startElement; element !== this.element; element = element.parentNode) {
      for (i = 0; i < this.handlers.length; ++i) { //Always evaluate length since gestures could bind gestures
        handler = this.handlers[i];
        if (handler.active) {
          continue;
        }
        if (!handler.element.contains(element)) {
          continue;
        }
        selector = handler.subscriber.selector;
        if (!selector && element === handler.element) {
          handler.active = true;
        } else if (selector) {
          if (matchesSelector(element, selector)) {
            handler.active = true;
          }
        }
        if (handler.active) {
          while (gesture = this.composedGestures.shift()) {
            if (gesture.subscriber === handler.subscriber) {
              break;
            }
          }
          if (!gesture) {
            gesture = this.createGesture(handler, element);
          }
          gestures.push(gesture);
        }
      }
    }

    return gestures.sort(function (g1, g2) {
      return g1.subscriber.options.prio - g2.subscriber.options.prio;
    });
  };
}
