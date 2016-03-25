"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Engine = exports.ACTION_CANCEL = exports.ACTION_END = exports.ACTION_UPDATE = exports.ACTION_START = undefined;

var _handle = require("./handle");

var _utils = require("./utils");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /*eslint no-cond-assign: 0*/


var POINTERS = "__pointers__";

var ACTION_START = exports.ACTION_START = "start",
    ACTION_UPDATE = exports.ACTION_UPDATE = "update",
    ACTION_END = exports.ACTION_END = "end",
    ACTION_CANCEL = exports.ACTION_CANCEL = "cancel";

var Engine = exports.Engine = function () {
  function Engine(element, registry, isMouse, isValidMouseButton) {
    _classCallCheck(this, Engine);

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

  Engine.prototype.registerGesture = function registerGesture(type, Gesture) {
    this.registry.register(type, Gesture);
  };

  Engine.prototype.activate = function activate() {
    var stopListeners = [];
    this.flows.forEach(function (flow) {
      stopListeners.push(flow.activate());
    });
    return function () {
      stopListeners.forEach(function (stop) {
        return stop();
      });
    };
  };

  Engine.prototype.addHandle = function addHandle(element, type, subscriber) {
    var _this = this;

    var handle = new _handle.Handle(element, type, subscriber);

    this.handles.push(handle);

    return function () {
      var ix = _this.handles.indexOf(handle);
      if (ix !== -1) {
        _this.handles.splice(ix, 1);
      }
    };
  };

  Engine.prototype.addFlow = function addFlow(flow) {
    this.flows.push(flow);
    flow.onStart(this.startFlow.bind(this)).onUpdate(this.updateFlow.bind(this)).onCancel(this.cancelFlow.bind(this)).onEnd(this.endFlow.bind(this)).onStop(this.stopFlow.bind(this));
    return flow;
  };

  Engine.prototype.canActivateFlow = function canActivateFlow(flow) {
    return this.activeFlow === null || this.activeFlow === flow;
  };

  Engine.prototype.startFlow = function startFlow(flow, event, allPointers, currentPointers) {
    if (!this.canActivateFlow(flow)) {
      return false;
    }

    this.activeFlow = flow;

    this.gestures = this.gestures.concat(this.match(event.target)).sort(function (g1, g2) {
      return g1.subscriber.options.prio - g2.subscriber.options.prio;
    });

    if (!this.gestures.length) {
      return false; //No match don't continue
    }

    this.processEvent(flow, event, allPointers, currentPointers, ACTION_START);

    return true;
  };

  Engine.prototype.updateFlow = function updateFlow(flow, event, allPointers, currentPointers) {
    this.processEvent(flow, event, allPointers, currentPointers, ACTION_UPDATE);
  };

  Engine.prototype.cancelFlow = function cancelFlow(flow, event, allPointers, currentPointers) {
    this.processEvent(flow, event, allPointers, currentPointers, ACTION_CANCEL);
  };

  Engine.prototype.endFlow = function endFlow(flow, event, allPointers, currentPointers) {
    this.processEvent(flow, event, allPointers, currentPointers, ACTION_END);
  };

  Engine.prototype.stopFlow = function stopFlow() {
    var gestures = this.gestures.slice(),
        gesture = void 0,
        result = void 0;

    while (gesture = gestures.shift()) {
      result = gesture.unbind();
      if (result === false) {
        this.composedGestures.push(gesture);
      }
    }

    this.gestures.length = 0;
    this.activeFlow = null;
  };

  Engine.prototype.removeGesture = function removeGesture(gesture) {
    if (gesture[_utils.GESTURE_STARTED]) {
      gesture[ACTION_CANCEL]();
    }
    gesture.unbind();
    var gestures = void 0;

    for (var _len = arguments.length, arr = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      arr[_key - 1] = arguments[_key];
    }

    while (gestures = arr.shift()) {
      var ix = gestures.indexOf(gesture);
      if (ix !== -1) {
        gestures.splice(ix, 1);
      }
    }
  };

  Engine.prototype.processEvent = function processEvent(flow, event, allPointers, currentPointers, action) {
    if (this.activeFlow !== flow) {
      return;
    }
    this.processGestures(event, allPointers, currentPointers, action);
  };

  Engine.prototype.getPointersDelta = function getPointersDelta(event, pointerCount, options) {
    if (this.isMouse(event) && !this.isValidMouseButton(event, options.which)) {
      return -1;
    }
    return pointerCount - options.touches;
  };

  Engine.prototype.processGestures = function processGestures(event, allPointers, currentPointers, action) {
    var gestures = this.gestures.slice(),
        gesture = void 0,
        result = void 0,
        allResult = void 0,
        allPointerCnt = Object.keys(allPointers).length,
        currentPointerIds = Object.keys(currentPointers),
        currentPointerCnt = currentPointerIds.length,
        pointerIx = void 0,
        pointerId = void 0,
        pointerIds = void 0,
        pointerCnt = void 0,
        pointers = void 0,
        hasPointer = void 0,
        removePointers = void 0,
        removeGesture = void 0,
        options = void 0;

    while (gesture = gestures.shift()) {
      hasPointer = false;
      removePointers = false;
      removeGesture = false;
      pointers = gesture[POINTERS];
      options = gesture.subscriber.options;

      allResult = this.getPointersDelta(event, allPointerCnt, options);
      if (allResult > 0 && options.strategy & _utils.STRATEGY_FLAG.REMOVE_IF_POINTERS_GT) {
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
          if (!gesture[_utils.GESTURE_STARTED]) {
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
      var mappedPointers = [];
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
        gesture[_utils.GESTURE_STARTED] = false;
        this.removeGesture(gesture, this.gestures, this.composedGestures, gestures);
      }
    }
  };

  Engine.prototype.processGesture = function processGesture(event, pointers, action, gesture, gestures) {
    //Call
    var result = gesture[action](event, pointers);
    if (result & _utils.RETURN_FLAG.STARTED) {
      gesture[_utils.GESTURE_STARTED] = true;
    }

    //Remove gesture
    if (result & _utils.RETURN_FLAG.REMOVE) {
      this.removeGesture(gesture, this.gestures, this.composedGestures, gestures);
    }

    //Remove all other gestures
    if (result & _utils.RETURN_FLAG.REMOVE_OTHERS) {
      var otherGestures = gestures.slice();
      var otherGesture = void 0;
      while (otherGesture = otherGestures.shift()) {
        if (gesture === otherGesture) {
          continue;
        }
        if (otherGesture[_utils.GESTURE_STARTED]) {
          otherGesture[ACTION_CANCEL]();
        }
        this.removeGesture(otherGesture, this.gestures, this.composedGestures, gestures);
      }
    }
  };

  Engine.prototype.createGesture = function createGesture(handle, element) {
    var gesture = this.registry.create(handle.type, handle.subscriber, element);
    gesture.bind(this.addHandle.bind(this), handle.element, this.removeGesture.bind(this, gesture, this.gestures, this.composedGestures), function () {
      gesture[_utils.GESTURE_STARTED] = true;
    });
    return gesture;
  };

  Engine.prototype.match = function match(startElement) {
    var i = void 0,
        handle = void 0,
        element = void 0,
        selector = void 0,
        gesture = void 0,
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
          if ((0, _utils.matchesSelector)(element, selector)) {
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
  };

  return Engine;
}();
//# sourceMappingURL=engine.js.map