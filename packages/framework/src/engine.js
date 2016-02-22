/*eslint no-cond-assign: 0*/
import {Handle} from "./handle";
import {GESTURE_STARTED, STRATEGY_FLAG, RETURN_FLAG, matchesSelector} from "./utils";

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
    flow.onStart(this.startFlow.bind(this))
      .onUpdate(this.updateFlow.bind(this))
      .onCancel(this.cancelFlow.bind(this))
      .onEnd(this.endFlow.bind(this))
      .onStop(this.stopFlow.bind(this));
    return flow;
  }
  canActivateFlow(flow) {
    return (this.activeFlow === null || this.activeFlow === flow);
  }
  startFlow(flow, event, allPointers, currentPointers) {
    if (!this.canActivateFlow(flow)) {
      return false;
    }

    this.activeFlow = flow;

    this.gestures = this.gestures
                      .concat(this.match(event.target))
                      .sort( (g1, g2) => {
                        return g1.subscriber.options.prio -
                          g2.subscriber.options.prio;
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
      if (allResult > 0 && options.strategy & STRATEGY_FLAG.REMOVE_IF_POINTERS_GT){
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
          if (!gesture[GESTURE_STARTED]){
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
    gesture.bind(this.addHandle.bind(this), handle.element, this.removeGesture.bind(this, gesture, this.gestures, this.composedGestures), () => { gesture[GESTURE_STARTED] = true; });
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
      for (i = 0; i < this.handles.length; ++i) { //Always evaluate length since gestures could bind gestures
        handle = this.handles[i];
        selector = handle.subscriber.selector;

        if (!handle.element.contains(element) || (selector && handle.element === element)) {
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
